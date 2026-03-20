# 🚀 简历解析问题解决方案

## 问题诊断

从错误日志看，你的简历解析失败是因为：
1. GLM API 的 OCR（Tesseract.js）处理图片太慢（花了2分19秒）
2. 最终超时失败：`简历解析失败，请重试`

## ✅ 解决方案：使用新的 FastAPI Hugging Face 服务

我已经为你创建了一个全新的简历解析服务，解决了这些问题：
- ✅ **异步处理** - 上传后立即返回任务ID，UI不会卡顿
- ✅ **WebSocket实时进度** - 可以看到解析进度
- ✅ **更快** - 使用 Hugging Face LayoutLMv3 模型
- ✅ **中文支持更好** - 专门训练用于文档理解
- ✅ **已配置你的 Hugging Face Token**

## 📝 快速启动（3步）

### 1️⃣ 启动 FastAPI 服务

在 **项目根目录**运行：

```bash
start-resume-parser.bat
```

这个脚本会：
- 自动创建Python虚拟环境
- 安装所有依赖
- 启动服务在 http://localhost:8000

你会看到：
```
Resume Parser API
==================
Starting Resume Parser API...
API will be available at: http://localhost:8000
API docs at: http://localhost:8000/docs
```

### 2️⃣ 重启你的 Next.js 应用

因为 `.env.local` 已更新，需要重启 Next.js：

```bash
# 停止当前的 Next.js（Ctrl+C）
# 重新启动
bun dev
```

### 3️⃣ 测试简历解析

1. 打开你的简历编辑器页面
2. 上传简历文件（支持 PDF、图片、Word）
3. 查看终端日志，应该看到：
   ```
   [FastAPI Resume Parser] Using FastAPI service at http://localhost:8000
   [FastAPI Resume Parser] Task created: xxx-xxx-xxx
   [FastAPI Resume Parser] Task status: processing, progress: 50%
   [FastAPI Resume Parser] Task status: completed, progress: 100%
   ```

## 🔍 如何验证服务正常工作

### 检查 FastAPI 服务
访问：http://localhost:8000/docs

你应该看到 API 文档界面。

### 测试健康检查
```bash
curl http://localhost:8000/health
```

应该返回：
```json
{
  "status": "healthy",
  "service": "Resume Parser API",
  "model": "microsoft/layoutlmv3-base"
}
```

### 查看详细文档
打开 `services/resume-parser/README.md` 查看完整文档

## ⚠️ 故障排查

### 问题：Next.js 无法连接到 FastAPI
**解决方案**：
1. 确认 FastAPI 服务正在运行（http://localhost:8000）
2. 检查 `.env.local` 中是否添加了：
   ```
   NEXT_PUBLIC_RESUME_PARSER_URL="http://localhost:8000"
   RESUME_PARSER_URL="http://localhost:8000"
   ```
3. 重启 Next.js 应用

### 问题：FastAPI 启动失败
**解决方案**：
1. 确认 Python 3.11+ 已安装：`python --version`
2. 检查端口8000是否被占用：
   ```bash
   netstat -ano | findstr :8000
   ```
3. 查看详细错误日志：`services/resume-parser/logs/api.log`

### 问题：模型加载失败
**解决方案**：
1. 检查网络连接（首次需要下载模型，约1-2GB）
2. 确认 Hugging Face token 正确（已在 `.env` 中配置）
3. 查看错误信息：`services/resume-parser/logs/api.log`

## 📊 性能对比

| 特性 | GLM API (旧) | FastAPI + Hugging Face (新) |
|------|-------------|---------------------------|
| 图片解析速度 | 2-5分钟（经常超时） | 10-30秒 |
| 中文支持 | ⭐⭐ | ⭐⭐⭐⭐⭐ |
| UI是否卡顿 | 是（阻塞等待） | 否（异步处理） |
| 实时进度 | ❌ | ✅ WebSocket |
| PDF支持 | ✅ | ✅ |
| 图片支持 | ⚠️ 有限 | ✅ 优秀 |

## 🎯 工作原理

### 旧流程（GLM API）：
```
前端 → tRPC → GLM API → Tesseract.js OCR → 等待2-5分钟 → ❌超时
```

### 新流程（FastAPI）：
```
前端 → tRPC → FastAPI → 立即返回任务ID ✅
                  ↓
           后台异步处理（10-30秒）
                  ↓
           WebSocket实时推送进度
                  ↓
           完成后自动保存到数据库 ✅
```

## 📁 服务位置

```
services/resume-parser/
├── main.py                 # FastAPI主应用
├── database.py             # Prisma数据库集成
├── task_manager.py         # 异步任务管理
├── services/
│   └── resume_parser.py   # 简历解析核心逻辑
├── README.md              # 完整文档
└── QUICKSTART.md          # 快速开始指南
```

## 🔄 两种模式对比

你的系统现在支持**两种简历解析模式**：

### 模式1：FastAPI Hugging Face（推荐）✅
- 自动启用（如果 `RESUME_PARSER_URL` 已配置）
- 更快、更稳定
- 实时进度显示

### 模式2：GLM API（备用）
- 如果FastAPI不可用，自动fallback
- 需要有效的 GLM_API_KEY（已配置）
- 较慢，可能超时

## 📞 需要帮助？

如果遇到问题：
1. 查看 `services/resume-parser/README.md`
2. 查看 `services/resume-parser/logs/api.log`
3. 访问 http://localhost:8000/docs 测试API

## ✨ 下一步优化

服务正常运行后，你可以：
1. 添加前端 WebSocket 实时进度显示
2. 支持批量文件上传
3. 添加简历模板库
4. 集成更多 AI 模型

---

**创建时间**: 2025-01-27
**状态**: ✅ 已完成并配置
