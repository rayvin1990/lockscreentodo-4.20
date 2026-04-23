// Supabase REST API client - direct fetch approach for reliability
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

function getHeaders() {
  return {
    'apikey': SUPABASE_ANON_KEY,
    'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
    'Content-Type': 'application/json',
    'Prefer': 'return=representation',
  };
}

function buildUrl(table: string, params: Record<string, string>) {
  const url = new URL(`${SUPABASE_URL}/rest/v1/${table}`);
  for (const [key, value] of Object.entries(params)) {
    url.searchParams.append(key, value);
  }
  return url.toString();
}

// Legacy exports
export const supabase = { from: () => ({ select: () => ({ eq: () => ({ order: () => ({ limit: () => ({ single: () => ({}) }) }) }) }) }) };
export const sql = {};
export const createServerSupabaseClient = () => ({});

// Helper functions for common operations
export const supabaseDb = {
  async select<T = any>(table: string, options?: {
    select?: string,
    eq?: Record<string, any>,
    order?: string,
    limit?: number,
  }): Promise<T[]> {
    const params: Record<string, string> = {};
    if (options?.select) params['select'] = options.select;
    else params['select'] = '*';

    if (options?.eq) {
      for (const [key, value] of Object.entries(options.eq)) {
        params[`${key}=eq.${value}`] = '';
      }
    }

    if (options?.order) {
      params['order'] = options.order;
    }

    if (options?.limit) {
      params['limit'] = String(options.limit);
    }

    const url = buildUrl(table, params);

    try {
      const res = await fetch(url, {
        method: 'GET',
        headers: getHeaders(),
      });
      if (!res.ok) {
        const text = await res.text();
        console.error(`[Supabase] SELECT ${table} error ${res.status}:`, text);
        return [];
      }
      return await res.json();
    } catch (err: any) {
      console.error(`[Supabase] SELECT ${table} failed:`, err.message);
      return [];
    }
  },

  async insert<T = any>(table: string, data: Record<string, any>): Promise<T[]> {
    const url = `${SUPABASE_URL}/rest/v1/${table}`;

    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const text = await res.text();
        console.error(`[Supabase] INSERT ${table} error ${res.status}:`, text);
        return [];
      }
      return await res.json();
    } catch (err: any) {
      console.error(`[Supabase] INSERT ${table} failed:`, err.message);
      return [];
    }
  },

  async update(table: string, data: Record<string, any>, filters: Record<string, any>): Promise<any[]> {
    let url = `${SUPABASE_URL}/rest/v1/${table}?`;
    for (const [key, value] of Object.entries(filters)) {
      url += `${encodeURIComponent(key)}=eq.${encodeURIComponent(value)}&`;
    }

    try {
      const res = await fetch(url, {
        method: 'PATCH',
        headers: getHeaders(),
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const text = await res.text();
        console.error(`[Supabase] UPDATE ${table} error ${res.status}:`, text);
        return [];
      }
      return await res.json();
    } catch (err: any) {
      console.error(`[Supabase] UPDATE ${table} failed:`, err.message);
      return [];
    }
  },

  async delete(table: string, filters: Record<string, any>): Promise<any[]> {
    let url = `${SUPABASE_URL}/rest/v1/${table}?`;
    for (const [key, value] of Object.entries(filters)) {
      url += `${encodeURIComponent(key)}=eq.${encodeURIComponent(value)}&`;
    }

    try {
      const res = await fetch(url, {
        method: 'DELETE',
        headers: getHeaders(),
      });
      if (!res.ok) {
        const text = await res.text();
        console.error(`[Supabase] DELETE ${table} error ${res.status}:`, text);
        return [];
      }
      return await res.json();
    } catch (err: any) {
      console.error(`[Supabase] DELETE ${table} failed:`, err.message);
      return [];
    }
  },
};
