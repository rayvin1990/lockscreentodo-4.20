# Feishu Heartbeat Configuration

**配置日期：** 2026-03-13  
**状态：** Active

---

## 飞书心跳配置

| 配置项 | 值 |
|--------|-----|
| **接收用户** | 主任（CEO） |
| **飞书用户 ID** | `ou_b40ece4facd158d742bf817ecf3d7f9b` |
| **发送时间** | 每小时一次（09:00-21:00，共 13 次） |
| **发送人** | 秘书（Executive Secretary） |

---

## 心跳模板

### 09:00 早安提醒

```
【OneAI 早安提醒】☀️

日期：YYYY-MM-DD
时间：09:00

今日重点：
- AI 代码可视化 POC（截止：2026-03-20）

待办事项：
- [ ] 检查团队确认状态
- [ ] 进度跟踪

祝工作顺利！
---
OneAI 秘书
```

### 整点检查（10:00-20:00）

```
【OneAI 整点检查】⏰

时间：HH:00

当前进度：
- AI 代码可视化 POC：XX%

待办：
- [ ] ...

---
OneAI 秘书
```

### 18:00 傍晚汇总

```
【OneAI 傍晚汇总】📊

日期：YYYY-MM-DD
时间：18:00

今日完成：
- 项目进度汇总

进行中：
- AI 代码可视化 POC（进度 XX%）

风险/阻塞：
- 无 / [具体问题]

---
OneAI 秘书
```

### 21:00 晚安提醒

```
【OneAI 晚安提醒】🌙

日期：YYYY-MM-DD
时间：21:00

明日待办：
- [ ] 早提醒 09:00
- [ ] 进度汇总 18:00

好好休息！
---
OneAI 秘书
```

---

## 发送方式

**通过飞书消息发送：**

```bash
# OpenClaw 飞书消息命令
openclaw message send --channel feishu --target ou_b40ece4facd158d742bf817ecf3d7f9b --message "[心跳内容]"
```

---

## Cron 配置（可选）

**使用 OpenClaw Cron 自动触发：**

```bash
# 早提醒 09:00
openclaw cron add --schedule "0 9 * * *" --label "feishu-morning" --command "..."

# 进度汇总 18:00
openclaw cron add --schedule "0 18 * * *" --label "feishu-daily" --command "..."

# 晚提醒 21:00
openclaw cron add --schedule "0 21 * * *" --label "feishu-evening" --command "..."
```

---

## 负责人

**执行：** 秘书（Executive Secretary）  
**监督：** nia（CEO 秘书 / 总调官）

---

**最后更新：** 2026-03-13
