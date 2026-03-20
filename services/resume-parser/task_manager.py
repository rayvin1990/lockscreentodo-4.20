import asyncio
import logging
import uuid
from typing import Dict, Callable, Optional
from datetime import datetime
from models.schemas import TaskStatus, TaskUpdate
from services.resume_parser import ResumeParserService
from database import db_manager

logger = logging.getLogger(__name__)


class TaskManager:
    """Manages asynchronous resume parsing tasks"""

    def __init__(self):
        self.tasks: Dict[str, Dict] = {}  # task_id -> task info
        self.websocket_connections: Dict[str, list] = {}  # task_id -> list of websockets
        self.parser_service: Optional[ResumeParserService] = None

    async def initialize(self, model_name: str, api_token: str):
        """Initialize the resume parser service"""
        self.parser_service = ResumeParserService(model_name, api_token)
        await self.parser_service.initialize()

    async def create_task(
        self,
        file_path: str,
        user_id: str,
        filename: str
    ) -> str:
        """Create a new parsing task and return task ID"""
        task_id = str(uuid.uuid4())

        self.tasks[task_id] = {
            "task_id": task_id,
            "status": TaskStatus.PENDING,
            "file_path": file_path,
            "user_id": user_id,
            "filename": filename,
            "created_at": datetime.now().isoformat(),
            "progress": 0.0,
            "message": "Task created, waiting to start...",
            "result": None,
            "error": None
        }

        logger.info(f"Created task {task_id} for user {user_id}")

        # Start the task in the background
        asyncio.create_task(self._execute_task(task_id))

        return task_id

    async def _execute_task(self, task_id: str):
        """Execute the parsing task"""
        task = self.tasks.get(task_id)
        if not task:
            logger.error(f"Task {task_id} not found")
            return

        try:
            # Update status to processing
            await self._update_task_status(
                task_id,
                TaskStatus.PROCESSING,
                progress=0.0,
                message="Starting resume parsing..."
            )

            # Create a log callback for WebSocket updates
            async def log_callback(level: str, message: str):
                await self._send_log_update(task_id, level, message)

            # Parse the resume
            parsed_data = await self.parser_service.parse_resume(
                task['file_path'],
                log_callback
            )

            # Save to database
            await log_callback("info", "Saving data to database...")
            await db_manager.save_resume_data(task['user_id'], parsed_data)

            # Update task as completed
            await self._update_task_status(
                task_id,
                TaskStatus.COMPLETED,
                progress=1.0,
                message="Resume parsing completed successfully!",
                data=parsed_data
            )

            logger.info(f"Task {task_id} completed successfully")

        except Exception as e:
            logger.error(f"Task {task_id} failed: {e}")
            await self._update_task_status(
                task_id,
                TaskStatus.FAILED,
                message=f"Task failed: {str(e)}"
            )

    async def _update_task_status(
        self,
        task_id: str,
        status: TaskStatus,
        progress: float = 0.0,
        message: str = "",
        data: Optional[dict] = None
    ):
        """Update task status and notify connected websockets"""
        if task_id not in self.tasks:
            return

        task = self.tasks[task_id]
        task['status'] = status
        task['progress'] = progress
        task['message'] = message
        if data:
            task['result'] = data

        # Notify all connected websockets
        await self._notify_websockets(task_id)

    async def _send_log_update(self, task_id: str, level: str, message: str):
        """Send a log update to connected websockets"""
        update = {
            "type": "log",
            "task_id": task_id,
            "level": level,
            "message": message,
            "timestamp": datetime.now().timestamp()
        }

        # Send to all websockets connected to this task
        if task_id in self.websocket_connections:
            for websocket in self.websocket_connections[task_id]:
                try:
                    await websocket.send_json(update)
                except Exception as e:
                    logger.error(f"Error sending to websocket: {e}")

        # Also update task progress based on level
        if task_id in self.tasks:
            current_progress = self.tasks[task_id]['progress']
            if level == "info":
                # Gradually increase progress during info logs
                new_progress = min(current_progress + 0.1, 0.9)
                await self._update_task_status(
                    task_id,
                    TaskStatus.PROCESSING,
                    progress=new_progress
                )

    async def _notify_websockets(self, task_id: str):
        """Notify all connected websockets with current task status"""
        if task_id not in self.tasks:
            return

        task = self.tasks[task_id]
        update = {
            "type": "status",
            "task_id": task_id,
            "status": task['status'],
            "progress": task['progress'],
            "message": task['message'],
            "result": task.get('result')
        }

        if task_id in self.websocket_connections:
            for websocket in self.websocket_connections[task_id]:
                try:
                    await websocket.send_json(update)
                except Exception as e:
                    logger.error(f"Error notifying websocket: {e}")

    def register_websocket(self, task_id: str, websocket):
        """Register a websocket connection for a task"""
        if task_id not in self.websocket_connections:
            self.websocket_connections[task_id] = []
        self.websocket_connections[task_id].append(websocket)
        logger.info(f"Registered websocket for task {task_id}")

    def unregister_websocket(self, task_id: str, websocket):
        """Unregister a websocket connection"""
        if task_id in self.websocket_connections:
            try:
                self.websocket_connections[task_id].remove(websocket)
                logger.info(f"Unregistered websocket for task {task_id}")
            except ValueError:
                pass

    def get_task_status(self, task_id: str) -> Optional[Dict]:
        """Get the current status of a task"""
        return self.tasks.get(task_id)

    async def cleanup_old_tasks(self, max_age_hours: int = 24):
        """Clean up old tasks to prevent memory leaks"""
        from datetime import timedelta

        current_time = datetime.now()
        tasks_to_remove = []

        for task_id, task in self.tasks.items():
            created_at = datetime.fromisoformat(task['created_at'])
            age = current_time - created_at

            if age > timedelta(hours=max_age_hours):
                tasks_to_remove.append(task_id)

        for task_id in tasks_to_remove:
            del self.tasks[task_id]
            if task_id in self.websocket_connections:
                del self.websocket_connections[task_id]
            logger.info(f"Cleaned up old task {task_id}")


# Global task manager instance
task_manager = TaskManager()
