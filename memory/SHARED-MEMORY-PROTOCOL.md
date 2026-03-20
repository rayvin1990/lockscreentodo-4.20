# Shared Memory Protocol

**版本：** 1.0  
**生效日期：** 2026-03-13  
**维护：** 自动化（无需人工维护）

---

## 架构

共享记忆区基于 Git 版本控制，所有 Agent 通过 Git 读写记忆。

**仓库位置：** `C:\Users\57684\saasfly\memory\`

**远程仓库：** [配置后填写]

---

## 写入权限

| Agent | 可写入路径 | 权限 |
|-------|-----------|------|
| **nia** | `/` (全部) | 读写 |
| **PM** | `/projects/` | 读写 |
| **Codex Team** | `/projects/[project]/` | 读写技术文档 |
| **Claude Code Team** | `/projects/[project]/` | 读写测试/部署文档 |
| **Product Manager** | `/projects/[project]/` | 读写产品文档 |
| **Documentation Manager** | `/` (全部) | 读写（归档整理） |
| **其他 Agent** | 无 | 只读（通过 Team Lead 写入） |

---

## 写入流程

### 标准流程

```bash
# 1. 获取最新
git pull origin main

# 2. 检查冲突
git status

# 3. 写入文件
# (编辑或创建文件)

# 4. 提交
git add [files]
git commit -m "[Agent] [Action]: [Description]"

# 5. 推送
git push origin main
```

### 提交消息格式

```
[Agent] [Action]: [Description]

- Agent: codex-arch, claude-test, pm, nia, etc.
- Action: create, update, delete, archive
- Description: 简短描述

Example:
[codex-arch] create: AI Code Visualization architecture design
[claude-test] update: Test plan for landing page MVP
[nia] delete: Outdated project docs
```

---

## 冲突处理

### 自动合并（推荐）

```bash
# 配置自动合并
git config pull.rebase false
git config merge.ours true
```

### 手动解决

```bash
# 拉取时冲突
git pull origin main

# 查看冲突文件
git status

# 编辑冲突文件（解决 <<< === >>> 标记）

# 标记解决
git add [files]

# 完成合并
git commit -m "Merge: resolved conflicts"

# 推送
git push origin main
```

---

## 通知机制

### Git Hook 自动通知（可选）

配置 `.git/hooks/post-commit`：

```bash
#!/bin/bash
# 提交后自动通知 nia
echo "New commit: $(git log -1 --pretty=%B)"
# 可扩展：发送消息到 nia
```

### 手动通知

写入后通知相关 Agent：

```
[记忆更新通知]

文件：/memory/projects/[project]/[file].md
操作：create/update/delete
Agent: [who]
摘要：[简短描述]
```

---

## 目录结构

```
/memory/
├── company/           # 公司文档（nia/Documentation Manager 维护）
├── roles/             # 角色库（nia 维护）
├── knowledge/         # 知识库（Documentation Manager 维护）
├── projects/          # 项目文档（各团队写入）
│   └── [project-name]/
│       ├── prd.md
│       ├── architecture.md
│       ├── test-plan.md
│       └── deployment.md
└── SHARED-MEMORY-PROTOCOL.md  # 本协议
```

---

## 清理规则

### 自动清理（建议配置）

```bash
# 每月 1 号自动清理旧文件
# 删除 90 天前的临时文件
# 归档完成的项目
```

### 手动清理

```bash
# 归档完成的项目
git mv /memory/projects/[completed-project]/ /memory/archive/projects/

# 提交
git commit -m "archive: [project-name] completed"
```

---

## 安全规则

| 规则 | 说明 |
|------|------|
| **不提交敏感信息** | 密钥、密码、API Token 禁止提交 |
| **不提交大文件** | 单文件 >10MB 需特殊处理 |
| **不强制推送** | 禁止 `git push --force`（除非 nia 批准） |
| **分支保护** | `main` 分支需保护（如用远程仓库） |

---

## 初始化命令（一次性）

```bash
cd C:\Users\57684\saasfly\memory

# 初始化 Git
git init
git add .
git commit -m "Initial commit: OneAI shared memory"

# 配置远程仓库（如有）
git remote add origin [你的远程仓库 URL]
git push -u origin main

# 配置用户信息
git config user.name "OneAI Memory System"
git config user.email "memory@oneai.local"

# 配置自动合并
git config pull.rebase false
```

---

## 验证清单

配置完成后检查：

- [ ] Git 仓库已初始化
- [ ] 所有文件已提交
- [ ] 各 Agent 知道如何 Git Pull/Push
- [ ] 提交消息格式已告知
- [ ] 冲突处理流程已告知
- [ ] 远程仓库已配置（如使用）

---

## 故障排除

### 问题：Git Push 失败

```bash
# 先拉取最新
git pull origin main

# 解决冲突（如有）
# 重新推送
git push origin main
```

### 问题：文件冲突

```bash
# 查看冲突
git diff

# 编辑文件解决冲突
# 标记解决
git add [files]

# 完成合并
git commit -m "Merge: resolved [file] conflicts"
```

### 问题：忘记 Git Pull

```bash
# 总是先 Pull 再 Push
git pull origin main
git push origin main
```

---

**记住：** 共享记忆是 OneAI 的核心基础设施。保持清洁、保持同步、保持可追溯。
