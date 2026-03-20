import { NextRequest, NextResponse } from 'next/server';
import { clerkClient } from '@clerk/nextjs/server';

export async function GET(req: NextRequest) {
  try {
    // 从 Clerk 的回调中获取用户信息
    const { searchParams } = new URL(req.url);
    const email = searchParams.get('email');
    const name = searchParams.get('name');

    if (!email) {
      return NextResponse.redirect(new URL('/sign-in?error=missing_email', req.url));
    }

    // 检查用户是否已存在
    const existingUsers = await clerkClient.users.getUserList({
      emailAddress: [email],
    });

    if (existingUsers.length === 0) {
      // 用户不存在，自动创建一个新用户，无需用户输入任何信息
      await clerkClient.users.createUser({
        emailAddress: [email],
        firstName: name?.split(' ')[0] || 'User',
        lastName: name?.split(' ').slice(1).join(' ') || '',
        skipPasswordRequirement: true, // 跳过密码要求
        skipEmailVerification: true,   // 跳过邮箱验证（关键！）
      });
    }

    // 登录成功，重定向到首页
    return NextResponse.redirect(new URL('/', req.url));
  } catch (error) {
    console.error('Google auth callback error:', error);
    return NextResponse.redirect(new URL('/sign-in?error=auth_failed', req.url));
  }
}