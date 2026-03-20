# OG Image Creation Guide

## What is an OG Image?
An Open Graph (OG) image is displayed when your website is shared on social media platforms (Twitter, Facebook, LinkedIn, etc.).

## Recommended Specifications
- **Dimensions**: 1200 x 630 pixels (1.91:1 ratio)
- **File size**: Under 8MB
- **Format**: JPG or PNG

## Design Suggestions for Lockscreen Todo

### Option 1: Use Canva (Free)
1. Go to https://www.canva.com/create/social-media-graphics/
2. Select "Social Media" → "Facebook Post" (1200 x 630)
3. Add these elements:
   - Title: "Lockscreen Todo"
   - Subtitle: "锁屏待办提醒壁纸生成器"
   - Tagline: "Transform your daily tasks into lockscreen wallpapers"
   - Visual: Show a phone mockup with a sample wallpaper
   - Background: Gradient (blue to purple) matching your site
4. Download as JPG
5. Save to: `apps/nextjs/public/og-image.jpg`

### Option 2: Use Figma (Free)
1. Create new file with dimensions 1200 x 630
2. Design following the brand colors:
   - Primary: Blue (#3B82F6) to Purple (#8B5CF6) gradient
   - Text: White for contrast
3. Include:
   - Logo/emoji: 🎨
   - Headline: "Lockscreen Todo - 锁屏待办"
   - Phone preview showing a wallpaper example
4. Export as JPG
5. Save to: `apps/nextjs/public/og-image.jpg`

### Option 3: Quick Online Tools
- https://www.adobe.com/express/feature/create/og-image
- https://poster.mywallst.com/
- https://metatags.io/ (also previews your meta tags)

## After Creating the Image
1. Place the image at: `apps/nextjs/public/og-image.jpg`
2. Test it at: https://www.opengraph.xyz/
3. Verify on social media preview tools

## Current Configuration
The OG image path is already configured in:
- `apps/nextjs/src/config/site.ts` → `ogImage: "/og-image.jpg"`
- `apps/nextjs/src/app/layout.tsx` → OpenGraph metadata

Once you add the image file to the public folder, it will automatically work!
