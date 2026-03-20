# Legal Documents - Quick Integration Guide

## ✅ Documents Created

### 1. Privacy Policy
- **File**: `PRIVACY_POLICY.md`
- **Sections**:
  - Information Collection
  - Data Usage
  - Third-Party Services
  - Notion Integration Privacy (detailed)
  - Data Security
  - Your Rights
  - Contact Info

### 2. Terms of Use
- **File**: `TERMS_OF_USE.md`
- **Sections**:
  - Service Description
  - User Eligibility
  - Prohibited Activities
  - Notion Integration Terms
  - Subscription Terms
  - Intellectual Property
  - Limitation of Liability
  - Dispute Resolution

---

## 🌐 How to Add to Your Website

### Option 1: Create Separate Pages

Create two new pages in your Next.js app:

```
/apps/nextjs/src/app/[lang]/(legal)/privacy/page.tsx
/apps/nextjs/src/app/[lang]/(legal)/terms/page.tsx
```

**Example - privacy/page.tsx**:
```tsx
import PrivacyContent from '@/components/legal/PrivacyContent';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy - Lockscreen Todo',
  description: 'Learn how Lockscreen Todo protects your privacy and handles your data.',
};

export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
      <PrivacyContent />
    </div>
  );
}
```

---

### Option 2: Footer Links

Add links in your footer component:

```tsx
<a href="/privacy">Privacy Policy</a>
<a href="/terms">Terms of Use</a>
```

---

## 📝 Markdown to HTML Conversion

To display the Markdown files as HTML in your Next.js app, use a library:

### Install dependencies
```bash
npm install react-markdown
```

### Create component - PrivacyContent.tsx
```tsx
'use client';

import ReactMarkdown from 'react-markdown';
import privacyPolicy from '@/../PRIVACY_POLICY.md';

export function PrivacyContent() {
  return (
    <div className="prose prose-lg max-w-none">
      <ReactMarkdown>{privacyPolicy}</ReactMarkdown>
    </div>
  );
}
```

---

## 🎯 Key Improvements Made

### Privacy Policy
- ✅ Added detailed Notion integration section
- ✅ Explained all third-party services
- ✅ Clarified data retention policies
- ✅ Added CCPA compliance for California residents
- ✅ Specified what we DO NOT access in Notion

### Terms of Use
- ✅ Clear age requirement (13+)
- ✅ Prohibited activities list
- ✅ Subscription and payment terms
- ✅ Intellectual property rights
- ✅ Notion integration responsibilities
- ✅ Dispute resolution process
- ✅ Limitation of liability (capped at $100)

---

## 🔔 Important Notes

### 1. Update Contact Email
Change `rayvin19901110@gmail.com` to your actual contact email.

### 2. Governing Law
In the Terms of Use, update:
```
State of [Your State, e.g., Delaware]
City of [Your City]
```
To your actual location.

### 3. Update Dates
Both documents show `February 26, 2026`. Update when you publish.

### 4. Pricing Section
Verify subscription prices and plans match your actual offering.

---

## 📄 Suggested Page Structure

```
/privacy    → Privacy Policy page
/terms      → Terms of Use page
/           → Footer with links to both
```

---

## ⚖️ Legal Compliance Checklist

### ✅ GDPR (EU Users)
- Clear explanation of data collection ✓
- User rights (access, delete, export) ✓
- Contact information ✓
- Data transfer notice ✓

### ✅ CCPA (California Residents)
- Right to know ✓
- Right to delete ✓
- Right to opt-out ✓
- Right to non-discrimination ✓

### ✅ COPPA (Children)
- Age requirement (13+) ✓
- No collection of children's data ✓

---

## 🎨 Styling Suggestions

Use a clean, readable design:

```css
.legal-content {
  max-width: 800px;
  line-height: 1.8;
  color: #333;
}

.legal-content h1 {
  font-size: 2.5rem;
  margin-bottom: 1.5rem;
}

.legal-content h2 {
  font-size: 1.8rem;
  margin-top: 2rem;
  margin-bottom: 1rem;
}

.legal-content p {
  margin-bottom: 1rem;
}

.legal-content ul {
  margin-left: 1.5rem;
  margin-bottom: 1rem;
}

.legal-content li {
  margin-bottom: 0.5rem;
}
```

---

## 📞 Contact Information

Currently set to:
```
Email: rayvin19901110@gmail.com
Website: www.lockscreentodo.com
```

Update to your actual contact if needed.

---

## 🔄 When to Update

Update these documents when:
- Changing data collection practices
- Adding new third-party integrations
- Modifying subscription pricing or plans
- Changing feature functionality
- Adding new services or features
- Changing contact information

Notify users of material changes via email or in-app notification.

---

## ✅ Ready to Use

Both documents are ready for production use. They cover:
- ✅ Data collection and usage
- ✅ Third-party service integration (Notion, Clerk, etc.)
- ✅ User rights and responsibilities
- ✅ Subscription and payment terms
- ✅ Liability limitations
- ✅ Dispute resolution
- ✅ Legal compliance (GDPR, CCPA, COPPA)

---

## 🎉 Next Steps

1. Review both documents
2. Update any specific details (email, location, pricing)
3. Create pages in your Next.js app
4. Add footer links
5. Test on development environment
6. Deploy to production

---

Need any changes or have questions? Let me know!
