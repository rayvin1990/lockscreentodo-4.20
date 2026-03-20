# WhatsApp 配置说明

## ❌ 当前问题

从错误信息看：
```
WhatsApp Web connection ended before fully opening.
status=408 Request Time-out WebSocket Error
```

**原因：** 在中国大陆访问 WhatsApp 服务器遇到网络超时。

---

## 🚀 解决方案

### 方案1：使用 VPN/代理（推荐）

如果你有可以访问外网的VPN：

1. **启动VPN**
   - 确保VPN已连接到香港、美国或其他地区

2. **重新连接WhatsApp**
   ```bash
   openclaw channels login
   ```

3. **扫描二维码**
   - 浏览器会自动打开WhatsApp Web
   - 用手机扫描二维码

---

### 方案2：使用本地脚本（需要VPN）

创建一个独立的WhatsApp脚本：

```bash
npm install whatsapp-web.js
```

然后运行：
```bash
node whatsapp-bot.mjs
```

---

### 方案3：继续使用飞书

如果你配置VPN不方便，飞书已经基本配置好了，只需要：

1. 在飞书平台获取"加密密钥"（Encrypt Key）
2. 更新配置文件
3. 重启服务

---

## 📊 当前状态

✅ OpenClaw Gateway 已启动
✅ WhatsApp 插件已启用
❌ 网络连接超时（需要VPN或代理）

---

## 🎯 你想怎么做？

1. **使用VPN连接WhatsApp** - 我可以帮你继续配置
2. **继续用飞书** - 我帮你解决加密问题
3. **其他方案** - 告诉我你的想法

**先告诉我你的选择！** 🚀
