"use client";

import React, { useEffect, useState } from "react";
import { useUser, useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Crown, Calendar, Shield, Receipt, Clock, CheckCircle, XCircle, Image as ImageIcon, Download, TrendingUp, ShoppingCart, User } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@saasfly/ui/card";
import { Button } from "@saasfly/ui/button";
import { UpgradeModalPricing } from "~/components/lockscreen/upgrade-modal-pricing";

interface TrialInfo {
  canGenerate: boolean;
  isPro: boolean;
  trialEndsAt: string | null;
  daysRemaining: number;
}

interface Order {
  id: string;
  date: string;
  amount: number;
  status: 'completed' | 'pending' | 'failed';
  plan: string;
}

interface UsageStats {
  totalGenerated: number;
  totalDownloaded: number;
  weekGenerated: number;
  weekDownloaded: number;
}

interface WallpaperHistory {
  id: string;
  imageUrl: string;
  createdAt: string;
  taskCount: number;
}

export default function SettingsPage() {
  const { user, isLoaded } = useUser();
  const { signOut } = useAuth();
  const router = useRouter();
  const [trialInfo, setTrialInfo] = useState<TrialInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [usageStats, setUsageStats] = useState<UsageStats>({
    totalGenerated: 0,
    totalDownloaded: 0,
    weekGenerated: 0,
    weekDownloaded: 0,
  });
  const [wallpaperHistory, setWallpaperHistory] = useState<WallpaperHistory[]>([]);
  const [selectedWallpaper, setSelectedWallpaper] = useState<WallpaperHistory | null>(null);
  const [currentLang, setCurrentLang] = useState('en');
  const [showUpgradeModalPricing, setShowUpgradeModalPricing] = useState(false);

  // Mock orders - 待接入真实支付系统后替换
  const [orders] = useState<Order[]>([]);

  // Get current language
  useEffect(() => {
    const path = window.location.pathname;
    const lang = path.split('/')[1] || 'en';
    setCurrentLang(lang);
  }, []);

  // Listen for custom event to open pricing modal
  useEffect(() => {
    const handleOpenPricingModal = () => {
      setShowUpgradeModalPricing(true);
    };

    window.addEventListener('openPricingModal', handleOpenPricingModal);

    return () => {
      window.removeEventListener('openPricingModal', handleOpenPricingModal);
    };
  }, []);

  useEffect(() => {
    if (!isLoaded || !user) return;

    // Fetch trial info from API
    fetch("/api/generate/check-limit")
      .then((res) => res.json())
      .then((data) => {
        console.log('User trial info:', data);
        setTrialInfo({
          canGenerate: data.canGenerate ?? false,
          isPro: data.isPro ?? false,
          trialEndsAt: data.trialEndsAt ?? null,
          daysRemaining: data.daysRemaining ?? 0,
        });
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch trial info:", err);
        setIsLoading(false);
      });

    // Fetch usage stats
    fetch("/api/user/usage-stats")
      .then((res) => res.json())
      .then((data) => {
        setUsageStats(data);
      })
      .catch((err) => {
        console.error("Failed to fetch usage stats:", err);
      });

    // Fetch wallpaper history
    fetch("/api/user/wallpaper-history")
      .then((res) => res.json())
      .then((data) => {
        setWallpaperHistory(data.wallpapers || []);
      })
      .catch((err) => {
        console.error("Failed to fetch wallpaper history:", err);
      });
  }, [isLoaded, user]);

  if (!isLoaded || isLoading) {
    return (
      <div className="min-h-screen bg-brand-bg flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  // Calculate remaining time
  let hoursRemaining = 0;
  let minutesRemaining = 0;
  if (trialInfo?.trialEndsAt) {
    const trialEndDate = new Date(trialInfo.trialEndsAt);
    const now = new Date();
    const diff = trialEndDate.getTime() - now.getTime();

    // Only calculate hours/minutes if there's still time remaining
    if (diff > 0) {
      const totalDays = Math.floor(diff / (1000 * 60 * 60 * 24));
      const remainingAfterDays = diff - (totalDays * 1000 * 60 * 60 * 24);
      hoursRemaining = Math.floor(remainingAfterDays / (1000 * 60 * 60));
      const remainingAfterHours = remainingAfterDays - (hoursRemaining * 1000 * 60 * 60);
      minutesRemaining = Math.floor(remainingAfterHours / (1000 * 60));
    }
  }

  const userId = user?.id || 'N/A';
  const subscriptionId = trialInfo?.isPro ? `SUB-${userId.slice(0, 8).toUpperCase()}` : 'N/A';

  return (
    <div className="min-h-screen bg-brand-bg p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Account Center</h1>
            <p className="text-gray-400">Manage your subscription, orders, and account information</p>
          </div>
          <div className="flex gap-3">
            <Button
              onClick={() => router.push(`/${currentLang}`)}
              variant="outline"
              className="border-gray-600 text-white hover:bg-gray-800"
            >
              Home
            </Button>
            <Button
              onClick={() => router.push(`/${currentLang}/generator`)}
              variant="outline"
              className="border-gray-600 text-white hover:bg-gray-800"
            >
              Back to Generator
            </Button>
          </div>
        </div>

        <div className="grid gap-6">
          {/* Account Info Card */}
          <Card className="bg-brand-card border-gray-800">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Shield className="w-5 h-5 text-brand-blue" />
                Account Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-400">Email</label>
                  <p className="text-white font-medium">{user?.primaryEmailAddress?.emailAddress}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-400">Name</label>
                  <p className="text-white font-medium">
                    {user?.firstName} {user?.lastName}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 p-4 bg-brand-bg/50 rounded-lg border border-gray-700">
                <div>
                  <label className="text-sm text-gray-400">User ID</label>
                  <p className="text-white font-mono text-sm mt-1">{userId}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-400">Subscription ID</label>
                  <p className="text-white font-mono text-sm mt-1">{subscriptionId}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Subscription Status Card */}
          <Card className="bg-brand-card border-gray-800">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Crown className="w-5 h-5 text-amber-500" />
                Subscription Status
              </CardTitle>
              <CardDescription className="text-gray-400">
                Current subscription plan and trial details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm text-gray-400">Current Plan</label>
                  <p className="text-white font-medium flex items-center gap-2 mt-1">
                    {trialInfo?.isPro ? (
                      <>
                        <span className="text-amber-500">PRO</span>
                        <Shield className="w-4 h-4 text-amber-500" />
                      </>
                    ) : (
                      <span className="text-gray-400">FREE</span>
                    )}
                  </p>
                </div>

                {trialInfo?.trialEndsAt && trialInfo.isPro && (
                  <div>
                    <label className="text-sm text-gray-400 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      Trial Expires
                    </label>
                    <p className="text-white font-medium mt-1">
                      {new Date(trialInfo.trialEndsAt).toLocaleString()}
                    </p>
                  </div>
                )}

                {trialInfo?.trialEndsAt && trialInfo.isPro && (
                  <div>
                    <label className="text-sm text-gray-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      Time Remaining
                    </label>
                    <p className="text-brand-green font-bold text-lg mt-1">
                      {trialInfo.daysRemaining}d {hoursRemaining}h {minutesRemaining}m
                    </p>
                  </div>
                )}
              </div>

              {trialInfo?.trialEndsAt && trialInfo.isPro && trialInfo.daysRemaining >= 0 && (
                <div className="bg-gradient-to-r from-brand-green/20 to-emerald-600/20 border-2 border-brand-green/50 rounded-lg p-6 mt-4">
                  <div className="flex items-center gap-3 mb-3">
                    <CheckCircle className="w-6 h-6 text-brand-green" />
                    <p className="text-brand-green font-semibold text-lg">
                      PRO Trial Active
                    </p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-white text-2xl font-bold">
                      {trialInfo.daysRemaining} days {hoursRemaining} hours {minutesRemaining} minutes
                    </p>
                    <p className="text-gray-300 text-sm">
                      Unlimited wallpapers • All 200+ styles • Full customization • Priority support
                    </p>
                  </div>
                </div>
              )}

              {(!trialInfo?.isPro || (trialInfo.trialEndsAt && trialInfo.daysRemaining < 0)) && (
                <div className="bg-gradient-to-r from-red-500/20 to-orange-500/20 border-2 border-red-500/50 rounded-lg p-6 mt-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <XCircle className="w-6 h-6 text-red-500" />
                      <p className="text-red-500 font-semibold text-lg">
                        {trialInfo && trialInfo.daysRemaining < 0 ? "Trial Expired" : "Free Account"}
                      </p>
                    </div>
                    <Button
                      onClick={() => {
                        const event = new CustomEvent('openPricingModal');
                        window.dispatchEvent(event);
                      }}
                      className="bg-brand-green hover:bg-emerald-500 text-white font-semibold"
                    >
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Upgrade to Pro
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Usage Statistics Card */}
          <Card className="bg-brand-card border-gray-800">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-brand-green" />
                Usage Statistics
              </CardTitle>
              <CardDescription className="text-gray-400">
                Your wallpaper generation and usage stats
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Total Stats */}
                <div className="space-y-4">
                  <h4 className="text-white font-semibold text-sm">Total</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-4 bg-brand-bg/50 rounded-lg border border-gray-700">
                      <div className="flex items-center gap-3">
                        <ImageIcon className="w-5 h-5 text-brand-blue" />
                        <span className="text-gray-300">Wallpapers Generated</span>
                      </div>
                      <span className="text-2xl font-bold text-white">{usageStats.totalGenerated}</span>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-brand-bg/50 rounded-lg border border-gray-700">
                      <div className="flex items-center gap-3">
                        <Download className="w-5 h-5 text-brand-green" />
                        <span className="text-gray-300">Wallpapers Downloaded</span>
                      </div>
                      <span className="text-2xl font-bold text-white">{usageStats.totalDownloaded}</span>
                    </div>
                  </div>
                </div>

                {/* Weekly Stats */}
                <div className="space-y-4">
                  <h4 className="text-white font-semibold text-sm">This Week</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-4 bg-brand-bg/50 rounded-lg border border-gray-700">
                      <div className="flex items-center gap-3">
                        <ImageIcon className="w-5 h-5 text-blue-400" />
                        <span className="text-gray-300">Generated This Week</span>
                      </div>
                      <span className="text-2xl font-bold text-white">{usageStats.weekGenerated}</span>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-brand-bg/50 rounded-lg border border-gray-700">
                      <div className="flex items-center gap-3">
                        <Download className="w-5 h-5 text-emerald-400" />
                        <span className="text-gray-300">Downloaded This Week</span>
                      </div>
                      <span className="text-2xl font-bold text-white">{usageStats.weekDownloaded}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Wallpaper History Card */}
          <Card className="bg-brand-card border-gray-800">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-purple-500" />
                Wallpaper History
              </CardTitle>
              <CardDescription className="text-gray-400">
                Your recently generated wallpapers
              </CardDescription>
            </CardHeader>
            <CardContent>
              {wallpaperHistory.length === 0 ? (
                <div className="text-center py-12">
                  <ImageIcon className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400 mb-2">No wallpapers yet</p>
                  <Button
                    onClick={() => router.push(`/${currentLang}/generator`)}
                    className="mt-4 bg-brand-green hover:bg-emerald-500 text-white font-semibold"
                  >
                    Generate Your First Wallpaper
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-3 md:grid-cols-6 lg:grid-cols-8 gap-3">
                  {wallpaperHistory.map((wallpaper) => (
                    <div
                      key={wallpaper.id}
                      className="group relative cursor-pointer"
                      onClick={() => setSelectedWallpaper(wallpaper)}
                    >
                      <div className="aspect-[9/16] rounded-lg overflow-hidden border-2 border-gray-700 hover:border-brand-green transition-all hover:scale-105">
                        <img
                          src={wallpaper.imageUrl}
                          alt="Wallpaper"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                        <span className="text-white text-xs">Click to view</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Orders Card */}
          <Card className="bg-brand-card border-gray-800">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Receipt className="w-5 h-5 text-brand-green" />
                Order History
              </CardTitle>
              <CardDescription className="text-gray-400">
                Your purchase records and transaction history
              </CardDescription>
            </CardHeader>
            <CardContent>
              {orders.length === 0 ? (
                <div className="text-center py-12">
                  <Receipt className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400 mb-2">No orders yet</p>
                  <p className="text-gray-500 text-sm">
                    You are currently on a 7-day free trial
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {orders.map((order) => (
                    <div key={order.id} className="flex items-center justify-between p-4 bg-brand-bg/50 rounded-lg border border-gray-700">
                      <div>
                        <p className="text-white font-medium">{order.plan}</p>
                        <p className="text-gray-400 text-sm">{order.date}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-white font-medium">${order.amount}</p>
                        <p className={`text-sm ${
                          order.status === 'completed' ? 'text-brand-green' :
                          order.status === 'pending' ? 'text-yellow-500' :
                          'text-red-500'
                        }`}>
                          {order.status.toUpperCase()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Account Actions Card */}
          <Card className="bg-brand-card border-gray-800">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <User className="w-5 h-5 text-blue-500" />
                Account Actions
              </CardTitle>
              <CardDescription className="text-gray-400">
                Manage your account settings and preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-400">
                You can view your subscription status, usage statistics, and wallpaper history in the sections above. Need more? Upgrade to Pro for unlimited wallpapers and advanced features.
              </p>
              <div className="flex flex-wrap gap-3">
                <Button
                  onClick={() => {
                    const event = new CustomEvent('openPricingModal');
                    window.dispatchEvent(event);
                  }}
                  className="bg-brand-green hover:bg-emerald-500 text-white font-semibold"
                >
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Upgrade to Pro
                </Button>
                <button
                  onClick={() => signOut()}
                  className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-500 border border-red-500/50 rounded-lg transition-colors"
                >
                  Sign Out
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Wallpaper Preview Modal */}
      {selectedWallpaper && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedWallpaper(null)}
        >
          <div
            className="relative max-w-4xl w-full max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={() => setSelectedWallpaper(null)}
              className="absolute -top-10 right-0 text-white hover:text-gray-300 transition-colors"
            >
              <XCircle className="w-8 h-8" />
            </button>

            {/* Image */}
            <div className="flex-1 flex items-center justify-center">
              <img
                src={selectedWallpaper.imageUrl}
                alt="Wallpaper preview"
                className="max-w-full max-h-[80vh] object-contain rounded-lg shadow-2xl"
              />
            </div>

            {/* Download button */}
            <div className="flex justify-center mt-4 gap-4">
              <a
                href={selectedWallpaper.imageUrl}
                download
                className="px-6 py-3 bg-brand-green hover:bg-emerald-500 text-white font-semibold rounded-lg flex items-center gap-2 transition-colors"
              >
                <Download className="w-5 h-5" />
                Download Wallpaper
              </a>
            </div>

            {/* Info */}
            <div className="text-center mt-3 text-gray-400 text-sm">
              <p>{new Date(selectedWallpaper.createdAt).toLocaleString()}</p>
              <p>{selectedWallpaper.taskCount} tasks</p>
            </div>
          </div>
        </div>
      )}

      {/* Pricing Modal */}
      <UpgradeModalPricing
        isOpen={showUpgradeModalPricing}
        onClose={() => setShowUpgradeModalPricing(false)}
      />
    </div>
  );
}
