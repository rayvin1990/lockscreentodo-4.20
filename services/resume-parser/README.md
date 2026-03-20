# Resume Parser API

基于 FastAPI + Hugging Face LayoutLMv3/Donut 的异步简历解析服务。

## 特性

- **异步处理**: 上传文件后立即返回任务ID，不会阻塞UI
- **实时日志**: 通过WebSocket实时推送解析进度和日志
- **AI驱动**: 使用Hugging Face的LayoutLMv3或Donut模型进行智能解析
- **数据库集成**: 自动将解析结果同步到Prisma数据库的母简历表
- **多格式支持**: PDF、图片(PNG/JPG)、Word(DOCX)、纯文本

## 项目结构

```
services/resume-parser/
├── main.py                 # FastAPI主应用
├── config.py              # 配置管理
├── database.py            # Prisma数据库集成
├── task_manager.py        # 异步任务管理器
├── requirements.txt       # Python依赖
├── .env.example          # 环境变量示例
├── models/
│   └── schemas.py        # Pydantic数据模型
├── services/
│   └── resume_parser.py  # 简历解析服务
├── uploads/              # 上传文件存储目录
└── logs/                 # 日志文件目录
```

## 快速开始

### 1. 安装依赖

```bash
cd services/resume-parser
pip install -r requirements.txt
```

### 2. 配置环境变量

创建 `.env` 文件：

```bash
cp .env.example .env
```

编辑 `.env` 文件，填入必要的配置：

```env
# Hugging Face (必填)
HUGGINGFACE_API_TOKEN=hf_xxxxxxxxxxxxxx
HUGGINGFACE_MODEL=microsoft/layoutlmv3-base

# 数据库 (必填)
DATABASE_URL=postgresql://postgres:password@localhost:5432/saasfly

# API配置
API_HOST=0.0.0.0
API_PORT=8000
API_CORS_ORIGINS=http://localhost:3000,http://localhost:3001

# 文件上传
MAX_UPLOAD_SIZE=10485760  # 10MB
ALLOWED_EXTENSIONS=pdf,png,jpg,jpeg,docx,txt

# 任务超时
TASK_TIMEOUT=300  # 5分钟
```

### 3. 生成Prisma客户端

```bash
# 在项目根目录执行
cd packages/db
npx prisma generate
```

### 4. 启动服务

```bash
# 在 services/resume-parser 目录
python main.py
```

或使用 uvicorn：

```bash
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

服务将在 http://localhost:8000 启动

## API端点

### 1. 上传简历

**POST** `/api/upload`

上传简历文件进行解析。

**请求：**
- Content-Type: `multipart/form-data`
- Body:
  - `file`: 简历文件 (PDF/图片/Word/TXT)
  - `user_id`: (可选) 用户ID，默认使用 "demo-user"

**响应：**
```json
{
  "task_id": "550e8400-e29b-41d4-a716-446655440000",
  "status": "pending",
  "message": "Resume uploaded successfully. Use task ID xxx to track progress."
}
```

### 2. 查询任务状态

**GET** `/api/tasks/{task_id}`

查询解析任务的当前状态。

**响应：**
```json
{
  "task_id": "...",
  "status": "processing",
  "progress": 0.5,
  "message": "Extracting structured data...",
  "result": null,
  "error": null,
  "created_at": "2025-01-27T10:30:00"
}
```

状态值：
- `pending`: 等待处理
- `processing`: 正在处理
- `completed`: 完成
- `failed`: 失败

### 3. WebSocket实时更新

**WS** `/ws/{task_id}`

连接到WebSocket端点接收实时更新。

**消息格式：**

日志消息：
```json
{
  "type": "log",
  "task_id": "...",
  "level": "info",
  "message": "Extracting page 1/3",
  "timestamp": 1706342400.123
}
```

状态更新：
```json
{
  "type": "status",
  "task_id": "...",
  "status": "completed",
  "progress": 1.0,
  "message": "Resume parsing completed successfully!",
  "result": {
    "personal_info": {...},
    "work_experience": [...],
    "projects": [...],
    "education": [...],
    "skills": [...]
  }
}
```

### 4. 列出任务

**GET** `/api/tasks?user_id={user_id}&limit=50`

列出最近的任务。

### 5. 删除任务

**DELETE** `/api/tasks/{task_id}`

删除任务及相关文件。

### 6. 健康检查

**GET** `/health`

检查服务状态。

## 前端集成示例

### 上传文件并监听进度

```typescript
import { useRef, useState, useEffect } from 'react';

