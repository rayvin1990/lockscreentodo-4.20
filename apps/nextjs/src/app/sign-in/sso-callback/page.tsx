import { SignIn } from "@clerk/nextjs";

export default function SSOSignInCallbackPage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <SignIn afterSignInUrl="/generator" signUpUrl="/sign-up" />
    </div>
  );
}
