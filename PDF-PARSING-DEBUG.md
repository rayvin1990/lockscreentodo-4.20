# 🔍 PDF 解析故障排查指南

## ✅ 已添加详细日志

现在当你上传 PDF 时，终端会显示详细的处理过程。

## 📋 重启应用测试

```bash
# 停止当前应用（Ctrl+C）
# 重新启动
bun dev
```

## 🔬 日志说明

### 正常流程（PDF 解析成功）

```
[File Processing] Detected PDF file
[PDF] Starting PDF text extraction for: resume.pdf (size: 12345 bytes)
[PDF] File read completed, loading PDF.js...
[PDF] Loading PDF document...
[PDF] PDF loaded successfully, pages: 2
[PDF] Page 1/2 extracted, text length: 1500
[PDF] Page 2/2 extracted, text length: 800
[PDF] Extraction completed, total text length: 2300
[AI Service] parseResumeFromText called, text length: 2300
[AI Service] Sending request to GLM API...
[GLM API] Sending request to https://open.bigmodel.cn/...
[GLM API] Success! Response length: 1500
[AI Service] GLM API response received, length: 1500
[AI Service] Extracted JSON, length: 1450
[AI Service] JSON parsing successful
✅ 简历解析成功
```

### 问题1：PDF 是图片格式（扫描件）

**日志**：
```
[PDF] Extraction completed, total text length: 12
[PDF] WARNING: Extracted text is very short (12 chars). The PDF might be:
  1. Image-based (scanned)
  2. Password protected
  3. Corrupted
```

**解决方案**：
- PDF 是扫描图片，不是文字版本
- 使用文字版 PDF（从 Word 导出）
- 或者转换为 .txt 文件
- 或者使用在线 OCR 工具转换

### 问题2：GLM API 调用失败

**日志**：
```
[AI Service] Sending request to GLM API...
[AI Service] GLM API call failed: Error: GLM API 余额不足
```

**解决方案**：
- GLM API 余额不足
- 访问 https://open.bigmodel.cn/ 充值
- 或使用 Mock 模式：`USE_MOCK_AI="true"`

### 问题3：AI 返回的不是 JSON

**日志**：
```
[AI Service] GLM API response received, length: 800
[AI Service] First 200 chars of response: 这是一份简历...
[AI Service] No JSON found in response
[AI Service] Returning mock data as fallback
```

**解决方案**：
- GLM API 返回了非 JSON 格式
- 自动回退到示例数据
- 可以使用示例数据手动编辑简历

### 问题4：JSON 解析失败

**日志**：
```
[AI Service] Extracted JSON, length: 1200
[AI Service] JSON parsing failed: SyntaxError: Unexpected token...
[AI Service] Response was: {"name": "张三", "email":...
[AI Service] Returning mock data as fallback
```

**解决方案**：
- GLM API 返回的 JSON 格式有问题
- 自动回退到示例数据
- 这是暂时的，GLM API 可能偶尔会返回不完整的数据

## 🎯 快速测试

### 测试1：使用简单 TXT 文件

创建一个 `test-resume.txt`：
```
张三
zhangsan@example.com
13800138000

工作经历：
阿里巴巴 - 高级前端工程师
2021-07 至今
负责淘宝前端架构优化

字节跳动 - 前端工程师
2019-06 至 2021-06
参与抖音电商 Web 端开发

教育经历：
浙江大学 - 计算机科学学士
2015-09 至 2019-06

技能：
React, TypeScript, Node.js
```

上传这个文件，应该会成功解析。

### 测试2：检查 PDF 是否为文字版

**方法1**：打开 PDF，尝试选中文字
- 如果能选中文字 → 文字版 PDF ✅
- 如果选不中 → 图片版 PDF ❌（需要转换）

**方法2**：查看文件大小
- 文字版 PDF：通常 10-100 KB
- 图片版 PDF：通常 500 KB - 5 MB

## 💡 推荐的文件格式（按推荐程度）

1. **TXT 文件** ⭐⭐⭐⭐⭐
   - 最可靠
   - 速度最快
   - 100% 成功

2. **Word 文档** ⭐⭐⭐⭐
   - 提取准确
   - 速度快

3. **文字版 PDF** ⭐⭐⭐⭐
   - 需要确认是文字版（非扫描版）
   - 可以在 Word 中"另存为 PDF"

4. **图片版 PDF** ⭐
   - 文本提取会失败
   - 不推荐

5. **图片文件** (JPG/PNG) ⭐
   - 需要 OCR，慢且不准确
   - 返回示例数据

## 🚨 如果还是失败

1. **查看终端日志** - 找到具体的错误信息
2. **截图日志** - 发给我分析
3. **尝试 TXT 文件** - 验证 GLM API 是否正常工作
4. **检查 GLM 余额** - 确保没有余额不足

---

**重启应用后，上传 PDF 试试，这次会看到详细的日志！🔍**
