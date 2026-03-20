# Lockscreen Todo Max - 双产品线配置总结

## ✅ 配置完成

### 📦 两个产品线

#### 1. 月付计划 - $2.99/月
**产品名称**: Lockscreen Todo Max (Monthly)
**支付链接**: `https://rayvin1990.lemonsqueezy.com/checkout/buy/fdb56b05-4e75-4983-9951-a325e8752df4`
**环境变量**: `NEXT_PUBLIC_LEMON_SQUEEZY_MONTHLY_URL`

#### 2. 终身计划 - $19.99（一次性）
**产品名称**: Lockscreen Todo Max (Lifetime)
**支付链接**: `https://rayvin1990.lemonsqueezy.com/checkout/buy/4529e39b-6be7-4fdb-ad88-d5f36f2a8bfc`
**环境变量**: `NEXT_PUBLIC_LEMON_SQUEEZY_LIFETIME_URL`

---

## 🔧 环境变量配置

### 本地开发 (.env.local)
```bash
# Lockscreen Todo Max - Two Product Lines
NEXT_PUBLIC_LEMON_SQUEEZY_MONTHLY_URL="https://rayvin1990.lemonsqueezy.com/checkout/buy/fdb56b05-4e75-4983-9951-a325e8752df4"
NEXT_PUBLIC_LEMON_SQUEEZY_LIFETIME_URL="https://rayvin1990.lemonsqueezy.com/checkout/buy/4529e39b-6be7-4fdb-ad88-d5f36f2a8bfc"
LEMON_WEBHOOK_SECRET="whsec_f12f43b42499c047615f9e4526fb21e7"
```

### Vercel 生产环境（需要添加）

在 Vercel Dashboard → Settings → Environment Variables 中添加：

**Name**: `NEXT_PUBLIC_LEMON_SQUEEZY_MONTHLY_URL`
**Value**: `https://rayvin1990.lemonsqueezy.com/checkout/buy/fdb56b05-4e75-4983-9951-a325e8752df4`

**Name**: `NEXT_PUBLIC_LEMON_SQUEEZY_LIFETIME_URL`
**Value**: `https://rayvin1990.lemonsqueezy.com/checkout/buy/4529e39b-6be7-4fdb-ad88-d5f36f2a8bfc`

然后重新部署项目。

---

## 🎯 组件更新情况

所有组件已更新为支持双产品线：

### 1. ✅ LemonSqueezyButton
**文件**: `apps/nextjs/src/components/lemon-squeezy-button.tsx`

**行为**:
- `variant="monthly"` → 跳转到月付产品
- `variant="lifetime"` → 跳转到终身产品
- `variant="default"` → 默认跳转到终身产品

**使用示例**:
```tsx
<LemonSqueezyButton variant="monthly" lang="zh" />  // $2.99/月
<LemonSqueezyButton variant="lifetime" lang="zh" /> // $19.99 终身
<LemonSqueezyButton variant="default" lang="zh" />  // 默认终身
```

---

### 2. ✅ UpgradeModalPricing
**文件**: `apps/nextjs/src/components/lockscreen/upgrade-modal-pricing.tsx`

**行为**:
- 显示两个计划的价格对比
- 用户点击月付按钮 → 跳转到月付产品
- 用户点击终身按钮 → 跳转到终身产品

**UI**:
- 左侧：月付计划 $2.99/月
- 右侧：终身计划 $19.99（标记为"最受欢迎"）

---

### 3. ✅ UpgradeModal
**文件**: `apps/nextjs/src/components/lockscreen/upgrade-modal.tsx`

**行为**:
- 试用过期时显示
- 点击"升级到 Pro" → **跳转到终身产品**（默认推荐终身）

---

### 4. ✅ DownloadLimitModal
**文件**: `apps/nextjs/src/components/lockscreen/download-limit-modal.tsx`

**行为**:
- 达到每日下载限制时显示
- 点击"升级 Pro" → **跳转到终身产品**（默认推荐终身）

---

### 5. ✅ TrialExpiredModal
**文件**: `apps/nextjs/src/components/lockscreen/trial-expired-modal.tsx`

**行为**:
- 试用期结束时显示
- 点击"升级" → **跳转到终身产品**（默认推荐终身）

---

## 💡 逻辑说明

### 默认行为（推荐终身）

所有直接升级的弹窗（UpgradeModal, DownloadLimitModal, TrialExpiredModal）都默认跳转到**终身产品**，原因：

1. **更高价值** - 终身产品带来更多收入
2. **用户满意** - 一次购买，永久使用
3. **减少流失** - 避免月付订阅取消

### 用户选择（价格对比）

