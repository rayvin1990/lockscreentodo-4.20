# ACP 故障分析报告

## 问题现象
2026-03-19 期间，ACP 相关能力表现为间歇性或持续不可用，主要现象包括：

- `acpx openclaw exec` 无法稳定执行，曾出现 `spawn EPERM`、`runtime unavailable` 等报错。
- 已存在的命名会话 `acpx-local-fixed` 状态显示为 `dead`，`sessions ensure` 又会继续复用这条失效记录，导致会话无法恢复。
- `openclaw gateway`、Claude Code、Codex 终端一度同时掉线，外部观感为 ACP 整体不可用。
- 同一问题在不同入口表现不一致，导致最初难以判断是 ACPX 本身、OpenClaw 网关，还是当前运行环境的问题。

## 根本原因
本次故障不是单点问题，而是 ACPX 到 OpenClaw 的本地桥接链路同时出现了多处异常。

第一层根因是项目内关键桥接文件缺失或失效，包括 `.acpxrc.json`、`acpx.cmd`、`acpx.ps1` 以及 `scripts/openclaw-acp-runner.mjs`。这些文件缺失后，调用链回退到全局 `C:\Users\57684\.acpx\config.json` 的旧配置；旧配置通过 `cmd /c ...` 启动 `openclaw`，在 Windows 环境下重新触发了 `spawn EPERM`，导致 ACPX 无法正常拉起代理。

第二层根因是 `C:\Users\57684\.openclaw\openclaw.json` 文件带有 UTF-8 BOM 头。`scripts/openclaw-acp-runner.mjs` 在读取该文件时直接 `JSON.parse`，因此解析失败，进一步导致 ACP runner 无法启动，表现为 gateway、终端和 ACP 会话一起掉线。

放大故障感知的次要因素有两个：

- ACPX 命名会话中残留了旧的失效记录，`sessions ensure` 复用了 `dead` 会话，没有自动替换成新会话。
- OpenClaw Guardian 存在基于“长时间无输出”的自动重启行为，历史日志显示其曾多次将 OpenClaw 判定为挂起并重启，使会话稳定性进一步变差。

另外需要单独说明：当前 Codex 沙箱内看到的部分 `spawn EPERM` 现象，经外部环境复核后确认属于沙箱限制，不是这次机器真实故障的最终根因。

## 解决过程
1. 先核对工作区和近期记录，确认项目内 ACPX/OpenClaw 的本地桥接文件曾缺失，导致调用退回全局旧配置。
2. 恢复项目本地配置与入口文件：
   - 还原 `.acpxrc.json`
   - 还原 `acpx.cmd`、`acpx.ps1`
   - 重建 `scripts/openclaw-acp-runner.mjs`
3. 调整 runner 逻辑，让其使用独立的 ACP 状态目录，自动生成 `gateway.token` 与精简版 `openclaw.json`，并通过 `OPENCLAW_CONFIG_PATH`、`OPENCLAW_STATE_DIR`、`OPENCLAW_SKIP_CHANNELS=1` 启动 `openclaw acp`。
4. 将 `openclaw` 启动命令改为绝对路径的 `C:/Program Files/nodejs/node.exe`，避免旧的 `cmd /c ...` 链路继续触发 Windows `spawn EPERM`。
5. 修复 `vendor/acpx` 的 Windows 拉起兼容性，在相关 session 启动逻辑中增加对 `EPERM` 的重试处理。
6. 排查掉线问题时，发现 `C:\Users\57684\.openclaw\openclaw.json` 带有 BOM；随后在 `scripts/openclaw-acp-runner.mjs` 中增加去 BOM 处理，再执行 `JSON.parse`，修复 runner 启动失败问题。
7. 重新校验本地与全局 ACPX 配置，使它们都指向修复后的 `openclaw-acp-runner.mjs`。
8. 在沙箱外复测，确认以下能力恢复：
   - `openclaw exec` 可正常返回 `OK`
   - `sessions new`、`sessions ensure`、`sessions list` 可正常工作
   - 全局 `acpx --verbose openclaw exec "Reply with OK only."` 也能成功执行
9. 最终判定：真实机器上的 ACP 链路已恢复；当前会话内残余的部分 `spawn EPERM` 仅为沙箱限制，不应继续按故障处理。

## 预防措施
- 将 `.acpxrc.json`、`acpx.cmd`、`acpx.ps1`、`scripts/openclaw-acp-runner.mjs` 列为关键基础文件，纳入启动自检与变更保护，避免再次丢失后无感回退到旧配置。
- 对 `openclaw.json` 增加配置文件健壮性校验，读取时统一剥离 UTF-8 BOM，并在启动前做 JSON 格式预检。
- 统一项目内与全局 `acpx` 的 `openclaw` 启动方式，固定为绝对路径 `node.exe + openclaw-acp-runner.mjs`，禁止继续使用旧的 `cmd /c` 启动链路。
- 为 `sessions ensure` 增加“发现会话已 dead 时自动重建”的处理，避免命名会话长期绑定失效记录。
- 调整 OpenClaw Guardian 的挂起判定策略，避免仅凭“无输出”就频繁重启 OpenClaw；至少应结合进程存活、端口监听、健康检查结果再决定是否重启。
- 建立一份最小化验收清单，固定检查 `config show`、`openclaw exec`、`sessions ensure`、`status` 四项，作为每次修复后的标准回归验证。
