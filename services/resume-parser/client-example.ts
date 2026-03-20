/**
 * Resume Parser API Client
 * 前端集成示例 - TypeScript/React
 *
 * 这个文件展示如何在前端应用中集成简历解析服务
 */

interface TaskResponse {
  task_id: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  message: string;
}

interface TaskStatus {
  task_id: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress: number;
  message: string;
  result?: ParsedResumeData;
  error?: string;
  created_at: string;
}

interface ParsedResumeData {
  personal_info?: {
    fullName?: string;
    email?: string;
    phone?: string;
    location?: string;
    summary?: string;
  };
  work_experience?: Array<{
    company?: string;
    position?: string;
    startDate?: string;
    endDate?: string;
    description?: string;
    aiAnnotation?: string;
  }>;
  projects?: Array<{
    name?: string;
    description?: string;
    startDate?: string;
    endDate?: string;
    url?: string;
    aiAnnotation?: string;
  }>;
  education?: Array<{
    school?: string;
    degree?: string;
    major?: string;
    startDate?: string;
    endDate?: string;
    gpa?: number;
  }>;
  skills?: Array<{
    name?: string;
    category?: string;
    proficiency?: string;
  }>;
}

interface WebSocketMessage {
  type: 'log' | 'status';
  task_id: string;
  level?: 'info' | 'warning' | 'error';
  message?: string;
  timestamp?: number;
  status?: 'pending' | 'processing' | 'completed' | 'failed';
  progress?: number;
  result?: ParsedResumeData;
}

type LogLevel = 'info' | 'warning' | 'error';
type TaskStatusType = 'pending' | 'processing' | 'completed' | 'failed';

/**
 * Resume Parser API Client Class
 */
export class ResumeParserClient {
  private baseUrl: string;
  private wsUrl: string;

  constructor(baseUrl: string = 'http://localhost:8000') {
    this.baseUrl = baseUrl;
    this.wsUrl = baseUrl.replace('http', 'ws');
  }

  /**
   * Upload resume file for parsing
   */
  async uploadResume(
    file: File,
    userId?: string
  ): Promise<TaskResponse> {
    const formData = new FormData();
    formData.append('file', file);
    if (userId) {
      formData.append('user_id', userId);
    }

    const response = await fetch(`${this.baseUrl}/api/upload`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Upload failed');
    }

    return response.json();
  }

  /**
   * Get task status
   */
  async getTaskStatus(taskId: string): Promise<TaskStatus> {
    const response = await fetch(`${this.baseUrl}/api/tasks/${taskId}`);

    if (!response.ok) {
      throw new Error('Task not found');
    }

    return response.json();
  }

