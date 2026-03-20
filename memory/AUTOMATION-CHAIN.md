# Automation Chain

## Goal

让共享记忆区、定时扫描、外部调度、Codex 执行形成不断链的业务流。

## Current Chain

1. 上游把任务写入 `memory/roles/operating/tasks/`
2. Windows 计划任务定时运行 `scripts/check-shared-memory.ps1`
3. 脚本同步 OpenClaw 共享记忆并检测任务变化
4. 脚本生成 `memory/automation/codex-dispatch.json`
5. OpenClaw / ACP / 其他调度器读取 dispatch 文件
6. 检测到 `shouldTrigger=true` 时唤起 Codex
7. Codex 执行后把进度写回 `memory/YYYY-MM-DD.md`

## Dispatch Contract

文件：`memory/automation/codex-dispatch.json`

关键字段：
- `shouldTrigger`: 是否应唤起 Codex
- `reason`: 触发原因
- `tasks`: 当前需要关注的任务文件
- `lastUpdatedUtc`: dispatch 生成时间

## Rules

- 扫描脚本只做低成本工作，不直接消耗模型 token
- 真正需要模型时，必须由 dispatch 触发
- ACP 断开时，仍以共享记忆区为准继续推进
- 新任务必须使用结构化模板
- 执行完成或阻塞后必须回写共享记忆

## Minimal Operating Loop

1. PM / nia 写任务
2. 扫描脚本发现变化
3. 调度器读取 dispatch
4. 唤起 Codex / Claude
5. Agent 回写进度
6. 下游继续测试 / 部署 / 复盘
