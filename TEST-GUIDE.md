# Price to Hours Extension - Test Guide

## 文件结构
```
price-to-hours/
├── manifest.json          # 扩展程序配置
├── content/
│   └── content.js         # 内容脚本（处理 tooltip 显示）
├── popup/
│   ├── popup.html         # Popup UI
│   ├── popup.css          # Popup 样式
│   └── popup.js           # Popup 逻辑（保存设置、切换开关）
├── styles/
│   └── tooltip.css        # Tooltip 样式
└── icons/
    └── icon*.png          # 图标文件
```

## 测试步骤

### 准备工作
1. 打开 Chrome 浏览器
2. 访问 `chrome://extensions/`
3. 开启右上角的 "开发者模式"
4. 找到 "Price to Hours" 扩展程序
5. 点击 "重新加载" 按钮（刷新图标）

### 测试 1: 初始状态检查

**步骤：**
1. 打开一个有价格的网页（如 Amazon、淘宝等）
2. 按 F12 打开开发者工具
3. 切换到 "Console" 标签页
4. 鼠标悬停在价格元素上

**预期结果：**
- 控制台显示 `[PTH] Price to Hours initialized`
- 控制台显示 `[PTH] Settings loaded: {...}`
- 控制台显示 `[PTH] Event listeners added successfully`
- 鼠标悬停时显示 tooltip，显示 "≈ X.XX hours"

### 测试 2: 关闭扩展开关

**步骤：**
1. 点击浏览器工具栏中的扩展图标
2. 关闭 "Enable Extension" 开关
3. 观察 popup 中的通知
4. 查看控制台日志
5. 鼠标再次悬停在价格上

**预期结果：**
- Popup 显示通知 "Extension disabled"
- 控制台显示 `[PTH] Extension toggled via message: false`
- 控制台显示 `[PTH] removeEventListeners called, eventListenersAdded = true`
- 控制台显示 `[PTH] Event listeners removed successfully`
- 鼠标悬停时 **不再显示** tooltip

### 测试 3: 开启扩展开关

**步骤：**
1. 点击扩展图标
2. 开启 "Enable Extension" 开关
3. 观察 popup 中的通知
4. 查看控制台日志
5. 鼠标再次悬停在价格上

**预期结果：**
- Popup 显示通知 "Extension enabled"
- 控制台显示 `[PTH] Extension toggled via message: true`
- 控制台显示 `[PTH] setupEventListeners called, eventListenersAdded = false`
- 控制台显示 `[PTH] Event listeners added successfully`
- 鼠标悬停时 **应该再次显示** tooltip

### 测试 4: 保存设置

**步骤：**
1. 点击扩展图标
2. 修改 "Income Amount" 为不同的值（如从 3000 改为 5000）
3. 点击 "Save Settings" 按钮
4. 观察 popup 中的通知
5. 鼠标悬停在价格上

**预期结果：**
- Popup 显示通知 "Settings saved successfully"
- 控制台显示 `[PTH] Settings updated via message: {...}`
- tooltip 显示的工时应该变少（因为时薪更高了）

### 测试 5: 修改 Hours per Day

**步骤：**
1. 点击扩展图标
2. 修改 "Hours per Day"（如从 8 改为 6）
3. 点击 "Save Settings" 按钮
4. 鼠标悬停在价格上

**预期结果：**
- tooltip 显示的工时应该会变化

## 调试日志说明

### Content.js 日志
```
[PTH] Price to Hours initialized          - 扩展初始化
[PTH] Settings loaded: {...}              - 设置加载成功
[PTH] Event listeners added successfully  - 事件监听器已添加
[PTH] Event listeners removed successfully - 事件监听器已移除
[PTH] Extension toggled via message: X    - 开关切换消息
[PTH] Settings updated via message: {...} - 设置更新消息
[PTH Debug] === Hover Event ===           - 鼠标悬停事件开始
[PTH Debug] Target: ...                   - 悬停的目标元素
[PTH Debug] ✓ Price found in target: ...  - 找到价格
[PTH Debug] ✗ No valid price found        - 未找到有效价格
[PTH Debug] Calculation: {...}            - 工时计算详情
[PTH Debug] Result: ...                   - 计算结果
[PTH Debug] === End Hover Event ===       - 悬停事件结束
```

### Popup.js 日志
```
[Popup] Settings loaded: {...}            - 设置加载成功
```

## 常见问题排查

### 问题 1: Tooltip 不显示
**可能原因：**
- 扩展未启用（检查开关状态）
- 价格格式无法识别
- 元素被其他脚本修改

**解决方法：**
- 检查控制台是否有 `[PTH] Event listeners added successfully`
- 查看 `[PTH Debug]` 日志中的价格解析结果
- 尝试刷新页面

### 问题 2: 开关切换无响应
**可能原因：**
- 消息传递失败
- Storage API 问题

**解决方法：**
- 检查控制台是否有错误消息
- 重新加载扩展程序
- 重启浏览器

### 问题 3: 设置保存后无变化
**可能原因：**
- Storage 同步延迟
- 消息未正确传递

**解决方法：**
- 刷新页面
- 检查控制台日志
- 确认设置已保存（重新打开 popup 查看值）

## 测试完成检查清单

- [ ] 扩展程序成功加载
- [ ] 初始状态 tooltip 正常显示
- [ ] 关闭开关后 tooltip 不再显示
- [ ] 开启开关后 tooltip 恢复显示
- [ ] 保存设置后 tooltip 计算正确
- [ ] 所有日志输出符合预期

## 联系支持

如果测试过程中遇到问题，请提供：
1. Chrome 版本号
2. 扩展程序版本号（1.9.1）
3. 控制台完整日志
4. 测试的网页 URL
