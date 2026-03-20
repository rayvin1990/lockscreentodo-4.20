import { SignUp } from "@clerk/nextjs";

export default function SSOSignUpCallbackPage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <SignUp afterSignUpUrl="/generator" signInUrl="/sign-in" />
    </div>
  );
}
