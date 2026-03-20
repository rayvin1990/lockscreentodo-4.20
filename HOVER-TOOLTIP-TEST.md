# Price to Hours - Tooltip Mode 测试指南

## 版本 1.7.0 - 悬停提示框模式

### 功能特性

✅ **悬停提示框** - 鼠标悬停在价格上显示提示框
✅ **紧贴鼠标** - 提示框跟随鼠标移动（右下方 15px）
✅ **购买按钮支持** - 悬停在 Buy Now / Add to Cart 按钮也显示
✅ **划线价跳过** - 原价（划线价）不显示提示框
✅ **英文文案** - `≈ 2 hours of work` / `≈ 1 workday` 等

---

## 测试步骤

### 1️⃣ 加载扩展

1. 打开 Chrome 浏览器
2. 访问 `chrome://extensions`
3. 如果已有旧版本，点击"移除"
4. 确保"开发者模式"已开启（右上角开关）
5. 点击"加载已解压的扩展程序"
6. 选择文件夹：`C:\Users\57684\price-to-hours`
7. 确认版本显示为 **1.7.0**

### 2️⃣ 配置扩展

1. 点击浏览器工具栏中的 Price to Hours 图标
2. 确认设置：
   - 金额：`3000`（或你的期望值）
   - 类型：`biweekly`（双周）
   - 工时/天：`8`
   - ✅ 启用扩展（勾选）
3. 点击"保存设置"

### 3️⃣ 打开测试页面

已自动打开：`test-hover-tooltip.html`

如果没有自动打开，请：
1. 在 Chrome 中打开：`C:\Users\57684\price-to-hours\test-hover-tooltip.html`
2. 按 `F12` 打开开发者工具
3. 切换到 Console（控制台）标签

### 4️⃣ 验证扩展状态

在控制台中应该看到类似输出：

```
✅ Chrome Storage API available
📊 页面上有 15 个价格元素
当前设置:
  金额：3000
  类型：biweekly
  工时/天：8
  已启用：true
```

**如果显示扩展已禁用**，在控制台运行：
```javascript
PTH.forceEnable()
```
然后刷新页面

### 5️⃣ 测试悬停功能

#### 测试 1：基本价格悬停
- 将鼠标悬停在 `$299` 上
- **预期**：150ms 后出现黑色提示框
- **提示框内容**：
  ```
  $299
  ─────
  ≈ 2 hours of work
  ```

#### 测试 2：移动鼠标
- 悬停在价格上，等提示框出现
- 缓慢移动鼠标
- **预期**：提示框跟随鼠标移动，保持在右下方

#### 测试 3：移开鼠标
- 将鼠标从价格元素移开
- **预期**：提示框立即消失

#### 测试 4：划线价格
- 将鼠标悬停在 `$599`（划线价）上
- **预期**：不显示提示框

#### 测试 5：购买按钮
- 将鼠标悬停在 "Buy Now" 或 "Add to Cart" 按钮上
- **预期**：显示对应商品价格的提示框

#### 测试 6：动态加载内容
- 等待 2 秒，页面会自动添加更多商品
- 悬停在新添加的价格上
- **预期**：正常显示提示框

---

## 问题排查

### 问题 1：提示框完全不显示

**检查清单**：
1. 扩展是否已加载（版本 1.7.0）
2. 扩展是否已启用（popup 中勾选）
3. 控制台是否有错误信息

**运行诊断**：
在测试页面控制台运行：
```javascript
PTH.checkTooltip()
```

**预期输出**：
```
Tooltip found: {
  display: "none",
  left: "",
  top: "",
  innerHTML: ""
}
```

如果没有找到 tooltip，说明 content script 未加载。

**解决方法**：
1. 在 `chrome://extensions` 点击扩展的"重新加载"按钮
2. 刷新测试页面
3. 检查控制台是否有 `[PTH] Price to Hours initialized` 日志

### 问题 2：提示框显示但不跟随鼠标

**可能原因**：鼠标移动事件未正确绑定

**检查**：
在控制台查看是否有：
```
[PTH] Event listeners added (Tooltip Mode)
```

**解决方法**：
1. 刷新页面
2. 如果还是没有，在扩展管理页面重新加载扩展

### 问题 3：购买按钮不显示提示框

**可能原因**：按钮关联的价格未找到

**检查**：
1. 确保按钮附近有价格元素
2. 价格不能被划线（line-through）

**调试**：
在控制台运行：
```javascript
// 查找所有按钮
document.querySelectorAll('.buy-button, .add-to-cart').forEach(btn => {
  console.log('Button:', btn.textContent);
  console.log('Parent:', btn.parentElement.className);
});
```

### 问题 4：某些网站不工作

**可能原因**：
1. 网站使用了动态加载（SPA）
2. 价格元素是后来才添加到页面的

**解决方法**：
扩展已经使用了事件委托，应该能处理动态内容。如果还是不工作：
1. 刷新页面
2. 检查控制台是否有错误
3. 尝试在popup中关闭再重新开启扩展

---

## 调试命令

在任意页面的控制台运行以下命令：

### 检查提示框状态
```javascript
PTH.checkTooltip()
```

### 查看当前设置
```javascript
PTH.showSettings()
```

### 强制启用扩展
```javascript
PTH.forceEnable()
```

### 完整诊断
```javascript
// 复制 diagnose.js 的内容到控制台运行
```

---

## 预期行为总结

| 操作 | 预期结果 |
|------|----------|
| 悬停在价格上 | 150ms 后显示黑色提示框 |
| 移动鼠标 | 提示框跟随移动（右下方 15px） |
| 鼠标移开 | 提示框立即消失 |
| 悬停在划线价上 | 不显示提示框 |
| 悬停在 Buy Now 按钮 | 显示商品价格提示框 |
| 悬停在 Add to Cart 按钮 | 显示商品价格提示框 |
| 动态加载的价格 | 正常显示提示框 |

---

## 成功标志

✅ 控制台显示 `[PTH] Price to Hours initialized (Tooltip Mode)`
✅ 控制台显示 `[PTH] Buy button detection enabled`
✅ 控制台显示 `[PTH] Event listeners added (Tooltip Mode)`
✅ 悬停价格显示黑色提示框
✅ 提示框跟随鼠标移动
✅ 提示框在 150ms 延迟后显示

---

## 联系支持

如果以上步骤都无法解决问题，请提供：
1. 控制台完整输出
2. Chrome 版本
3. 访问的网站 URL
4. 屏幕截图或录屏
