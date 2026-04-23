import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    // Clerk authentication
    CLERK_SECRET_KEY: z.string().optional(),
  },
  client: {
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: z.string().optional(),
    NEXT_PUBLIC_APP_URL: z.string().min(1).default('http://localhost:3000'),
    NEXT_PUBLIC_SUPABASE_URL: z.string().url().optional(),
    NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().optional(),
    NEXT_PUBLIC_NEON_DATABASE_URL: z.string().url().optional(),
    // Notion OAuth
    NEXT_PUBLIC_NOTION_CLIENT_ID: z.string().optional(),
    // ImgBB for image hosting
    NEXT_PUBLIC_IMGBB_API_KEY: z.string().optional(),
    // Unsplash
    UNSPLASH_ACCESS_KEY: z.string().optional(),
    // iOS/Android helper URLs for quick set
    NEXT_PUBLIC_IOS_SHORTCUT_URL: z.string().optional(),
    NEXT_PUBLIC_ANDROID_HELPER_DEEPLINK_URL: z.string().optional(),
    // Lemon Squeezy payment URLs
    NEXT_PUBLIC_LEMON_SQUEEZY_MONTHLY_URL: z.string().optional(),
    NEXT_PUBLIC_LEMON_SQUEEZY_LIFETIME_URL: z.string().optional(),
  },
  runtimeEnv: {
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    NEXT_PUBLIC_NEON_DATABASE_URL: process.env.NEXT_PUBLIC_NEON_DATABASE_URL,
    NEXT_PUBLIC_NOTION_CLIENT_ID: process.env.NEXT_PUBLIC_NOTION_CLIENT_ID,
    NEXT_PUBLIC_IMGBB_API_KEY: process.env.NEXT_PUBLIC_IMGBB_API_KEY,
    UNSPLASH_ACCESS_KEY: process.env.UNSPLASH_ACCESS_KEY,
    NEXT_PUBLIC_IOS_SHORTCUT_URL: process.env.NEXT_PUBLIC_IOS_SHORTCUT_URL,
    NEXT_PUBLIC_ANDROID_HELPER_DEEPLINK_URL: process.env.NEXT_PUBLIC_ANDROID_HELPER_DEEPLINK_URL,
    NEXT_PUBLIC_LEMON_SQUEEZY_MONTHLY_URL: process.env.NEXT_PUBLIC_LEMON_SQUEEZY_MONTHLY_URL,
    NEXT_PUBLIC_LEMON_SQUEEZY_LIFETIME_URL: process.env.NEXT_PUBLIC_LEMON_SQUEEZY_LIFETIME_URL,
    CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY,
  },
});