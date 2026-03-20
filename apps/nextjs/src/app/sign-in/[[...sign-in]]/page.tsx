'use client';
import { SignIn } from '@clerk/nextjs';

export default function SignInPage() {
  return (
    <div className="flex justify-center items-center min-h-screen">
      <SignIn
        appearance={{
          elements: {
            // 隐藏所有繁琐的表单，只保留 Google 登录按钮
            form: 'hidden',
            formFooter: 'hidden',
            cardHeader: 'hidden',
            divider: 'hidden',
          },
        }}
        // 登录成功后，重定向到我们的兜底 API
        redirectUrl="/api/auth/google-callback"
        // 只显示 Google 登录选项
        socialButtons={['google']}
      />
    </div>
  );
}