import { NextResponse } from 'next/server';
import { getSupabase } from '~/lib/supabase/admin';

const EVENT_NAME_RE = /^[a-z0-9][a-z0-9_:-]{1,80}$/i;

function hashIp(ip: string | null) {
  if (!ip) return null;
  let h = 0;
  for (let i = 0; i < ip.length; i++) {
    h = ((h << 5) - h + ip.charCodeAt(i)) | 0;
  }
  return 'ip_' + (h >>> 0).toString(36);
}

function pickString(value: unknown, max = 200) {
  return typeof value === 'string' ? value.slice(0, max) : null;
}

function pickBool(value: unknown) {
  return typeof value === 'boolean' ? value : null;
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
    const lang = pickString(properties.lang, 8);
    const scenarioSlug = pickString(properties.scenario, 80);
    const template = pickString(properties.template, 80);
    const hasScenarioFaqs = pickBool(properties.hasScenarioFaqs);
    const utmSource = pickString(properties.utmSource, 80);
    const utmMedium = pickString(properties.utmMedium, 80);
    const utmCampaign = pickString(properties.utmCampaign, 120);
    const target = pickString(properties.target, 200);
    const connected = pickBool(properties.connected);
    const signedIn = pickBool(properties.signedIn);
    const reason = pickString(properties.reason, 200);

    console.log(
      JSON.stringify({
        type: 'analytics_event',
        event,
        path,
        referrer,
        properties,
        timestamp: new Date().toISOString(),
      }),
    );

    const supabase = getSupabase();
    if (supabase) {
      const userAgent = req.headers.get('user-agent')?.slice(0, 500) ?? null;
      const xff = req.headers.get('x-forwarded-for');
      const ip = xff ? xff.split(',')[0].trim() : req.headers.get('x-real-ip');

      void supabase
        .from('analytics_events')
        .insert({
          event,
          path,
          referrer,
          lang,
          scenario_slug: scenarioSlug,
          template,
          has_scenario_faqs: hasScenarioFaqs,
          utm_source: utmSource,
          utm_medium: utmMedium,
          utm_campaign: utmCampaign,
          target,
          connected,
          signed_in: signedIn,
          reason,
          properties,
          user_agent: userAgent,
          ip_hash: hashIp(ip),
        })
        .then(({ error }) => {
          if (error) console.error('analytics_events insert failed', error);
        });
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid payload' }, { status: 400 });
  }
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