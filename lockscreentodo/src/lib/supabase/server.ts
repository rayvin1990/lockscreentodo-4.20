// Supabase REST API client - replaces Neon
// Uses Supabase REST API instead of direct Postgres connection

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

function getHeaders() {
  return {
    'apikey': SUPABASE_ANON_KEY || '',
    'Authorization': `Bearer ${SUPABASE_ANON_KEY || ''}`,
    'Content-Type': 'application/json',
  };
}

// Helper to build query string
function queryString(params: Record<string, any>): string {
  const parts: string[] = [];
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null) {
      parts.push(`${encodeURIComponent(key)}=${encodeURIComponent(value)}`);
    }
  }
  return parts.length > 0 ? '?' + parts.join('&') : '';
}

// Supabase REST API client
export const supabase = {
  // SELECT from table
  async select(table: string, options?: {
    select?: string,
    eq?: Record<string, any>,
    order?: string,
    limit?: number,
  }) {
    if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
      console.warn('[Supabase] No URL or Key configured');
      return [];
    }

    let url = `${SUPABASE_URL}/rest/v1/${table}`;
    const queryParams: Record<string, string> = {};

    if (options?.select) {
      queryParams['select'] = options.select;
    } else {
      queryParams['select'] = '*';
    }

    if (options?.eq) {
      for (const [key, value] of Object.entries(options.eq)) {
        queryParams[`${key}=eq.${value}`] = '';
      }
    }

    if (options?.order) {
      queryParams['order'] = options.order;
    }

    if (options?.limit) {
      queryParams['limit'] = String(options.limit);
    }

    const qs = Object.entries(queryParams)
      .map(([k, v]) => v ? `${k}=${v}` : k)
      .join('&');

    url = url + (qs ? '?' + qs : '');

    try {
      const res = await fetch(url, {
        method: 'GET',
        headers: getHeaders(),
      });
      if (!res.ok) {
        console.error(`[Supabase] SELECT error: ${res.status}`, await res.text());
        return [];
      }
      return await res.json();
    } catch (error: any) {
      console.error(`[Supabase] SELECT ${table} failed:`, error.message);
      return [];
    }
  },

  // INSERT into table
  async insert(table: string, data: Record<string, any>, returning: boolean = true) {
    if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
      console.warn('[Supabase] No URL or Key configured');
      return [];
    }

    const url = `${SUPABASE_URL}/rest/v1/${table}`;
    const headers = {
      ...getHeaders(),
      'Prefer': returning ? 'return=representation' : 'return=minimal',
    };

    try {
      const res = await fetch(url, {
        method: 'POST',
        headers,
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        console.error(`[Supabase] INSERT error: ${res.status}`, await res.text());
        return [];
      }
      if (returning) {
        return await res.json();
      }
      return [{ id: 0 }]; // dummy return
    } catch (error: any) {
      console.error(`[Supabase] INSERT ${table} failed:`, error.message);
      return [];
    }
  },

  // UPDATE table
  async update(table: string, data: Record<string, any>, filters: Record<string, any>) {
    if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
      console.warn('[Supabase] No URL or Key configured');
      return [];
    }

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
        console.error(`[Supabase] UPDATE error: ${res.status}`, await res.text());
        return [];
      }
      return await res.json();
    } catch (error: any) {
      console.error(`[Supabase] UPDATE ${table} failed:`, error.message);
      return [];
    }
  },

  // DELETE from table
  async delete(table: string, filters: Record<string, any>) {
    if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
      console.warn('[Supabase] No URL or Key configured');
      return [];
    }

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
        console.error(`[Supabase] DELETE error: ${res.status}`, await res.text());
        return [];
      }
      return await res.json();
    } catch (error: any) {
      console.error(`[Supabase] DELETE ${table} failed:`, error.message);
      return [];
    }
  },
};

// Legacy exports for compatibility
export const sql = supabase;
export const createServerSupabaseClient = () => supabase;
