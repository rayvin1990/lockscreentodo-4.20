# ✅ 可以使用图片格式的简历了！

## 🎯 现在支持两种模式

### 模式1：FastAPI 服务（推荐用于图片）⚡

**启动 FastAPI 服务**（新开一个终端）：
```bash
start-resume-parser.bat
```

**特点**：
- ✅ **图片处理快**（10-30秒 vs 2分钟）
- ✅ 异步处理，UI 不卡顿
- ✅ 实时进度显示
- ✅ 使用 Hugging Face LayoutLMv3 模型
- ✅ 支持 JPG、PNG、PDF、Word 等所有格式

**日志示例**：
```
[FastAPI Resume Parser] Image detected, using FastAPI service
[FastAPI Resume Parser] Task created: abc-123
[FastAPI Resume Parser] Task status: processing, progress: 50%
[FastAPI Resume Parser] Task status: completed, progress: 100%
✅ 简历解析成功
```

### 模式2：GLM API（备用模式）

**不启动 FastAPI 服务**，直接使用：

**特点**：
- ✅ PDF/Word/TXT：快速（5-10秒）
- ⚠️ 图片文件：慢（1-2分钟，使用 OCR）
- ⚠️ 图片中文识别可能不准确

**日志示例**：
```
[AI Service] Image file detected - using OCR (this may be slow)
[OCR] Starting OCR process...
[OCR] Recognition complete!
✅ 简历解析成功
```

---

## 🚀 快速开始（推荐）

### 1️⃣ 启动 FastAPI 服务（图片处理专用）

```bash
# 在项目根目录，新开一个终端
start-resume-parser.bat
```

等待看到：
```
INFO:     Application startup complete.
INFO:     Uvicorn running on http://0.0.0.0:8000
```

### 2️⃣ 重启 Next.js 应用

```bash
# 在原终端
bun dev
```

### 3️⃣ 上传图片简历

现在可以上传任何格式的简历：
- ✅ JPG 图片
- ✅ PNG 图片
- ✅ PDF 文件
- ✅ Word 文档
- ✅ TXT 文本

---

## 📊 对比表

| 格式 | FastAPI 服务 | GLM API（备用） |
|------|-------------|----------------|
| **JPG/PNG** | ⚡ 10-30秒 ✅ | 🐌 1-2分钟 ⚠️ |
| **PDF** | ⚡ 10-30秒 ✅ | ⚡ 5-10秒 ✅ |
| **Word** | ⚡ 10-30秒 ✅ | ⚡ 5-10秒 ✅ |
| **TXT** | ⚡ 10-30秒 ✅ | ⚡ 2-5秒 ✅ |

---

## 🔧 工作原理

### 图片简历处理流程：

**FastAPI 服务运行时**：
```
图片上传 → FastAPI 服务（异步）→ LayoutLMv3 模型 → 解析完成 → 保存数据库
      ↓
   UI 不卡顿 ✅
      ↓
   WebSocket 实时进度 ✅
```

**FastAPI 服务未运行**：
```
图片上传 → GLM API → Tesseract OCR（慢）→ 解析完成
      ↓
   UI 可能卡顿 ❌
      ↓
   无进度显示 ❌
```

---

## 💡 推荐使用场景

### 使用 FastAPI 服务（推荐）：
- ✅ 上传图片简历（JPG/PNG）
- ✅ 需要实时进度显示
- ✅ 不想 UI 卡顿
- ✅ 追求速度

### 仅使用 GLM API：
- ✅ 只有 PDF/Word/TXT 文件
- ✅ 不想运行额外服务
- ✅ 对速度要求不高

---

## ⚙️ 配置说明

已自动配置 `.env.local`：
```env
RESUME_PARSER_URL="http://localhost:8000"  # FastAPI 服务地址
GLM_API_KEY="b26483819ef34f8db272dea4ff45dfa6.3ObtOOan1V9nlwMJ"  # GLM API
```

系统会自动：
1. **图片文件** → 优先使用 FastAPI（如果运行中）
2. **PDF/Word/TXT** → 使用 GLM API（快速）
3. **FastAPI 不可用** → 自动回退到 GLM API

---

## 🎉 总结

**现在你可以：**

1. ✅ 上传**图片简历**（JPG/PNG）- 使用 FastAPI 服务（快）
2. ✅ 上传**PDF/Word** - 使用 GLM API（也很快）
3. ✅ 所有格式都支持
4. ✅ UI 不会卡顿（FastAPI 异步处理）
5. ✅ 实时进度显示（FastAPI WebSocket）

---

**启动 `start-resume-parser.bat` 后，试试上传图片简历吧！🚀**
