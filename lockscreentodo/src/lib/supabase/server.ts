// Supabase Server Client using official SDK v2
import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Create a single instance for server-side use
const supabase: SupabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});

// Legacy exports for compatibility
export { supabase };
export const sql = supabase;
export const createServerSupabaseClient = () => supabase;

// Helper functions for common operations
export const supabaseDb = {
  async select<T = any>(table: string, options?: {
    select?: string,
    eq?: Record<string, any>,
    order?: string,
    limit?: number,
  }): Promise<T[]> {
    let query = supabase.from(table).select(options?.select || '*');

    if (options?.eq) {
      for (const [key, value] of Object.entries(options.eq)) {
        query = query.eq(key, value);
      }
    }

    if (options?.order) {
      const [column, direction] = options.order.split('.');
      query = query.order(column, { ascending: direction !== '.desc' });
    }

    if (options?.limit) {
      query = query.limit(options.limit);
    }

    const { data, error } = await query;
    if (error) {
      console.error(`[Supabase] SELECT ${table} error:`, error.message);
      return [];
    }
    return (data as T[]) || [];
  },

  async insert<T = any>(table: string, data: Record<string, any>): Promise<T[]> {
    const { data: result, error } = await supabase
      .from(table)
      .insert(data)
      .select()
      .single();

    if (error) {
      console.error(`[Supabase] INSERT ${table} error:`, error.message);
      return [];
    }
    return result ? [result as T] : [];
  },

  async update(table: string, data: Record<string, any>, filters: Record<string, any>): Promise<any[]> {
    let query = supabase.from(table).update(data);

    for (const [key, value] of Object.entries(filters)) {
      query = query.eq(key, value);
    }

    const { error } = await query;
    if (error) {
      console.error(`[Supabase] UPDATE ${table} error:`, error.message);
      return [];
    }
    return [{ success: true }];
  },

  async delete(table: string, filters: Record<string, any>): Promise<any[]> {
    let query = supabase.from(table).delete();

    for (const [key, value] of Object.entries(filters)) {
      query = query.eq(key, value);
    }

    const { error } = await query;
    if (error) {
      console.error(`[Supabase] DELETE ${table} error:`, error.message);
      return [];
    }
    return [{ success: true }];
  },
};
