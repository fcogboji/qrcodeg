"use client";

import { SignInButton, SignUpButton, UserButton, useAuth } from "@clerk/nextjs";

export function ClerkHeaderAuth() {
  const { isSignedIn, isLoaded } = useAuth();

  if (!isLoaded) {
    return (
      <div
        className="h-8 w-24 shrink-0 animate-pulse rounded-lg bg-zinc-200/80 dark:bg-zinc-800"
        aria-hidden
      />
    );
  }

  if (!isSignedIn) {
    return (
      <div className="flex shrink-0 items-center gap-2 sm:gap-3">
        <SignInButton mode="modal">
          <button
            type="button"
            className="rounded-lg px-3 py-1.5 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
          >
            Log in
          </button>
        </SignInButton>
        <SignUpButton mode="modal">
          <button
            type="button"
            className="rounded-lg bg-violet-600 px-3 py-1.5 text-sm font-medium text-white shadow-sm transition hover:bg-violet-500"
          >
            Sign up
          </button>
        </SignUpButton>
      </div>
    );
  }

  return (
    <div className="flex shrink-0 items-center gap-2 sm:gap-3">
      <UserButton
        appearance={{
          elements: {
            avatarBox: "h-8 w-8",
          },
        }}
      />
    </div>
  );
}
