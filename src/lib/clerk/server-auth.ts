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
  try {
    const { userId } = await auth();
    if (userId) return userId;
  } catch (error) {
    console.warn("[clerk-auth] auth() failed, trying bearer token fallback", error);
  }

  const token = getBearerToken(req);
  if (!token) return null;

  try {
    const clerkSecretKey = process.env.CLERK_SECRET_KEY;
    const verificationOptions = clerkSecretKey
      ? { secretKey: clerkSecretKey }
      : {};
    const verifiedToken = await verifyToken(token, verificationOptions);

    const claims = verifiedToken.data;
    if (claims && typeof claims === "object" && "sub" in claims && typeof claims.sub === "string") {
      return claims.sub;
    }

    console.warn("[clerk-auth] Bearer token verification failed", verifiedToken.errors);
    return null;
  } catch (error) {
    console.warn("[clerk-auth] Bearer token verification threw", error);
    return null;
  }
}
