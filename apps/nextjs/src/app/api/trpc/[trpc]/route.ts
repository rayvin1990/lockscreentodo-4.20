import type { NextRequest } from "next/server";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";

import { getAuth } from "@clerk/nextjs/server";

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic';
export const revalidate = 0;

const setCorsHeaders = (res: Response) => {
  res.headers.set("Access-Control-Allow-Origin", "*");
  res.headers.set("Access-Control-Request-Method", "*");
  res.headers.set("Access-Control-Allow-Methods", "OPTIONS, GET, POST");
  res.headers.set("Access-Control-Allow-Headers", "*");
};

export const OPTIONS = () => {
  const response = new Response(null, {
    status: 204,
  });
  setCorsHeaders(response);
  return response;
};

const createContext = async (req: NextRequest) => {
  // Get authentication from Clerk
  let auth: ReturnType<typeof getAuth>;
  try {
    auth = getAuth(req);
  } catch (error) {
    // In development, provide a demo user for easier testing
    if (process.env.NODE_ENV === "development") {
      console.warn("⚠️  Auth not available in development, using demo user");
      auth = { userId: "demo-user" } as any;
    } else {
      // In production, fail fast if auth is unavailable
      console.error("❌ Authentication failed in production");
      throw new Error("Authentication required");
    }
  }

  // Import createTRPCContext dynamically
  const { createTRPCContext } = await import("@saasfly/api");

  return createTRPCContext({
    headers: req.headers,
    auth,
  });
};

const handler = async (req: NextRequest) => {
  // Import appRouter dynamically
  const { appRouter } = await import("@saasfly/api");

  return fetchRequestHandler({
    endpoint: "/api/trpc",
    router: appRouter,
    req: req,
    createContext: () => createContext(req),
    onError: ({ error, path }: { error: any; path: string | undefined }) => {
      console.log("Error in tRPC handler on path", path);
      console.error(error);
    },
  });
};

export { handler as GET, handler as POST };
