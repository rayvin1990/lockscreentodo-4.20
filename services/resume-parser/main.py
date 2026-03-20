from fastapi import FastAPI, UploadFile, File, WebSocket, WebSocketDisconnect, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from contextlib import asynccontextmanager
import logging
import aiofiles
import os
from pathlib import Path
from typing import Optional

from config import settings
from models.schemas import TaskResponse, TaskStatus
from task_manager import task_manager
from database import db_manager

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('logs/api.log'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Lifespan event handler for startup and shutdown"""
    # Startup
    logger.info("Starting Resume Parser API...")

    # Initialize database
    await db_manager.connect()

    # Initialize task manager with Hugging Face model
    await task_manager.initialize(
        model_name=settings.huggingface_model,
        api_token=settings.huggingface_api_token
    )

    logger.info("Resume Parser API started successfully")

    yield

    # Shutdown
    logger.info("Shutting down Resume Parser API...")
    await db_manager.disconnect()
    logger.info("Resume Parser API stopped")


# Create FastAPI app
app = FastAPI(
    title="Resume Parser API",
    description="AI-powered resume parsing using Hugging Face LayoutLMv3/Donut",
    version="1.0.0",
    lifespan=lifespan
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "service": "Resume Parser API",
        "model": settings.huggingface_model
    }


@app.post("/api/upload", response_model=TaskResponse)
async def upload_resume(
    file: UploadFile = File(...),
    user_id: Optional[str] = None
):
    """
    Upload a resume file for parsing

    Returns immediately with a task ID. Use the /ws/{task_id} WebSocket endpoint
    to receive real-time updates on parsing progress.
    """
    try:
        # Validate file extension
        file_extension = Path(file.filename).suffix.lower().lstrip('.')
        allowed_extensions = settings.allowed_extensions.split(',')

        if file_extension not in allowed_extensions:
            raise HTTPException(
                status_code=400,
                detail=f"Invalid file type. Allowed types: {', '.join(allowed_extensions)}"
            )

        # Validate file size
        content = await file.read()
        if len(content) > settings.max_upload_size:
            raise HTTPException(
                status_code=400,
                detail=f"File too large. Maximum size: {settings.max_upload_size} bytes"
            )

        # Save file to uploads directory
        uploads_dir = Path("uploads")
        uploads_dir.mkdir(exist_ok=True)

        # Generate unique filename
        from datetime import datetime
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        safe_filename = f"{timestamp}_{file.filename}"
        file_path = uploads_dir / safe_filename

        async with aiofiles.open(file_path, 'wb') as f:
            await f.write(content)

        logger.info(f"File saved: {file_path}")

        # Use demo user ID if not provided
        if not user_id:
            user_id = "demo-user"
            logger.warning("No user_id provided, using demo-user")

        # Create parsing task
        task_id = await task_manager.create_task(
            str(file_path),
            user_id,
            file.filename
        )

        logger.info(f"Created task {task_id} for file {file.filename}")

        return TaskResponse(
            task_id=task_id,
            status=TaskStatus.PENDING,
            message=f"Resume uploaded successfully. Use task ID {task_id} to track progress."
        )

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error uploading file: {e}")
        raise HTTPException(status_code=500, detail=f"Error uploading file: {str(e)}")


@app.get("/api/tasks/{task_id}")
async def get_task_status(task_id: str):
    """Get the current status of a parsing task"""
    task = task_manager.get_task_status(task_id)

    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    return {
        "task_id": task['task_id'],
        "status": task['status'],
        "progress": task['progress'],
        "message": task['message'],
        "result": task.get('result'),
        "error": task.get('error'),
        "created_at": task['created_at']
    }


@app.websocket("/ws/{task_id}")
async def websocket_endpoint(websocket: WebSocket, task_id: str):
    """
    WebSocket endpoint for real-time task updates

    Connect to this endpoint with the task_id to receive:
    - Real-time logs during parsing
    - Progress updates
    - Final parsed data

    Messages are sent as JSON with the following structure:
    {
        "type": "log" | "status",
        "task_id": "...",
        "level": "info" | "warning" | "error",  // for log type
        "message": "...",
        "timestamp": 1234567890.123,
        "status": "pending" | "processing" | "completed" | "failed",  // for status type
        "progress": 0.5,  // 0.0 to 1.0
        "result": { ... }  // parsed data when completed
    }
    """
    await websocket.accept()

    logger.info(f"WebSocket connected for task {task_id}")

    # Register websocket connection
    task_manager.register_websocket(task_id, websocket)

    try:
        # Send current status immediately
        task = task_manager.get_task_status(task_id)
        if task:
            await websocket.send_json({
                "type": "status",
                "task_id": task_id,
                "status": task['status'],
                "progress": task['progress'],
                "message": task['message'],
                "result": task.get('result')
            })

        # Keep connection alive and listen for client messages
        while True:
            try:
                # Wait for messages from client (e.g., ping/pong)
                data = await websocket.receive_text()

                # Echo back or handle specific messages
                if data == "ping":
                    await websocket.send_text("pong")

            except WebSocketDisconnect:
                logger.info(f"WebSocket disconnected for task {task_id}")
                break

    except Exception as e:
        logger.error(f"WebSocket error for task {task_id}: {e}")

    finally:
        # Unregister websocket
        task_manager.unregister_websocket(task_id, websocket)


@app.get("/api/tasks")
async def list_tasks(user_id: Optional[str] = None, limit: int = 50):
    """
    List recent tasks (optional: filter by user_id)

    Note: In production, you would store tasks in a database
    """
    tasks = list(task_manager.tasks.values())

    # Filter by user_id if provided
    if user_id:
        tasks = [t for t in tasks if t.get('user_id') == user_id]

    # Sort by creation time (newest first)
    tasks.sort(key=lambda x: x['created_at'], reverse=True)

    # Limit results
    tasks = tasks[:limit]

    # Remove sensitive information
    for task in tasks:
        task.pop('file_path', None)

    return {
        "total": len(tasks),
        "tasks": tasks
    }


@app.delete("/api/tasks/{task_id}")
async def delete_task(task_id: str):
    """Delete a task and its associated data"""
    task = task_manager.get_task_status(task_id)

    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    # Delete uploaded file
    file_path = task.get('file_path')
    if file_path and os.path.exists(file_path):
        try:
            os.remove(file_path)
            logger.info(f"Deleted file: {file_path}")
        except Exception as e:
            logger.error(f"Error deleting file: {e}")

    # Remove task from memory
    del task_manager.tasks[task_id]

    return {"message": "Task deleted successfully"}


@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "service": "Resume Parser API",
        "version": "1.0.0",
        "endpoints": {
            "health": "/health",
            "upload": "/api/upload",
            "task_status": "/api/tasks/{task_id}",
            "websocket": "/ws/{task_id}",
            "list_tasks": "/api/tasks",
            "docs": "/docs"
        }
    }


if __name__ == "__main__":
    import uvicorn

    # Create logs directory if it doesn't exist
    Path("logs").mkdir(exist_ok=True)

    # Run the server
    uvicorn.run(
        "main:app",
        host=settings.api_host,
        port=settings.api_port,
        reload=True,
        log_level="info"
    )