function ResumeUploader() {
  const [file, setFile] = useState<File | null>(null);
  const [taskId, setTaskId] = useState<string | null>(null);
  const [logs, setLogs] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<string>('');
  const wsRef = useRef<WebSocket | null>(null);

  // 上传文件
  const handleUpload = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('user_id', 'user-123'); // 替换为实际用户ID

    try {
      const response = await fetch('http://localhost:8000/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      setTaskId(data.task_id);
      setStatus(data.status);
    } catch (error) {
      console.error('Upload failed:', error);
    }
  };

  // 连接WebSocket监听进度
  useEffect(() => {
    if (!taskId) return;

    const ws = new WebSocket(`ws://localhost:8000/ws/${taskId}`);
    wsRef.current = ws;

    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);

      if (message.type === 'log') {
        setLogs((prev) => [...prev, `[${message.level}] ${message.message}`]);
      } else if (message.type === 'status') {
        setStatus(message.status);
        setProgress(message.progress * 100);

        if (message.status === 'completed') {
          console.log('Parsed data:', message.result);
          // 处理解析结果
        }
      }
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    ws.onclose = () => {
      console.log('WebSocket closed');
    };

    return () => {
      ws.close();
    };
  }, [taskId]);

  return (
    <div>
      <input
        type="file"
        accept=".pdf,.png,.jpg,.jpeg,.docx,.txt"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
      />
      <button onClick={handleUpload}>Upload</button>

      {taskId && (
        <div>
          <h3>Task ID: {taskId}</h3>
          <p>Status: {status}</p>
          <p>Progress: {progress.toFixed(1)}%</p>

          <div style={{ maxHeight: '300px', overflow: 'auto' }}>
            {logs.map((log, index) => (
              <div key={index}>{log}</div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default ResumeUploader;
```

## 数据库集成

解析的数据会自动保存到以下Prisma表：

- `MasterResume`: 母简历主表（个人信息）
- `WorkExperience`: 工作经历
- `Project`: 项目经历
- `Education`: 教育背景
- `Skill`: 技能列表

每个用户只会有一条`MasterResume`记录，每次解析会更新这条记录，并清空重新创建关联的工作经历、项目、教育经历和技能。

## 支持的Hugging Face模型

当前服务支持以下模型：

1. **LayoutLMv3** (默认):
   - 模型ID: `microsoft/layoutlmv3-base`
   - 优点: 对文档布局理解好，适合处理格式化的简历
   - 需要token: 是

2. **Donut** (推荐用于简历):
   - 模型ID: `navid-rnz/donut-base-resume`
   - 优点: 专门为简历解析训练，端到端理解
   - 需要token: 是

切换模型：

修改 `.env` 文件中的 `HUGGINGFACE_MODEL` 配置。

## 性能优化建议

### 1. 模型缓存

模型在首次加载时会自动下载并缓存，后续启动会使用缓存。

### 2. GPU加速

如果有CUDA GPU，模型会自动使用GPU加速，速度可提升10-50倍。

检查GPU可用性：

```python
import torch
print(torch.cuda.is_available())  # 应返回 True
```

### 3. 并发处理

当前实现使用Python asyncio处理并发任务。对于高并发场景，建议：

1. 使用Redis作为任务队列（替代内存存储）
2. 使用Celery + worker进程处理任务
3. 添加负载均衡

### 4. 文件清理

建议设置定时任务清理旧的上传文件和任务记录：

```python
# 可以添加到 main.py 的启动事件中
import asyncio

async def cleanup_task():
    while True:
        await asyncio.sleep(3600)  # 每小时执行一次
        await task_manager.cleanup_old_tasks(max_age_hours=24)
```

## 故障排查

### 1. 模型加载失败

**错误**: `Failed to load model`

**解决方案**:
- 检查 `HUGGINGFACE_API_TOKEN` 是否正确
- 确保有足够的磁盘空间（模型约1-2GB）
- 检查网络连接是否正常

### 2. 数据库连接失败

**错误**: `Failed to connect to database`

**解决方案**:
- 检查 `DATABASE_URL` 是否正确
- 确保PostgreSQL服务正在运行
- 运行 `npx prisma db push` 确保schema是最新的

### 3. WebSocket连接断开

**错误**: WebSocket频繁断开

**解决方案**:
- 检查防火墙设置
- 确保没有代理干扰
- 添加心跳重连机制

## 生产部署

### Docker部署

创建 `Dockerfile`:

```dockerfile
FROM python:3.11-slim

WORKDIR /app

# 安装系统依赖
RUN apt-get update && apt-get install -y \
    libpq-dev \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# 安装Python依赖
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# 复制应用代码
COPY . .

# 创建必要的目录
RUN mkdir -p uploads logs

EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

创建 `docker-compose.yml`:

```yaml
version: '3.8'

services:
  resume-parser:
    build: .
    ports:
      - "8000:8000"
    env_file:
      - .env
    volumes:
      - ./uploads:/app/uploads
      - ./logs:/app/logs
    environment:
      - DATABASE_URL=postgresql://postgres:password@db:5432/saasfly
    depends_on:
      - db

  db:
    image: postgres:15
    environment:
      POSTGRES_DB: saasfly
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: password
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

启动：

```bash
docker-compose up -d
```

## 许可证

MIT

## 支持

如有问题，请提交Issue或联系开发团队。
