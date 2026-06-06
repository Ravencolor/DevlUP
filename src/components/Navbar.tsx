"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";

export default function Navbar() {
  const pathname = usePathname();
  const { data: session } = useSession();

  const links = [
    { href: "/quest", label: "Quête du jour" },
    { href: "/leaderboard", label: "Classement" },
  ];

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div className="max-w-3xl mx-auto px-6 h-14 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <span className="text-lg font-black text-black tracking-tight">
            DevlUP
          </span>
          <nav className="flex items-center gap-1">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  pathname === link.href
                    ? "bg-black text-white"
                    : "text-gray-500 hover:text-black hover:bg-gray-100"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        {session?.user && (
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-400 hidden sm:block">
              {session.user.email}
            </span>
            <button
              onClick={() => signOut({ callbackUrl: "/auth/signin" })}
              className="text-xs text-gray-400 hover:text-black transition-colors"
            >
              Déconnexion
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
