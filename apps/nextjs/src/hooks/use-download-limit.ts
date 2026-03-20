import { useState } from 'react';
import { useAuth } from '@clerk/nextjs';

interface DownloadLimitStatus {
  canDownload: boolean;
  isPro: boolean;
  isTrialActive: boolean;
  isTrialExpired: boolean; // User had trial but it expired
  remainingThisWeek: number; // -1 表示无限
  weekDownloadCount: number;
  message: string;
  error?: string;
  reason?: string; // NOT_AUTHENTICATED | WEEKLY_LIMIT_REACHED | INTERNAL_ERROR
}

/**
 * Custom Hook to check user download limit
 *
 * Usage example:
 * const { downloadLimitStatus, checkDownloadLimit, recordDownload, isLoading } = useDownloadLimit();
 *
 * if (!downloadLimitStatus.canDownload) {
 *   // Show upgrade modal
 *   setShowUpgradeModal(true);
 * }
 */
export function useDownloadLimit() {
  const { isSignedIn, isLoaded } = useAuth();
  const [downloadLimitStatus, setDownloadLimitStatus] = useState<DownloadLimitStatus>({
    canDownload: false,
    isPro: false,
    isTrialActive: false,
    isTrialExpired: false,
    remainingThisWeek: 0,
    weekDownloadCount: 0,
    message: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Check download limit
   */
  const checkDownloadLimit = async (): Promise<DownloadLimitStatus> => {
    // 1. Check authentication status
    if (!isLoaded || !isSignedIn) {
      const notAuthStatus: DownloadLimitStatus = {
        canDownload: false,
        isPro: false,
        isTrialActive: false,
        isTrialExpired: false,
        remainingThisWeek: 0,
        weekDownloadCount: 0,
        message: 'Please log in first',
        reason: 'NOT_AUTHENTICATED',
      };
      setDownloadLimitStatus(notAuthStatus);
      return notAuthStatus;
    }

    setIsLoading(true);

    try {
      // 2. Call API to check limit
      const response = await fetch('/api/download/check-limit', {
        method: 'GET',
        cache: 'no-store', // Ensure fresh data
      });

      const data = await response.json();

      if (response.status === 401) {
        // Not logged in
        const status: DownloadLimitStatus = {
          canDownload: false,
          isPro: false,
          isTrialActive: false,
          isTrialExpired: false,
          remainingThisWeek: 0,
          weekDownloadCount: 0,
          message: data.error || 'Please log in first',
          reason: 'NOT_AUTHENTICATED',
        };
        setDownloadLimitStatus(status);
        return status;
      }

      if (response.status === 403) {
        // Limit reached
        const status: DownloadLimitStatus = {
          canDownload: false,
          isPro: data.isPro || false,
          isTrialActive: data.isTrialActive || false,
          isTrialExpired: data.isTrialExpired || false,
          remainingThisWeek: 0,
          weekDownloadCount: data.weekDownloadCount || 0,
          message: data.error || 'Download limit reached',
          reason: 'WEEKLY_LIMIT_REACHED',
        };
        setDownloadLimitStatus(status);
        return status;
      }

      if (!response.ok) {
        // Other errors
        const status: DownloadLimitStatus = {
          canDownload: false,
          isPro: false,
          isTrialActive: false,
          isTrialExpired: false,
          remainingThisWeek: 0,
          weekDownloadCount: 0,
          message: data.error || 'Failed to check limit',
          reason: 'INTERNAL_ERROR',
          error: data.details,
        };
        setDownloadLimitStatus(status);
        return status;
      }

      // Success - can download
      const status: DownloadLimitStatus = {
        canDownload: data.canDownload || false,
        isPro: data.isPro || false,
        isTrialActive: data.isTrialActive || false,
        isTrialExpired: data.isTrialExpired || false,
        remainingThisWeek: data.remainingThisWeek || 0,
        weekDownloadCount: data.weekDownloadCount || 0,
        message: data.message || 'Can download',
      };
      setDownloadLimitStatus(status);
      return status;

    } catch (error: any) {
      console.error('❌ Download limit check failed:', error);
      const errorStatus: DownloadLimitStatus = {
        canDownload: false,
        isPro: false,
        isTrialActive: false,
        isTrialExpired: false,
        remainingThisWeek: 0,
        weekDownloadCount: 0,
        message: 'Network error, please try again',
        reason: 'INTERNAL_ERROR',
        error: error.message,
      };
      setDownloadLimitStatus(errorStatus);
      return errorStatus;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Record download (call after successful download)
   */
  const recordDownload = async (): Promise<boolean> => {
    if (!isSignedIn) {
      console.warn('⚠️ User not logged in, skipping download record');
      return false;
    }

    try {
      const response = await fetch('/api/download/record-usage', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const error = await response.json();
        console.error('❌ Failed to record download:', error);
        return false;
      }

      console.log('✅ Download recorded');

      // Re-check limit to update UI
      await checkDownloadLimit();

      return true;
    } catch (error) {
      console.error('❌ Failed to record download:', error);
      return false;
    }
  };

  return {
    downloadLimitStatus,
    checkDownloadLimit,
    recordDownload,
    isLoading,
  };
}
