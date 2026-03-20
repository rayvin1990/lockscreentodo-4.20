/**
 * Supabase 客户端初始化
 *
 * 环境变量（在 .env.local 中配置）:
 * NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
 * NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Supabase 环境变量未配置');
  console.error('请在 .env.local 中设置:');
  console.error('NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url');
  console.error('NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key');
}

export const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '');

/**
 * 用户资料相关操作
 */
export const userProfileQueries = {
  /**
   * 获取用户资料
   */
  async getByUserId(userId: string) {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('获取用户资料失败:', error);
      throw error;
    }

    return data;
  },

  /**
   * 创建用户资料（新用户注册时自动激活7天试用）
   */
  async create(userId: string) {
    const trialEndsAt = new Date();
    trialEndsAt.setDate(trialEndsAt.getDate() + 7); // 7天后

    const { data, error } = await supabase
      .from('user_profiles')
      .insert({
        user_id: userId,
        trial_ends_at: trialEndsAt.toISOString(),
        is_pro: true,
        subscription_plan: 'PRO',
      })
      .select()
      .single();

    if (error) {
      console.error('创建用户资料失败:', error);
      throw error;
    }

    console.log(`✅ 新用户 ${userId} 激活7天试用，到期时间: ${trialEndsAt.toLocaleDateString()}`);
    return data;
  },

  /**
   * 更新试用状态
   */
  async updateTrialEndsAt(userId: string, trialEndsAt: Date) {
    const { data, error } = await supabase
      .from('user_profiles')
      .update({
        trial_ends_at: trialEndsAt.toISOString(),
        is_pro: true,
        subscription_plan: 'PRO',
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', userId)
      .select()
      .single();

    if (error) {
      console.error('更新试用状态失败:', error);
      throw error;
    }

    return data;
  },
};

/**
 * 壁纸使用记录相关操作
 */
export const wallpaperUsageQueries = {
  /**
   * 获取用户今日使用次数
   */
  async getTodayCount(userId: string) {
    const today = new Date().toISOString().split('T')[0];

    const { data, error } = await supabase
      .from('wallpaper_usage')
      .select('count')
      .eq('user_id', userId)
      .eq('date', today)
      .single();

    if (error && error.code !== 'PGRST116') {
      // 记录不存在时返回0
      if (error.code === 'PGRST116') {
        return 0;
      }
      console.error('获取使用记录失败:', error);
      throw error;
    }

    return data?.count || 0;
  },

  /**
   * Get user's download count for today
   */
  async getTodayDownloadCount(userId: string) {
    const today = new Date().toISOString().split('T')[0];

    const { data, error } = await supabase
      .from('wallpaper_usage')
      .select('download_count')
      .eq('user_id', userId)
      .eq('date', today)
      .single();

    if (error && error.code !== 'PGRST116') {
      // Return 0 if record doesn't exist
      if (error.code === 'PGRST116') {
        return 0;
      }
      console.error('Failed to fetch download record:', error);
      throw error;
    }

    return data?.download_count || 0;
  },

  /**
   * Get user's download count for this week (Monday to Sunday)
   */
  async getWeekDownloadCount(userId: string) {
    const now = new Date();
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - now.getDay() + 1); // Get Monday (day 1)
    weekStart.setHours(0, 0, 0, 0);

    const weekStartISO = weekStart.toISOString().split('T')[0];

    const { data, error } = await supabase
      .from('wallpaper_usage')
      .select('download_count')
      .eq('user_id', userId)
      .gte('date', weekStartISO)
      .order('date', { ascending: true });

    if (error) {
      console.error('Failed to fetch weekly download records:', error);
      throw error;
    }

    // Sum up all downloads this week
    const weekTotal = (data || []).reduce((sum, record) => sum + (record.download_count || 0), 0);
    return weekTotal;
  },

  /**
   * Increment usage count
   */
  async increment(userId: string) {
    const today = new Date().toISOString().split('T')[0];

    // Use upsert (insert or update)
    const { data, error } = await supabase
      .from('wallpaper_usage')
      .upsert(
        {
          user_id: userId,
          date: today,
          count: 1,
        },
        {
          onConflict: 'user_id,date',
          ignoreDuplicates: false,
        }
      )
      .select()
      .single();

    // If record exists, increment count
    if (error && error.code === 'PGRST116') {
      // Record exists, need to increment count
      const { data: updateData, error: updateError } = await supabase
        .from('wallpaper_usage')
        .update({
          count: supabase.rpc('increment', { x: 1 }),
        })
        .eq('user_id', userId)
        .eq('date', today)
        .select()
        .single();

      if (updateError) {
        console.error('Failed to update usage count:', updateError);
        throw updateError;
      }

      return updateData;
    }

    if (error) {
      console.error('Failed to record usage:', error);
      throw error;
    }

    return data;
  },

  /**
   * Increment download count
   */
  async incrementDownload(userId: string) {
    const today = new Date().toISOString().split('T')[0];

    // Check if record exists for today
    const { data: existingRecord } = await supabase
      .from('wallpaper_usage')
      .select('count, download_count')
      .eq('user_id', userId)
      .eq('date', today)
      .single();

    if (existingRecord) {
      // Record exists, increment download_count
      const { data, error } = await supabase
        .from('wallpaper_usage')
        .update({
          download_count: (existingRecord.download_count || 0) + 1,
        })
        .eq('user_id', userId)
        .eq('date', today)
        .select()
        .single();

      if (error) {
        console.error('Failed to update download count:', error);
        throw error;
      }

      return data;
    } else {
      // Record doesn't exist, create new one
      const { data, error } = await supabase
        .from('wallpaper_usage')
        .insert({
          user_id: userId,
          date: today,
          count: 0,
          download_count: 1,
        })
        .select()
        .single();

      if (error) {
        console.error('Failed to create download record:', error);
        throw error;
      }

      return data;
    }
  },
};
