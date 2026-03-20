from pydantic import BaseModel
from typing import Optional, Dict, Any
from enum import Enum
import uuid


class TaskStatus(str, Enum):
    PENDING = "pending"
    PROCESSING = "processing"
    COMPLETED = "completed"
    FAILED = "failed"


class TaskResponse(BaseModel):
    task_id: str
    status: TaskStatus
    message: str


class TaskUpdate(BaseModel):
    task_id: str
    status: TaskStatus
    progress: float = 0.0
    message: str = ""
    data: Optional[Dict[str, Any]] = None


class ResumeData(BaseModel):
    """Parsed resume data structure matching the database schema"""
    personal_info: Optional[Dict[str, Any]] = None
    work_experience: Optional[list[Dict[str, Any]]] = None
    projects: Optional[list[Dict[str, Any]]] = None
    education: Optional[list[Dict[str, Any]]] = None
    skills: Optional[list[Dict[str, Any]]] = None


class LogMessage(BaseModel):
    level: str  # INFO, WARNING, ERROR
    message: str
    timestamp: float
