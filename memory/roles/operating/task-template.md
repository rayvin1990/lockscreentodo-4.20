# Task Template

用这个模板创建新任务，避免链路卡在模糊指令。

```md
# <Team / Agent> 任务 - <任务标题>

**项目:** <项目名>
**负责人:** <Owner Agent / Team Lead>
**优先级:** P0 | P1 | P2
**创建时间:** YYYY-MM-DD HH:mm
**截止时间:** YYYY-MM-DD HH:mm
**状态:** 待开始 | 进行中 | 阻塞 | 已完成

---

## 业务目标
- <一句话说清楚为什么做>

## 输入
- <已有上下文>
- <设计稿 / 接口 / 文档 / 数据来源>

## 预期输出
- <代码交付物>
- <文档交付物>
- <验证结果>

## 依赖
- <上游依赖>
- <外部权限 / Key / 账号>

## 执行步骤
1. <步骤 1>
2. <步骤 2>
3. <步骤 3>

## 验收标准
- <可运行>
- <可验证>
- <可交接>

## 回写要求
- 完成后更新 `memory/YYYY-MM-DD.md`
- 阻塞时写明：
  - Issue
  - Impact
  - Blocked By
  - Suggested Fix
  - Decision Needed
```
