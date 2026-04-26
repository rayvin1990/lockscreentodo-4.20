import { NextRequest, NextResponse } from "next/server";
import { getServerEnvValue } from "~/lib/server-env";

export const dynamic = 'force-dynamic';
export const runtime = "nodejs";

async function fetchWithTimeout(url: string, options: RequestInit, timeoutMs = 8000): Promise<Response> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(timeout);
    return response;
  } catch (error) {
    clearTimeout(timeout);
    throw error;
  }
}

async function fetchWithRetry(url: string, options: RequestInit, retries = 2): Promise<Response> {
  let lastError: Error | null = null;

  for (let i = 0; i <= retries; i++) {
    try {
      const response = await fetchWithTimeout(url, options);
      if (response.ok) return response;
      if (response.status === 403 || response.status === 429) {
        return response;
      }
      lastError = new Error(`HTTP ${response.status}: ${response.statusText}`);
    } catch (error) {
      lastError = error as Error;
      if (error instanceof Error && error.name === 'AbortError') {
        lastError = new Error('Request timeout');
      }
    }

    if (i < retries) {
      await new Promise(r => setTimeout(r, 1000 * Math.pow(2, i)));
    }
  }

  throw lastError;
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get("query");
    const perPage = searchParams.get("per_page") || "10";

    if (!query) {
      return NextResponse.json(
        { error: "Query parameter is required" },
        { status: 400 }
      );
    }

    const unsplashAccessKey = getUnsplashAccessKey();

    if (!unsplashAccessKey) {
      return NextResponse.json(
        { error: "Unsplash API key not configured" },
        { status: 500 }
      );
    }

    let response: Response;
    try {
      response = await fetchWithRetry(
        `https://api.unsplash.com/search/photos?query=${encodeURIComponent(
          query
        )}&per_page=${perPage}&orientation=portrait`,
        {
          headers: {
            Authorization: `Client-ID ${unsplashAccessKey}`,
          },
        },
        2
      );
    } catch (error) {
      console.error("Unsplash fetch failed after retries:", error);
      return NextResponse.json(
        { error: error instanceof Error ? error.message : "Failed to fetch photos - network issue" },
        { status: 504 }
      );
    }

    if (!response.ok) {
      throw new Error(`Unsplash API error: ${response.statusText}`);
    }

    const data = await response.json();

    const images = data.results.map((photo: any) => ({
      id: photo.id,
      urls: {
        regular: photo.urls.regular,
        small: photo.urls.small,
        thumb: photo.urls.thumb,
      },
      description: photo.description || photo.alt_description || null,
      user: {
        name: photo.user.name,
        username: photo.user.username,
      },
    }));

    return NextResponse.json({ images });
  } catch (error) {
    console.error("Error fetching Unsplash photos:", error);
    return NextResponse.json(
      { error: "Failed to fetch photos" },
      { status: 500 }
    );
  }
}

function getUnsplashAccessKey() {
  return getServerEnvValue("UNSPLASH_ACCESS_KEY");
}
