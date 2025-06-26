// app/page.tsx
"use client";

import { UserButton, useUser } from "@clerk/nextjs";

export default function Home() {
  const { user, isSignedIn } = useUser();

  return (
    <main className="p-4">
      <h1 className="text-2xl">Welcome to NextBid 🚀</h1>
      {isSignedIn ? (
        <div>
          <p>Hi, {user.firstName}!</p>
          <UserButton afterSignOutUrl="/sign-in" />
        </div>
      ) : (
        <a href="/sign-in" className="text-blue-500 underline">
          Sign In
        </a>
      )}
    </main>
  );
}
