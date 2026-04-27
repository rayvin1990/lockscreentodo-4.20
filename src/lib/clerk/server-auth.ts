import { auth, verifyToken } from "@clerk/nextjs/server";
import type { NextRequest } from "next/server";

type AuthRequest = Request | NextRequest;

function getBearerToken(req?: AuthRequest): string | null {
  const authorization = req?.headers.get("authorization");
  if (!authorization) return null;

  const [scheme, token] = authorization.split(" ");
  if (scheme?.toLowerCase() !== "bearer" || !token) return null;

  return token;
}

export async function getAuthenticatedUserId(req?: AuthRequest): Promise<string | null> {
  // Try Clerk's auth() first - works well in most environments
  try {
    const { userId } = await auth();
    if (userId) return userId;
  } catch (error) {
    console.warn("[clerk-auth] auth() failed, trying bearer token fallback", error);
  }

  // Fallback: verify bearer token from Authorization header
  const token = getBearerToken(req);
  if (!token) return null;

  try {
    const clerkSecretKey = process.env.CLERK_SECRET_KEY;
    const verificationOptions = clerkSecretKey
      ? { secretKey: clerkSecretKey }
      : {};
    const verifiedToken = await verifyToken(token, verificationOptions);

    // Clerk's verifyToken returns the payload directly or with .data property
    const payload = (verifiedToken as any).payload || (verifiedToken as any).data;
    if (payload && typeof payload === "object" && "sub" in payload) {
      return payload.sub as string;
    }

    // Fallback: check standard JWT claims (azp, iss, sub)
    const claims = verifiedToken as { sub?: string; [key: string]: unknown };
    if (claims.sub) return claims.sub;

    console.warn("[clerk-auth] Bearer token verification succeeded but no 'sub' claim found");
    return null;
  } catch (error) {
    console.warn("[clerk-auth] Bearer token verification threw", error);
    return null;
  }
}
