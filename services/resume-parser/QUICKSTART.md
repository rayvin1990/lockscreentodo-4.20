# 快速开始指南

## 1. 环境准备

### 检查系统要求
- Python 3.11+
- PostgreSQL 数据库
- 至少 4GB RAM（用于加载AI模型）
- 5GB 可用磁盘空间

### 获取 Hugging Face Token
1. 访问 https://huggingface.co/settings/tokens
2. 创建新的 access token
3. 复制 token

## 2. 安装步骤

### Windows 用户
```bash
cd services\resume-parser
copy .env.example .env
```

### Linux/Mac 用户
```bash
cd services/resume-parser
cp .env.example .env
```

## 3. 配置环境变量

编辑 `.env` 文件：

```env
# 必填项
HUGGINGFACE_API_TOKEN=hf_你的token
DATABASE_URL=postgresql://postgres:password@localhost:5432/saasfly

# 可选项（使用默认值即可）
HUGGINGFACE_MODEL=microsoft/layoutlmv3-base
API_PORT=8000
```

## 4. 启动服务

### Windows
```bash
start.bat
```

### Linux/Mac
```bash
chmod +x start.sh
./start.sh
```

### 或手动启动
```bash
python -m venv venv
# Windows
venv\Scripts\activate
# Linux/Mac
source venv/bin/activate

pip install -r requirements.txt
python main.py
```

服务将在 http://localhost:8000 启动

## 5. 验证安装

### 检查健康状态
```bash
curl http://localhost:8000/health
```

或访问浏览器：http://localhost:8000/docs

### 运行测试
```bash
python test_api.py test_files/sample_resume.pdf
```

## 6. 集成到前端

在你的 Next.js 项目中：

### 1. 安装依赖
```bash
npm install
```

### 2. 复制客户端代码
将 `client-example.ts` 复制到你的项目：
```bash
cp services/resume-parser/client-example.ts apps/nextjs/src/lib/resume-parser.ts
```

### 3. 创建环境变量
在 `.env.local` 中添加：
```env
NEXT_PUBLIC_RESUME_PARSER_URL=http://localhost:8000
```

### 4. 使用组件
```typescript
import { ResumeParserComponent } from '@/lib/resume-parser';

export default function Page() {
  return (
    <div>
      <ResumeParserComponent userId={user.id} />
    </div>
  );
}
```

## 7. API使用示例

### 使用 curl

```bash
# 上传文件
curl -X POST http://localhost:8000/api/upload \
  -F "file=@resume.pdf" \
  -F "user_id=user123"

# 查询任务状态
curl http://localhost:8000/api/tasks/{task_id}

# 列出任务
curl "http://localhost:8000/api/tasks?user_id=user123"
```

### 使用 JavaScript/TypeScript

```typescript
// 上传文件
const formData = new FormData();
formData.append('file', fileInput.files[0]);
formData.append('user_id', 'user123');

const response = await fetch('http://localhost:8000/api/upload', {
  method: 'POST',
  body: formData
});

const { task_id } = await response.json();

// 连接WebSocket
const ws = new WebSocket(`ws://localhost:8000/ws/${task_id}`);

ws.onmessage = (event) => {
  const message = JSON.parse(event.data);

  if (message.type === 'log') {
    console.log(`[${message.level}] ${message.message}`);
  } else if (message.type === 'status') {
    console.log(`Status: ${message.status}, Progress: ${message.progress * 100}%`);

    if (message.status === 'completed') {
      console.log('Result:', message.result);
    }
  }
};
```

## 8. 故障排查

### 问题：无法连接到数据库
**解决**：
1. 检查 PostgreSQL 是否运行
2. 验证 `DATABASE_URL` 是否正确
3. 运行 `npx prisma db push` 更新schema

### 问题：模型加载失败
**解决**：
1. 检查 `HUGGINGFACE_API_TOKEN` 是否正确
2. 确保网络连接正常
3. 检查磁盘空间（至少5GB）

### 问题：WebSocket连接断开
**解决**：
1. 检查防火墙设置
2. 确保端口8000未被占用
3. 查看服务器日志

### 问题：文件上传失败
**解决**：
1. 检查文件大小（最大10MB）
2. 确认文件格式（支持 pdf, png, jpg, docx, txt）
3. 查看上传目录权限

## 9. 性能优化

### 使用GPU加速
如果有NVIDIA GPU：
```bash
# 安装CUDA版本的PyTorch
pip install torch torchvision --index-url https://download.pytorch.org/whl/cu118
```

### 增加并发处理
在 `.env` 中设置：
```env
# 使用Redis作为任务队列
REDIS_URL=redis://localhost:6379/0
```

## 10. 生产部署

### Docker部署
```bash
docker-compose up -d
```

### 云服务部署
- 推荐配置：2核CPU, 4GB RAM, 20GB存储
- 使用GPU实例可大幅提升速度
- 配置负载均衡器处理高并发

## 需要帮助？

- 查看完整文档：`README.md`
- 查看API文档：http://localhost:8000/docs
- 提交Issue：[项目仓库]
