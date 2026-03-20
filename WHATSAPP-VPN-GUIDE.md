# WhatsApp 连接失败 - 需要VPN

## ❌ 错误信息

```
WhatsApp Web connection ended before fully opening.
status=408 Request Time-out WebSocket Error
```

## 🔍 原因

**WhatsApp服务器在中国大陆被封锁**，无法直接访问。

---

## ✅ 解决方案

### 步骤1：连接VPN

1. **启动你的VPN**
   - 推荐节点：香港、日本、美国、新加坡
   - 确保VPN已连接成功

2. **测试连接**
   - 在浏览器打开：https://web.whatsapp.com
   - 如果能打开说明VPN工作正常

### 步骤2：重新连接WhatsApp

在VPN连接状态下，运行：

```bash
openclaw channels login
```

### 步骤3：扫码连接

1. **浏览器会自动打开**
   - 如果没有自动打开，手动访问显示的URL

2. **用手机扫描二维码**
   - 打开WhatsApp手机应用
   - 设置 → 已连接的设备 → 连接设备
   - 扫描屏幕上的二维码

3. **等待连接成功**
   - 成功后会显示"Connected"

---

## 🧪 测试VPN是否生效

在连接VPN后，测试：

```bash
# 测试能否访问WhatsApp Web
curl https://web.whatsapp.com

# 或者浏览器打开
start https://web.whatsapp.com
```

---

## 🆘 如果没有VPN

### 选项1：继续使用飞书
飞书已经基本配置好了，只需要解决加密密钥问题。

### 选项2：使用其他channel
- Telegram（可以访问）
- Signal（可能需要VPN）
- Discord

### 选项3：购买VPN服务
推荐：
- ExpressVPN
- NordVPN
- Surfshark
- 青云梯/蓝灯（国内可用）

---

## 📋 检查清单

连接WhatsApp前，确认：

- [ ] VPN已连接
- [ ] 能打开 https://web.whatsapp.com
- [ ] OpenClaw Gateway正在运行
- [ ] 运行了 `openclaw channels login`
- [ ] 用手机扫描了二维码

---

**现在去连接VPN，然后告诉我再试一次！** 🚀
