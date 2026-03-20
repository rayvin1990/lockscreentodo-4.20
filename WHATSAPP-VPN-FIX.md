# WhatsApp VPN 测试和配置

## 🔍 问题原因

```
status=408 Request Time-out WebSocket Error
```

**WhatsApp无法连接，说明VPN没有正确代理WhatsApp流量。**

---

## 🧪 测试VPN是否工作

### 测试1：浏览器测试

**在VPN连接状态下：**

1. 打开浏览器
2. 访问：https://web.whatsapp.com
3. **看能否打开**

**如果打不开** → VPN没有工作，需要：
- 切换VPN节点（香港、美国、新加坡）
- 或重启VPN

**如果可以打开** → VPN正常，继续测试2

---

### 测试2：终端测试

```bash
# 测试能否访问WhatsApp服务器
curl -I https://web.whatsapp.com

# 或
ping web.whatsapp.com
```

**如果失败** → VPN配置有问题

---

## 🔧 VPN配置方案

### 方案A：Clash配置（推荐）

编辑Clash配置文件，添加WhatsApp规则：

```yaml
rules:
  - DOMAIN-SUFFIX,whatsapp.com,PROXY
  - DOMAIN-SUFFIX,whatsapp.net,PROXY
  - DOMAIN-SUFFIX,whatsapp.net,PROXY
```

**步骤：**
1. 打开Clash配置
2. 添加上述规则
3. 保存并重启Clash
4. 重新连接WhatsApp

---

### 方案B：V2Ray配置

在路由规则中添加：

```json
{
  "routing": {
    "domainStrategy": "AsIs",
    "rules": [
      {
        "type": "field",
        "domain": ["whatsapp.com", "whatsapp.net"],
        "outboundTag": "proxy"
      }
    ]
  }
}
```

---

### 方案C：系统代理设置

**Windows：**

1. **设置 → 网络和Internet → 代理**
2. **手动配置代理**
3. **填写VPN提供的地址和端口**

**示例：**
```
地址：127.0.0.1
端口：7890（根据VPN配置）
```

---

## 🚀 重新连接步骤

### 1. 确认VPN工作

```bash
# 测试访问
curl -I https://web.whatsapp.com
```

**如果成功** → 继续

**如果失败** → 修复VPN配置

---

### 2. 重新连接WhatsApp

```bash
openclaw channels login
```

### 3. 扫描二维码

1. **等待OpenClaw打开WhatsApp登录页**
2. **用手机扫描二维码**
3. **等待连接成功**

---

## 🆘 如果VPN复杂

### 替代方案：其他Channel

#### 选项1：Telegram（无需VPN）

```bash
# Telegram可用
openclaw channels login
# 选择Telegram，创建Bot
```

#### 选项2：继续飞书（调试）

飞书问题可能是需要：
- 重新验证
- 重新添加机器人到群聊

---

## 📋 快速检查清单

连接WhatsApp前：

- [ ] VPN已连接
- [ ] 测试 https://web.whatsapp.com 能打开
- [ ] 或 `curl -I https://web.whatsapp.com` 成功
- [ ] OpenClaw Gateway正在运行
- [ ] 运行 `openclaw channels login`

---

## 🎯 现在做什么？

**选择1：修复VPN**
- 测试VPN：访问 https://web.whatsapp.com
- 如果打不开，切换节点或重启VPN
- 重新连接WhatsApp

**选择2：用Telegram**
- 不需要VPN
- 配置更简单
- 5分钟搞定

**选择3：回到飞书**
- 再试一次验证
- 或截图给我看

---

**你想选哪个？告诉我！** 🚀
