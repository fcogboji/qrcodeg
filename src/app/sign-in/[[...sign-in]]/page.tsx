import { SignIn } from "@clerk/nextjs";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign in",
  description: "Sign in to QR Brand Studio",
};

export default function SignInPage() {
  return (
    <div className="flex min-h-[calc(100dvh-3.5rem)] items-center justify-center px-4 py-12">
      <SignIn
        appearance={{
          elements: {
            rootBox: "mx-auto",
            card: "shadow-lg border border-zinc-200 dark:border-zinc-800",
          },
        }}
      />
    </div>
  );
}
