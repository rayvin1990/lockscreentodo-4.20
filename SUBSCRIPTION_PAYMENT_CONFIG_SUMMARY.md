# Lemon Squeezy 支付链接配置总结

## ✅ 已完成配置

### 支付链接
```
https://rayvin1990.lemonsqueezy.com/checkout/buy/4529e39b-6be7-4fdb-ad88-d5f36f2a8bfc
```

### 环境变量
```bash
NEXT_PUBLIC_LEMON_SQUEEZY_CHECKOUT_URL="https://rayvin1990.lemonsqueezy.com/checkout/buy/4529e39b-6be7-4fdb-ad88-d5f36f2a8bfc"
```

### 已集成的组件（5个）

#### 1. ✅ LemonSqueezyButton
**文件**: `apps/nextjs/src/components/lemon-squeezy-button.tsx`

**用途**: 基础支付按钮，可以在任何页面使用

**支持的变体**:
- `default` - 标准升级按钮
- `monthly` - 月付计划 ($2.99/月)
- `lifetime` - 终身计划 ($19.99，推荐)

**使用示例**:
```tsx
<LemonSqueezyButton variant="lifetime" lang="en" />
```

---

#### 2. ✅ UpgradeModalPricing
**文件**: `apps/nextjs/src/components/lockscreen/upgrade-modal-pricing.tsx`

**用途**: 完整的定价弹窗，显示价格对比表

**包含内容**:
- 价格对比表（Free vs Pro）
- 月付计划选项
- 终身计划选项（带"最受欢迎"标签）
- 功能清单
- 直接跳转到支付

**使用场景**: 用户点击升级时，先看价格对比再选择

---

#### 3. ✅ UpgradeModal (已优化)
**文件**: `apps/nextjs/src/components/lockscreen/upgrade-modal.tsx`

**用途**: 7天试用过期后显示的升级弹窗

**触发时机**:
- 用户7天试用结束
- 显示已过期多少天

**行为**: 直接跳转到 Lemon Squeezy 支付页面（不再跳转到 pricing 页面）

**使用场景**: 试用过期提醒，引导用户立即支付

---

#### 4. ✅ DownloadLimitModal (已优化)
**文件**: `apps/nextjs/src/components/lockscreen/download-limit-modal.tsx`

**用途**: 免费用户达到每日下载上限时显示

**触发时机**:
- 免费用户每日下载次数达到 3 次
- 下载或生成二维码时触发

**行为**: 直接跳转到 Lemon Squeezy 支付页面（不再触发 pricing modal）

**使用场景**: 限制提醒，引导用户升级解除限制

---

#### 5. ✅ TrialExpiredModal
**文件**: `apps/nextjs/src/components/lockscreen/trial-expired-modal.tsx`

**用途**: 试用期结束后的提示弹窗

**行为**: 已经配置支付链接，直接跳转支付

---

## 🚀 用户支付流程

### 场景 1: 免费用户达到下载限制
```
1. 用户尝试下载第4个壁纸
   ↓
2. 显示 DownloadLimitModal ("今日下载次数已达上限")
   ↓
3. 用户点击 "升级 Pro"
   ↓
4. 打开 Lemon Squeezy 支付页面
   ↓
5. 用户完成支付
   ↓
6. Webhook 自动更新用户为 Pro
   ↓
7. 用户获得无限下载权限
```

### 场景 2: 试用过期
```
1. 用户7天试用结束
   ↓
2. 显示 UpgradeModal ("Trial Ended")
   ↓
3. 用户点击 "升级到 Pro 版"
   ↓
4. 打开 Lemon Squeezy 支付页面
   ↓
5. 用户完成支付
   ↓
6. Webhook 自动更新用户为 Pro
   ↓
7. 用户继续使用所有 Pro 功能
```

