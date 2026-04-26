"use client";

import { ClerkProvider } from "@clerk/clerk-react";
import { useRouter } from "next/navigation";

const LocalClerkProvider = ClerkProvider as React.ComponentType<
  React.PropsWithChildren<{
    __internal_bypassMissingPublishableKey: true;
    routerPush: (to: string) => void;
    routerReplace: (to: string) => void;
  }>
>;

export function ClerkLocalFallbackProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  return (
    <LocalClerkProvider
      __internal_bypassMissingPublishableKey
      routerPush={(to) => router.push(to)}
      routerReplace={(to) => router.replace(to)}
    >
      {children}
    </LocalClerkProvider>
  );
}
