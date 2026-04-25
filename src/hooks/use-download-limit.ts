import { useState } from 'react';
import { useAuth } from '@clerk/nextjs';

interface DownloadLimitStatus {
  canDownload: boolean;
  isPro: boolean;
  isTrialActive: boolean;
  isTrialExpired: boolean;
  remainingThisWeek: number;
  weekDownloadCount: number;
  message: string;
  error?: string;
  reason?: string;
}

/**
 * Custom Hook to check user download limit
 */
export function useDownloadLimit() {
  const { isSignedIn, isLoaded, getToken } = useAuth();
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

  const checkDownloadLimit = async (): Promise<DownloadLimitStatus> => {
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
      const token = await getToken();
      const response = await fetch('/api/download/check-limit', {
        method: 'GET',
        cache: 'no-store',
        credentials: 'include',
        headers: token ? {
          Authorization: `Bearer ${token}`,
        } : undefined,
      });

      const data = await response.json();

      if (response.status === 401) {
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
      console.error('Download limit check failed:', error);
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

  const recordDownload = async (): Promise<boolean> => {
    if (!isSignedIn) {
      console.warn('User not logged in, skipping download record');
      return false;
    }

    try {
      const token = await getToken();
      const response = await fetch('/api/download/record-usage', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      if (!response.ok) {
        const error = await response.json();
        console.error('Failed to record download:', error);
        return false;
      }

      console.log('Download recorded');

      await checkDownloadLimit();

      return true;
    } catch (error) {
      console.error('Failed to record download:', error);
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