只有在 `UpgradeModalPricing` 中，用户可以看到两个计划的完整对比并自由选择：
- 如果用户想要低门槛 → 选择月付 $2.99
- 如果用户想要长期使用 → 选择终身 $19.99（推荐）

---

## 🚀 用户流程示例

### 场景 1: 达到下载限制 → 推荐终身
```
1. 免费用户下载第4个壁纸
   ↓
2. 显示 DownloadLimitModal
   ↓
3. 用户点击 "升级 Pro"
   ↓
4. 打开终身产品支付页面 ($19.99)
   ↓
5. 用户完成支付 → 获得终身 Pro
```

### 场景 2: 试用过期 → 推荐终身
```
1. 用户7天试用结束
   ↓
2. 显示 UpgradeModal
   ↓
3. 用户点击 "升级到 Pro 版"
   ↓
4. 打开终身产品支付页面 ($19.99)
   ↓
5. 用户完成支付 → 获得终身 Pro
```

### 场景 3: 主动升级 → 自由选择
```
1. 用户点击 "Upgrade Pro" 按钮
   ↓
2. 显示 UpgradeModalPricing（完整价格对比）
   ↓
3. 用户选择：
   - 月付 $2.99 → 打开月付产品
   - 终身 $19.99 → 打开终身产品（推荐）
   ↓
4. 用户完成支付 → 获得 Pro
```

---

## 📊 定价对比

| 特性 | 月付计划 | 终身计划 |
|------|---------|----------|
| **价格** | $2.99/月 | $19.99 一次性 |
| **年成本** | $35.88/年 | $19.99 永久 |
| **节省** | - | **省 45%** |
| **灵活性** | 随时取消 | 一次购买 |
| **推荐度** | 适合试用 | ⭐ 最受欢迎 |

---

## ✅ 配置验证清单

### 本地环境
- [x] .env.local 已更新两个产品 URL
- [x] 所有组件已更新为支持双产品线
- [x] 默认行为设置为推荐终身产品
- [x] 价格对比弹窗支持两个选项

### Vercel 生产环境
- [ ] 添加 `NEXT_PUBLIC_LEMON_SQUEEZY_MONTHLY_URL`
- [ ] 添加 `NEXT_PUBLIC_LEMON_SQUEEZY_LIFETIME_URL`
- [ ] 重新部署项目

### Lemon Squeezy Webhook
- [x] Webhook 路由已创建
- [x] Webhook Secret 已配置
- [ ] 在 Lemon Squeezy 配置 Webhook URL
- [ ] 选择事件：order_created, subscription_created, subscription_updated, subscription_cancelled

---

## 🎯 测试步骤

### 1. 本地测试
```bash
# 1. 确保开发服务器运行
bun run dev

# 2. 打开浏览器
# http://localhost:3000

# 3. 点击任意 "Upgrade Pro" 按钮
# 4. 检查是否打开正确的支付链接
```

### 2. 月付产品测试
- 点击月付按钮
- 应打开: `https://rayvin1990.lemonsqueezy.com/checkout/buy/fdb56b05-4e75-4983-9951-a325e8752df4`

### 3. 终身产品测试
- 点击终身按钮（或默认升级）
- 应打开: `https://rayvin1990.lemonsqueezy.com/checkout/buy/4529e39b-6be7-4fdb-ad88-d5f36f2a8bfc`

---

## 📝 后续优化建议

### 1. 添加成功回跳（可选）
在 Lemon Squeezy 产品设置中配置：
- **Success URL**: `https://www.lockscreentodo.com/thank-you`
- **Cancel URL**: `https://www.lockscreentodo.com/?cancelled=true`

### 2. 添加分析追踪（可选）
```typescript
const handleUpgrade = (variant: "monthly" | "lifetime") => {
  // 追踪用户选择
  analytics.track('plan_selected', {
    variant: variant,
    price: variant === 'monthly' ? 2.99 : 19.99
  });

  const checkoutUrl = variant === "monthly" ? MONTHLY_URL : LIFETIME_URL;
  window.open(checkoutUrl, "_blank");
};
```

### 3. 显示用户当前计划（可选）
在用户设置页面显示：
```
当前计划：免费
升级选项：月付 $2.99 | 终身 $19.99
```

---

## 🎉 完成！

你的双产品线支付系统已经完全配置好了！

**主要特性**:
- ✅ 支持月付和终身两个产品
- ✅ 所有弹窗默认推荐终身产品
- ✅ 价格对比页面让用户自由选择
- ✅ Webhook 自动处理两种支付类型

**下一步**:
- 在 Vercel 添加新的环境变量
- 重新部署项目
- 测试支付流程

现在用户可以根据需求选择最适合的计划了！🚀
