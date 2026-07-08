import { NextResponse } from 'next/server';

const EVENT_NAME_RE = /^[a-z0-9][a-z0-9_:-]{1,80}$/i;

function pickString(value: unknown, max = 200) {
  return typeof value === 'string' ? value.slice(0, max) : null;
}

function sanitizeProperties(value: unknown) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return {};
  }
  return Object.fromEntries(
    Object.entries(value as Record<string, unknown>).slice(0, 20).map(([key, item]) => {
      if (typeof item === 'string') return [key, item.slice(0, 200)];
      if (typeof item === 'number' || typeof item === 'boolean' || item === null) return [key, item];
      return [key, String(item).slice(0, 200)];
    }),
  );
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const event = typeof body.event === 'string' ? body.event.trim() : '';

    if (!EVENT_NAME_RE.test(event)) {
      return NextResponse.json({ ok: false, error: 'Invalid event' }, { status: 400 });
    }

    const properties = sanitizeProperties(body.properties) as Record<string, unknown>;
    const path = typeof body.path === 'string' ? body.path.slice(0, 500) : null;
    const referrer = typeof body.referrer === 'string' ? body.referrer.slice(0, 500) : null;

    const webhookUrl = process.env.ANALYTICS_WEBHOOK_URL;
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    const userAgent = req.headers.get('user-agent')?.slice(0, 500) ?? null;
    const xff = req.headers.get('x-forwarded-for');
    const ip = xff ? xff.split(',')[0].trim() : req.headers.get('x-real-ip');

    const results: Record<string, { status: number; body: string }> = {};

    // Primary: Google Sheets webhook (you see data in a Sheet, zero DevTools)
    if (webhookUrl) {
      try {
        const sheetPayload = {
          timestamp: new Date().toISOString(),
          event,
          path,
          referrer,
          lang: pickString(properties.lang, 8),
          scenario: pickString(properties.scenario, 80),
          template: pickString(properties.template, 80),
          utmSource: pickString(properties.utmSource, 80),
          utmMedium: pickString(properties.utmMedium, 80),
          utmCampaign: pickString(properties.utmCampaign, 120),
          target: pickString(properties.target, 200),
          connected: properties.connected === true,
          signedIn: properties.signedIn === true,
          reason: pickString(properties.reason, 200),
          userAgent,
          properties,
        };
        const r = await fetch(webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(sheetPayload),
        });
        results.sheet = { status: r.status, body: (await r.text()).slice(0, 200) };
      } catch (err) {
        results.sheet = { status: 0, body: 'exception: ' + String(err) };
      }
    } else {
      results.sheet = { status: 0, body: 'no ANALYTICS_WEBHOOK_URL configured' };
    }

    // Fallback: Supabase REST
    if (supabaseUrl && supabaseKey) {
      try {
        const r = await fetch(supabaseUrl + '/rest/v1/analytics_events', {
          method: 'POST',
          headers: {
            apikey: supabaseKey,
            Authorization: 'Bearer ' + supabaseKey,
            'Content-Type': 'application/json',
            Prefer: 'return=minimal',
          },
          body: JSON.stringify({
            event, path, referrer,
            lang: pickString(properties.lang, 8),
            scenario_slug: pickString(properties.scenario, 80),
            template: pickString(properties.template, 80),
            has_scenario_faqs: properties.hasScenarioFaqs === true,
            utm_source: pickString(properties.utmSource, 80),
            utm_medium: pickString(properties.utmMedium, 80),
            utm_campaign: pickString(properties.utmCampaign, 120),
            target: pickString(properties.target, 200),
            connected: properties.connected === true,
            signed_in: properties.signedIn === true,
            reason: pickString(properties.reason, 200),
            properties,
            user_agent: userAgent,
            ip_hash: ip ? 'ip_' + Math.abs(ip.split('').reduce((h, c) => (h << 5) - h + c.charCodeAt(0), 0)).toString(36) : null,
          }),
        });
        results.db = { status: r.status, body: (await r.text()).slice(0, 200) };
      } catch (err) {
        results.db = { status: 0, body: 'exception: ' + String(err) };
      }
    } else {
      results.db = { status: 0, body: 'no supabase env' };
    }

    const okSheet = results.sheet.status === 200 || results.sheet.status === 201;
    const okDb = results.db.status === 201;
    return NextResponse.json({ ok: okSheet || okDb, sheet: results.sheet, db: results.db });
  } catch (err) {
    return NextResponse.json({ ok: false, error: 'invalid: ' + String(err) }, { status: 400 });
  }
}