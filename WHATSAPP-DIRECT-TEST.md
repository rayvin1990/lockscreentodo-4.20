# WhatsApp 测试指南

## 📊 当前状态

```
WhatsApp │ ON      │ WARN   │ linked · accounts 1 · gateway: Not linked (no WhatsApp Web session).
```

## 🎯 可能的原因

你直接打开了 WhatsApp Web (`web.whatsapp.com`)，但OpenClaw 需要通过 **自己的流程**连接。

## ✅ 正确的连接方式

### 步骤1：重新连接

```bash
openclaw channels login
```

这个命令应该会：
1. 打开一个**OpenClaw特定的登录页面**
2. 显示二维码
3. 或在已打开的浏览器中注入WhatsApp Web

### 步骤2：扫码

1. 用手机WhatsApp应用扫描二维码
2. **不要直接访问 web.whatsapp.com**

### 步骤3：等待连接

看到成功提示后，gateway会自动连接。

---

## 🧪 测试发送消息

### 发送测试消息给我

在WhatsApp中，找到我（可能需要添加）：
1. 点击新建聊天
2. 搜索：你的手机号（需要先配置）
3. 发送消息：`你好`

或者，我可以尝试用命令发送消息测试：

```bash
# 发送消息到WhatsApp
openclaw message send --channel whatsapp --target "+86xxxxxxx" --message "测试"
```

---

## 🆘 如果还是不行

### 选项1：回到飞书（最简单）

飞书已经配置好了，只需关闭加密：

1. 访问：`https://open.feishu.cn/app/cli_a9f5af0e51f89cc4/event?tab=event`
2. 删除"Encrypt Key"
3. 保存并验证
4. 在群里@机器人

**2分钟搞定！**

### 选项2：检查WhatsApp日志

```bash
# 查看gateway日志
openclaw logs --follow
```

看是否有关于WhatsApp连接的错误。

---

## 🎯 建议

**试试选项1（飞书）** - 更简单，已经90%配置好了！

---

**你想选哪个？**

1. 重新用 `openclaw channels login` 连接WhatsApp
2. 直接用飞书（推荐，2分钟）