  /**
   * Connect to WebSocket for real-time updates
   */
  connectToTask(
    taskId: string,
    callbacks: {
      onLog?: (level: LogLevel, message: string, timestamp: number) => void;
      onStatusUpdate?: (status: TaskStatusType, progress: number, message: string) => void;
      onCompleted?: (result: ParsedResumeData) => void;
      onFailed?: (error: string) => void;
      onError?: (error: Event) => void;
      onOpen?: () => void;
      onClose?: () => void;
    }
  ): WebSocket {
    const ws = new WebSocket(`${this.wsUrl}/ws/${taskId}`);

    ws.onopen = () => {
      console.log('WebSocket connected for task:', taskId);
      callbacks.onOpen?.();
    };

    ws.onmessage = (event) => {
      try {
        const message: WebSocketMessage = JSON.parse(event.data);

        if (message.type === 'log') {
          callbacks.onLog?.(
            message.level as LogLevel,
            message.message || '',
            message.timestamp || Date.now() / 1000
          );
        } else if (message.type === 'status') {
          callbacks.onStatusUpdate?.(
            message.status as TaskStatusType,
            message.progress || 0,
            message.message || ''
          );

          if (message.status === 'completed' && message.result) {
            callbacks.onCompleted?.(message.result);
          } else if (message.status === 'failed') {
            callbacks.onFailed?.(message.message || 'Unknown error');
          }
        }
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      callbacks.onError?.(error);
    };

    ws.onclose = () => {
      console.log('WebSocket closed for task:', taskId);
      callbacks.onClose?.();
    };

    return ws;
  }

  /**
   * List tasks (optional: filter by user_id)
   */
  async listTasks(userId?: string, limit: number = 50): Promise<{ total: number; tasks: TaskStatus[] }> {
    const url = new URL(`${this.baseUrl}/api/tasks`);
    if (userId) {
      url.searchParams.append('user_id', userId);
    }
    url.searchParams.append('limit', limit.toString());

    const response = await fetch(url.toString());
    return response.json();
  }

  /**
   * Delete a task
   */
  async deleteTask(taskId: string): Promise<{ message: string }> {
    const response = await fetch(`${this.baseUrl}/api/tasks/${taskId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Failed to delete task');
    }

    return response.json();
  }

  /**
   * Check service health
   */
  async healthCheck(): Promise<{ status: string; service: string; model: string }> {
    const response = await fetch(`${this.baseUrl}/health`);
    return response.json();
  }
}

/**
 * React Hook for resume parsing
 */
export function useResumeParser() {
  const client = new ResumeParserClient(
    process.env.NEXT_PUBLIC_RESUME_PARSER_URL || 'http://localhost:8000'
  );

  const parseResume = async (
    file: File,
    userId?: string,
    callbacks: {
      onLog?: (level: LogLevel, message: string) => void;
      onProgress?: (progress: number) => void;
      onCompleted?: (result: ParsedResumeData) => void;
      onFailed?: (error: string) => void;
    }
  ): Promise<WebSocket> => {
    // Upload file
    const task = await client.uploadResume(file, userId);

    // Connect to WebSocket
    return client.connectToTask(task.task_id, {
      onLog: (level, message) => {
        console.log(`[${level}] ${message}`);
        callbacks.onLog?.(level, message);
      },
      onStatusUpdate: (status, progress, message) => {
        console.log(`Status: ${status} - ${progress * 100}% - ${message}`);
        callbacks.onProgress?.(progress);
      },
      onCompleted: (result) => {
        console.log('Parsing completed:', result);
        callbacks.onCompleted?.(result);
      },
      onFailed: (error) => {
        console.error('Parsing failed:', error);
        callbacks.onFailed?.(error);
      },
    });
  };

  return {
    parseResume,
    client,
  };
}

/**
 * React Component Example
 */
import React, { useState, useRef } from 'react';

export function ResumeParserComponent({ userId }: { userId?: string }) {
  const { parseResume } = useResumeParser();
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<string>('');
  const [parsedData, setParsedData] = useState<ParsedResumeData | null>(null);
  const wsRef = useRef<WebSocket | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setLogs([]);
      setProgress(0);
      setStatus('');
      setParsedData(null);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setIsUploading(true);

    try {
      wsRef.current = await parseResume(
        file,
        userId,
        {
          onLog: (level, message) => {
            setLogs((prev) => [...prev, `[${level.toUpperCase()}] ${message}`]);
          },
          onProgress: (progress) => {
            setProgress(progress * 100);
          },
          onCompleted: (result) => {
            setStatus('completed');
            setParsedData(result);
            setIsUploading(false);
          },
          onFailed: (error) => {
            setStatus('failed');
            setLogs((prev) => [...prev, `ERROR: ${error}`]);
            setIsUploading(false);
          },
        }
      );
    } catch (error) {
      console.error('Upload failed:', error);
      setLogs((prev) => [...prev, `ERROR: ${error}`]);
      setIsUploading(false);
    }
  };

  const handleCancel = () => {
    if (wsRef.current) {
      wsRef.current.close();
    }
    setIsUploading(false);
    setStatus('');
    setProgress(0);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">AI Resume Parser</h1>

      {/* File Upload */}
      <div className="mb-6">
        <input
          type="file"
          accept=".pdf,.png,.jpg,.jpeg,.docx,.txt"
          onChange={handleFileChange}
          disabled={isUploading}
          className="mb-4 block w-full text-sm text-gray-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-full file:border-0
            file:text-sm file:font-semibold
            file:bg-blue-50 file:text-blue-700
            hover:file:bg-blue-100"
        />

        <div className="flex gap-4">
          <button
            onClick={handleUpload}
            disabled={!file || isUploading}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg
              disabled:bg-gray-400 disabled:cursor-not-allowed
              hover:bg-blue-700 transition-colors"
          >
            {isUploading ? 'Parsing...' : 'Upload & Parse'}
          </button>

          {isUploading && (
            <button
              onClick={handleCancel}
              className="px-6 py-2 bg-gray-600 text-white rounded-lg
                hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
          )}
        </div>
      </div>

      {/* Progress Bar */}
      {isUploading && (
        <div className="mb-6">
          <div className="w-full bg-gray-200 rounded-full h-4 mb-2">
            <div
              className="bg-blue-600 h-4 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-sm text-gray-600">{progress.toFixed(1)}%</p>
        </div>
      )}

      {/* Logs */}
      {logs.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2">Processing Logs</h2>
          <div className="bg-gray-900 text-green-400 p-4 rounded-lg
            h-64 overflow-y-auto font-mono text-sm">
            {logs.map((log, index) => (
              <div key={index} className="mb-1">
                {log}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Parsed Data */}
      {parsedData && (
        <div>
          <h2 className="text-lg font-semibold mb-2">Parsed Resume Data</h2>
          <pre className="bg-gray-100 p-4 rounded-lg overflow-auto">
            {JSON.stringify(parsedData, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}

export default ResumeParserComponent;
