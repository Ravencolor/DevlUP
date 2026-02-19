'use client';

import { useSession, signIn, signOut } from "next-auth/react";

export default function Home() {
  const { data: session } = useSession();

  if (session && session.user) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold">Welcome, {session.user.name}</h1>
        <p>Email: {session.user.email}</p>
        <button onClick={() => signOut()} className="mt-4 px-4 py-2 bg-red-500 text-white rounded">
          Sign out
        </button>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">You are not signed in</h1>
      <button onClick={() => signIn()} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded">
        Sign in
      </button>
    </div>
  );
}

