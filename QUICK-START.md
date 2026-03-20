# 飞书机器人双向通信 - 快速开始

## 🎯 5分钟快速配置

---

## 第1步：下载 ngrok（3分钟）

### 1.1 下载并安装 ngrok
1. 访问：https://ngrok.com/download
2. 下载 Windows 版本
3. 解压到任意目录（建议：`C:\ngrok`）
4. 将 `ngrok.exe` 复制到当前项目目录：`C:\Users\57684\saasfly`

### 1.2 验证安装
打开命令行，运行：
```bash
ngrok version
```
如果显示版本号，说明安装成功。

---

## 第2步：创建飞书应用（5分钟）

### 2.1 访问飞书开放平台
1. 打开浏览器：https://open.feishu.cn/
2. 登录你的飞书账号

### 2.2 创建应用
1. 点击"创建企业自建应用"
2. 填写信息：
   - 应用名称：`OpenClaw Assistant`
   - 应用描述：`AI 助手机器人`
3. 点击"创建"

### 2.3 获取凭证
1. 进入应用 -> "凭证与基础信息"
2. 记录以下两个值：
   ```
   App ID: cli_xxxxxxxxxxxxxxxxxx
   App Secret: xxxxxxxxxxxxxxxxxxxxxxx
   ```

### 2.4 启用机器人
1. 点击"添加能力" -> 选择"机器人"
2. 配置机器人信息（名称、描述、头像）
3. 点击"发布"

### 2.5 配置权限
1. 进入"权限管理"
2. 添加权限：
   - ✅ `im:message`
   - ✅ `im:chat`
   - ✅ `im:message:group_at_msg`
3. 点击"申请权限"

---

## 第3步：配置文件（1分钟）

### 3.1 填写凭证
编辑 `start-feishu-open-bot.bat`，替换以下内容：

```batch
set FEISHU_VERIFY_TOKEN=OpenClaw2026

# 把下面的占位符替换为你的实际值
set FEISHU_APP_ID=你的App_ID
set FEISHU_APP_SECRET=你的App_Secret
```

**示例：**
```batch
set FEISHU_VERIFY_TOKEN=OpenClaw2026
set FEISHU_APP_ID=cli_1234567890abcdef
set FEISHU_APP_SECRET=abc123def456ghi789jkl012mno345pq
```

### 3.2 保存文件
保存 `start-feishu-open-bot.bat`

---

## 第4步：启动服务（1分钟）

### 4.1 启动 ngrok
打开一个新的命令行窗口，运行：
```bash
ngrok http 3002
```

复制显示的 URL，例如：
```
https://abc-123.ngrok.io
```

### 4.2 启动机器人服务
打开另一个命令行窗口，运行：
```bash
start-feishu-open-bot.bat
```

你应该看到：
```
🚀 飞书开放平台机器人启动成功!
📡 监听端口: 3002
🔗 Webhook URL: http://localhost:3002/webhook/feishu
```

---

## 第5步：配置事件订阅（2分钟）

### 5.1 配置事件订阅
1. 回到飞书应用页面 -> "事件订阅"
2. 配置以下信息：
   - **请求地址**：`https://abc-123.ngrok.io/webhook/feishu`
     （把 abc-123.ngrok.io 替换为你的 ngrok URL）
   - **验证 Token**：`OpenClaw2026`
3. 点击"验证"

### 5.2 订阅事件
1. 在事件订阅页面，点击"添加事件"
2. 搜索并选择：`im.message.receive_v1`
3. 点击"保存"

### 5.3 发布机器人
1. 回到应用详情页
2. 点击"发布"
3. 选择"企业内发布"
4. 点击"发布"

---

## 第6步：添加到群聊并测试（1分钟）

### 6.1 添加机器人
1. 打开飞书，进入你想使用机器人的群聊
2. 点击右上角 "+"
3. 搜索机器人名称：`OpenClaw Assistant`
4. 点击"添加到群聊"

### 6.2 测试对话
在群聊中输入：
```
@OpenClaw 你好
```

如果配置成功，机器人会回复：
```
[OpenClaw 回复]
我收到了你的消息: 你好

飞书机器人集成正在开发中...
```

---

## ✅ 完成！

现在你可以在飞书群聊中与机器人双向对话了！

---

## 🔧 故障排查

### 问题1：验证失败
**检查：**
- ngrok 地址是否正确
- Verify Token 是否与代码中一致
- 机器人服务是否正在运行

### 问题2：@机器人无响应
**检查：**
- 是否订阅了 `im.message.receive_v1` 事件
- 权限是否配置（im:message 等）
- 查看服务日志，看是否收到请求

### 问题3：ngrok 域名变了
**解决：**
1. 获取新的 ngrok URL
2. 在飞书平台更新事件订阅地址
3. 点击"验证"

---

## 📚 详细文档

需要更详细的配置说明？查看：
- `FEISHU-STEP-BY-STEP.md` - 完整配置指南
- `FEISHU-SETUP.md` - API 参考和高级配置

---

## 💡 下一步

配置完成后，你可以：
- ✅ 在飞书群聊中 @机器人进行对话
- ✅ 修改 `feishu-open-bot.mjs` 中的 `getOpenClawReply` 函数，连接到真正的 OpenClaw API
- ✅ 添加更多功能（如卡片消息、富文本等）

---

**需要帮助？查看服务日志或告诉我具体错误！** 🚀