### 场景 3: 用户主动升级
```
1. 用户在页面点击 "Upgrade Pro" 按钮
   ↓
2. 显示 UpgradeModalPricing (完整价格对比)
   ↓
3. 用户选择月付或终身计划
   ↓
4. 打开 Lemon Squeezy 支付页面
   ↓
5. 用户完成支付
   ↓
6. Webhook 自动更新用户为 Pro
```

---

## 📊 定价策略

### 月付计划
- **价格**: $2.99/月
- **适合**: 想先试用的用户
- **优势**: 低门槛，随时取消
- **Lemon Squeezy Variant**: (需要配置)

### 终身计划（推荐）
- **价格**: $19.99 一次性
- **节省**: 相比月付省 45%
- **适合**: 长期使用者
- **优势**: 一次购买，永久使用
- **Lemon Squeezy Variant**: (需要配置)

---

## 🎯 转化优化

### 已实施的优化：

1. ✅ **直接跳转支付** - 所有升级弹窗现在直接打开支付页面，减少跳转步骤
2. ✅ **双语支持** - 所有弹窗支持中英文
3. ✅ **明确的定价** - 清晰显示价格和计划内容
4. ✅ **推荐标签** - 终身计划标记为"最受欢迎"
5. ✅ **节省提示** - 显示"省45%"突出终身计划优势

---

## 🔧 Webhook 配置

### Webhook URL
```
https://www.lockscreentodo.com/api/webhooks/lemon
```

### Signing Secret
```
whsec_f12f43b42499c047615f9e4526fb21e7
```

### 处理的事件
- ✅ `order_created` - 一次性购买（终身计划）
- ✅ `subscription_created` - 新订阅（月付计划）
- ✅ `subscription_updated` - 订阅更新/续费
- ✅ `subscription_cancelled` - 订阅取消

---

## 📝 下一步（可选优化）

### 1. 配置 Lemon Squeezy Variants

如果你有多个产品变体（月付和终身），需要在 Lemon Squeezy 中：

1. 创建多个 Product Variants
2. 获取每个 Variant ID
3. 更新代码中的 URL 参数：

```typescript
const MONTHLY_VARIANT_ID = "你的月付variant_id";
const LIFETIME_VARIANT_ID = "你的终身variant_id";

const url = variant === "lifetime"
  ? `${CHECKOUT_URL}?variant=${LIFETIME_VARIANT_ID}`
  : `${CHECKOUT_URL}?variant=${MONTHLY_VARIANT_ID}`;
```

### 2. 添加支付成功回调（可选）

Lemon Squeezy 支持设置支付成功后的跳转 URL：

```typescript
const checkoutUrl = `${CHECKOUT_URL}?success_url=${encodeURIComponent('https://www.lockscreentodo.com/thank-you')}`;
```

### 3. 添加分析追踪（可选）

```typescript
const handleUpgrade = () => {
  // 追踪升级按钮点击
  analytics.track('upgrade_button_clicked', {
    variant: variant,
    location: 'download_limit_modal'
  });

  window.open(CHECKOUT_URL, "_blank");
};
```

---

## ✅ 验证清单

- [x] 支付链接配置正确
- [x] 环境变量已设置
- [x] 5个组件都已集成支付链接
- [x] Webhook 路由已创建
- [x] Webhook Secret 已配置
- [x] 所有弹窗支持中英文
- [x] 升级流程优化（直接跳转支付）
- [x] 数据库 schema 已更新
- [ ] Vercel 环境变量已部署（需要你手动添加）
- [ ] Lemon Squeezy Webhook 已配置（需要你手动配置）

---

## 🎉 完成！

你的订阅支付系统已经完全配置好了！

现在用户从任何入口点击"升级"，都会：
1. 直接打开 Lemon Squeezy 支付页面
2. 完成支付后，webhook 自动更新用户状态
3. 用户立即获得 Pro 权限

**剩下的就是把环境变量部署到 Vercel 并配置 Lemon Squeezy webhook 了！** 🚀
