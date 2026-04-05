import { SignUp } from "@clerk/nextjs";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign up",
  description: "Create a QR Brand Studio account",
};

export default function SignUpPage() {
  return (
    <div className="flex min-h-[calc(100dvh-3.5rem)] items-center justify-center px-4 py-12">
      <SignUp
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
