"""
简化版简历解析服务 - 不依赖 Hugging Face 模型
使用规则提取，快速轻量
"""

from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import logging
import re
from pathlib import Path
import aiofiles
import os
from datetime import datetime

from config import settings
from database import db_manager
from task_manager import TaskManager
from models.schemas import TaskStatus

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Create FastAPI app
app = FastAPI(title="Resume Parser API (Minimal)")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

task_manager = TaskManager()

@app.on_event("startup")
async def startup():
    await db_manager.connect()
    logger.info("Resume Parser API (Minimal) started")

@app.on_event("shutdown")
async def shutdown():
    await db_manager.disconnect()

@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "Resume Parser API (Minimal)"}

@app.post("/api/upload")
async def upload_resume(file: UploadFile = File(...), user_id: str = "demo-user"):
    """Upload and parse resume file"""
    try:
        # Save file
        uploads_dir = Path("uploads")
        uploads_dir.mkdir(exist_ok=True)

        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        file_path = uploads_dir / f"{timestamp}_{file.filename}"

        async with aiofiles.open(file_path, 'wb') as f:
            content = await file.read()
            await f.write(content)

        logger.info(f"File saved: {file_path}")

        # Create task
        task_id = await task_manager.create_task(str(file_path), user_id, file.filename)

        return {"task_id": task_id, "status": TaskStatus.PENDING, "message": "Task created"}

    except Exception as e:
        logger.error(f"Upload failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/tasks/{task_id}")
async def get_task_status(task_id: str):
    """Get task status"""
    task = task_manager.get_task_status(task_id)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    return task

@app.websocket("/ws/{task_id}")
async def websocket_endpoint(websocket, task_id: str):
    """WebSocket for real-time updates"""
    await websocket.accept()
    task_manager.register_websocket(task_id, websocket)

    try:
        # Send current status
        task = task_manager.get_task_status(task_id)
        if task:
            await websocket.send_json({
                "type": "status",
                "task_id": task_id,
                "status": task['status'],
                "progress": task['progress'],
                "message": task['message']
            })

        # Keep connection alive
        while True:
            await websocket.receive_text()

    except Exception as e:
        logger.error(f"WebSocket error: {e}")
    finally:
        task_manager.unregister_websocket(task_id, websocket)

if __name__ == "__main__":
    import uvicorn
    Path("logs").mkdir(exist_ok=True)
    uvicorn.run(app, host="0.0.0.0", port=8000, log_level="info")
