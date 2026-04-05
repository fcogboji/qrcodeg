import type { Metadata } from "next";
import { Suspense } from "react";
import { LoginForm } from "./login-form";

export const metadata: Metadata = {
  title: "Log in",
  description: "Sign in to QR Brand Studio",
};

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <p className="mx-auto max-w-md px-4 py-24 text-center text-sm text-zinc-500">Loading…</p>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
