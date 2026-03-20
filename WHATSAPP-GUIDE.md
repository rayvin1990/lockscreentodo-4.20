# WhatsApp 集成指南

## 🎯 WhatsApp vs 飞书

| 功能 | 飞书 | WhatsApp |
|------|------|----------|
| 配置难度 | ⭐⭐⭐⭐⭐ 需要配置事件订阅 | ⭐ 简单扫描二维码 |
| 双向通信 | ✅ | ✅ |
| 实时性 | ✅ | ✅ |
| 支持群聊 | ✅ | ✅ |

**建议：** WhatsApp 配置更简单，推荐使用！

---

## 📋 配置步骤（5分钟）

### 步骤1：访问 OpenClaw 配置

1. 打开你的 OpenClaw 控制台
2. 进入 Channels 或频道配置
3. 找到 WhatsApp 配置选项

---

### 步骤2：连接 WhatsApp

#### 方式A：使用 WhatsApp Business API（需要营业执照）
1. 注册 Meta Business 账号
2. 创建 WhatsApp Business 账号
3. 获取 API Token 和 Phone Number ID
4. 在 OpenClaw 中配置

#### 方式B：使用第三方服务（推荐，简单）
- 使用 Baileys、whatsapp-web.js 等开源库
- 扫描个人 WhatsApp 二维码连接
- 无需营业执照

---

### 步骤3：测试

连接后，给 WhatsApp 账号发送消息测试。

---

## 🔧 代码集成（如果需要）

### 方案1：使用 whatsapp-web.js

```javascript
import { Client, LocalAuth } from 'whatsapp-web.js';

const client = new Client({
    authStrategy: new LocalAuth()
});

client.on('qr', (qr) => {
    console.log('扫描二维码:', qr);
});

client.on('ready', () => {
    console.log('WhatsApp 已连接');
});

client.on('message', async (msg) => {
    if (msg.body === '!ping') {
        await msg.reply('pong');
    }
});

client.initialize();
```

### 方案2：使用 Baileys

```javascript
import { makeWASocket, useMultiFileAuthState } from 'baileys';

async function connectWhatsApp() {
    const { state, saveCreds } = await useMultiFileAuthState('auth_info');

    const sock = makeWASocket({
        auth: state
    });

    sock.ev.on('creds.update', saveCreds);

    sock.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect, qr } = update;

        if (qr) {
            console.log('扫描二维码:', qr);
        }

        if (connection === 'close') {
            console.log('连接已断开');
        } else if (connection === 'open') {
            console.log('WhatsApp 已连接');
        }
    });

    return sock;
}

connectWhatsApp();
```

---

## 📱 快速开始脚本

我可以帮你创建一个简单的 WhatsApp 机器人脚本。

---

## ⚠️ 注意事项

### 使用 WhatsApp 个人账号的风险
- 可能被 WhatsApp 封号
- 不适合大规模使用
- 仅适合个人测试

### 生产环境建议
- 使用 WhatsApp Business API
- 需要营业执照
- 稳定可靠

---

## 🎯 现在怎么做？

### 选项1：在 OpenClaw 中配置 WhatsApp
1. 打开 OpenClaw 控制台
2. 进入 Channels 配置
3. 选择 WhatsApp
4. 按照提示配置

### 选项2：创建独立的 WhatsApp 脚本
我可以帮你创建一个独立的 WhatsApp 脚本，通过消息队列与 OpenClaw 通信。

### 选项3：继续用飞书
如果你已经投入时间配置飞书，也可以继续用。

---

**你想选哪个选项？或者告诉我你的 WhatsApp 账号类型（个人/企业），我帮你配置！** 🚀
