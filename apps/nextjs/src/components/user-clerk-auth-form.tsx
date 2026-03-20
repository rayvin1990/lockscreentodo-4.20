"use client";

import * as React from "react";
import { redirect } from "next/navigation";
import { SignIn, useUser } from "@clerk/nextjs";

import { cn } from "@saasfly/ui";

type Dictionary = Record<string, string>;

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {
  lang: string;
  dict?: Dictionary;
  disabled?: boolean;
}

export function UserClerkAuthForm({
  className,
  lang,
  ...props
}: UserAuthFormProps) {
  const { user } = useUser()
  if (user) {
    redirect(`/${lang}/generator`)
  }

  return (
    <div className={cn("grid gap-6", className)} {...props}>
      <SignIn
        signUpUrl={`/${lang}/register`}
        fallbackRedirectUrl={`/${lang}/generator`}
        appearance={{
          elements: {
            rootBox: "mx-auto",
            card: {
              boxShadow: "none",
              border: "none",
              background: "transparent",
            },
            header: "hidden",
            headerTitle: "hidden",
            headerSubtitle: "hidden",
            socialButtonsBlockButton: "hidden",
            navbar: "hidden",
            navbarMobile: "hidden",
            footer: "!flex",
            footerAction: "!flex",
            footerActionLink: "!text-brand-green hover:!underline",
            formFieldInput: "rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
            formButtonPrimary: "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 w-full",
            formResendCodesLink: "hidden",
            avatarImage: "hidden",
            logoBox: "hidden",
          },
        }}
      />
    </div>
  );
}
