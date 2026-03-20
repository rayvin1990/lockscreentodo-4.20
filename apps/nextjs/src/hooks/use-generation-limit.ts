import { useState, useEffect } from 'react';
import { useAuth } from '@clerk/nextjs';

interface LimitStatus {
  canGenerate: boolean;
  isPro: boolean;
  trialEndsAt: string | null;
  daysRemaining: number;
  todayCount: number;
  message: string;
  error?: string;
  reason?: string; // NOT_AUTHENTICATED | TRIAL_EXPIRED | INTERNAL_ERROR
}

/**
 * 检查用户生成限额的自定义 Hook
 *
 * 使用示例:
 * const { limitStatus, checkLimit, isLoading } = useGenerationLimit();
 *
 * if (!limitStatus.canGenerate) {
 *   // 显示升级弹窗
 *   setShowUpgradeModal(true);
 * }
 */
export function useGenerationLimit() {
  const { isSignedIn, isLoaded } = useAuth();
  const [limitStatus, setLimitStatus] = useState<LimitStatus>({
    canGenerate: false,
    isPro: false,
    trialEndsAt: null,
    daysRemaining: 0,
    todayCount: 0,
    message: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  /**
   * 检查生成限额
   */
  const checkLimit = async (): Promise<LimitStatus> => {
    // 1. 检查登录状态
    if (!isLoaded || !isSignedIn) {
      const notAuthStatus: LimitStatus = {
        canGenerate: false,
        isPro: false,
        trialEndsAt: null,
        daysRemaining: 0,
        todayCount: 0,
        message: '请先登录',
        reason: 'NOT_AUTHENTICATED',
      };
      setLimitStatus(notAuthStatus);
      return notAuthStatus;
    }

    setIsLoading(true);

    try {
      // 2. 调用 API 检查限额
      const response = await fetch('/api/generate/check-limit', {
        method: 'GET',
        cache: 'no-store', // 确保获取最新数据
      });

      const data = await response.json();

      if (response.status === 401) {
        // 未登录
        const status: LimitStatus = {
          canGenerate: false,
          isPro: false,
          trialEndsAt: null,
          daysRemaining: 0,
          todayCount: 0,
          message: data.error || '请先登录',
          reason: 'NOT_AUTHENTICATED',
        };
        setLimitStatus(status);
        return status;
      }

      if (response.status === 403) {
        // 限额已满
        const status: LimitStatus = {
          canGenerate: false,
          isPro: data.isPro || false,
          trialEndsAt: data.trialEndsAt || null,
          daysRemaining: 0,
          todayCount: data.todayCount || 0,
          message: data.error || '生成次数已达上限',
          reason: 'TRIAL_EXPIRED',
        };
        setLimitStatus(status);
        return status;
      }

      if (!response.ok) {
        // 其他错误
        const status: LimitStatus = {
          canGenerate: false,
          isPro: false,
          trialEndsAt: null,
          daysRemaining: 0,
          todayCount: 0,
          message: data.error || '检查限额失败',
          reason: 'INTERNAL_ERROR',
          error: data.details,
        };
        setLimitStatus(status);
        return status;
      }

      // 成功 - 可以生成
      const status: LimitStatus = {
        canGenerate: data.canGenerate || false,
        isPro: data.isPro || false,
        trialEndsAt: data.trialEndsAt || null,
        daysRemaining: data.daysRemaining || 0,
        todayCount: data.todayCount || 0,
        message: data.message || '可以生成',
      };
      setLimitStatus(status);
      return status;

    } catch (error: any) {
      console.error('❌ 检查生成限额失败:', error);
      const errorStatus: LimitStatus = {
        canGenerate: false,
        isPro: false,
        trialEndsAt: null,
        daysRemaining: 0,
        todayCount: 0,
        message: '网络错误，请重试',
        reason: 'INTERNAL_ERROR',
        error: error.message,
      };
      setLimitStatus(errorStatus);
      return errorStatus;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * 记录生成次数（生成成功后调用）
   */
  const recordUsage = async (): Promise<boolean> => {
    if (!isSignedIn) {
      console.warn('⚠️ 用户未登录，跳过记录使用次数');
      return false;
    }

    try {
      const response = await fetch('/api/generate/record-usage', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const error = await response.json();
        console.error('❌ 记录使用次数失败:', error);
        return false;
      }

      console.log('✅ 使用次数已记录');

      // 重新检查限额以更新 UI
      await checkLimit();

      return true;
    } catch (error) {
      console.error('❌ 记录使用次数失败:', error);
      return false;
    }
  };

  // 页面加载时自动检查限额
  useEffect(() => {
    if (isLoaded && isSignedIn) {
      checkLimit();
    }
  }, [isLoaded, isSignedIn]);

  return {
    limitStatus,
    checkLimit,
    recordUsage,
    isLoading,
  };
}
