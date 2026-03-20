# Price to Hours - 原价检测修复测试指南

## 修复内容

更新了 `content/content.js` 中的原价检测逻辑，现在可以更准确地识别并跳过原价（划线价格）。

## 测试步骤

### 1. 重新加载扩展

1. 打开 `chrome://extensions/`
2. 找到 "Price to Hours" 扩展
3. 点击刷新按钮 🔄
4. 打开 Amazon 或其他电商网站

### 2. 验证原价不被标记

**预期结果：**
- ✅ 现价（当前售价）旁边显示黑色工时标签
- ✅ 原价（划线价格）旁边**不显示**标签

### 3. 使用调试脚本

在浏览器控制台（F12）中运行以下脚本：

```javascript
// 粘贴 debug-original-price.js 的内容
```

或者直接运行这个快速测试：

```javascript
console.log('=== Quick Test ===');
console.log('isOriginalPrice:', typeof window.isOriginalPrice);
console.log('isOriginalPriceNode:', typeof window.isOriginalPriceNode);

// 测试文本节点检测
const testCases = [
  '$299',
  'Was: $399',
  'List Price: $499',
  '$19.99'
];

testCases.forEach(text => {
  const node = { textContent: text };
  console.log(`isOriginalPriceNode("${text}"):`, window.isOriginalPriceNode(node));
});
```

## 检测规则

现在扩展会跳过以下类型的原价：

1. **删除线样式** - 有 `line-through` 样式的元素
2. **class 包含关键词** - `original`, `was-price`, `list-price`, `strikethrough`, `old-price`, `a-offscreen`
3. **文本包含原价指示词** - `was:`, `was `, `list:`, `list `, `original:`, `regular:`, `msrp:`
4. **aria-label 包含原价模式** - 如 "Was $299", "List Price: $399"
5. **前一个兄弟元素包含原价标签** - 如果前一个元素包含 "was:" 等文本

## 常见问题

### Q: 为什么有些原价还是被标记了？

A: 可能的原因：
- 网站使用了非标准的 class 名或结构
- 原价和现价在同一个元素内
- 动态加载的内容还未被重新扫描

### Q: 如何调试具体问题？

A: 打开浏览器控制台（F12），查看：
- `💰 Price to Hours:` 开头的日志
- 被扫描的价格数量
- 添加的标签数量

### Q: 如何强制重新扫描页面？

A: 在控制台运行：
```javascript
hasScanned = false;
showWorkTimeForAllPrices();
```

## 反馈

如果发现特定的网站或价格结构无法正确识别，请提供：
1. 网站 URL
2. 控制台调试输出
3. 价格元素的 HTML 结构
