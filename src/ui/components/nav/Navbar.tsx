import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/options";
import Link from "next/link";

export async function Navbar() {
  const session = await getServerSession(authOptions);
  const user = session?.user;

  const displayName =
    user?.name?.split(" ")[0] ?? user?.email?.split("@")[0] ?? "Compte";

  const navLinks = [
    { href: "/threads", label: "Forum", icon: "💬" },
    { href: "/quest", label: "Quête du jour", icon: "⚡" },
    { href: "/leaderboard", label: "Classement", icon: "🏆" },
    { href: "/apiHub", label: "API Hub", icon: "🔌" },
  ];

  return (
    <nav className="bg-surface/80 backdrop-blur-lg border-b border-border sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-primary-600 flex items-center justify-center shadow-sm shadow-primary-600/30 group-hover:shadow-md group-hover:shadow-primary-600/40 transition-all">
              <span className="text-white font-black text-sm">D</span>
            </div>
            <span className="font-extrabold text-lg tracking-tight text-gray-900">
              Devl<span className="text-primary-600">UP</span>
            </span>
          </Link>

          {/* Nav links */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-3 py-2 rounded-xl text-sm font-medium text-gray-500 hover:text-primary-700 hover:bg-primary-50 transition-all"
              >
                <span className="mr-1.5">{link.icon}</span>
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {user ? (
            <>
              <Link
                href="/bookmarks"
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 rounded-xl hover:bg-gray-100 transition-all hidden sm:inline-flex"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                </svg>
                Favoris
              </Link>
              <Link
                href="/profile/me"
                className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-gray-100 transition-all"
              >
                <div className="w-7 h-7 rounded-full bg-primary-100 flex items-center justify-center">
                  <span className="text-xs font-bold text-primary-700">
                    {displayName.charAt(0).toUpperCase()}
                  </span>
                </div>
                <span className="text-sm font-medium text-gray-700 hidden sm:block">{displayName}</span>
              </Link>
              <a
                href="/api/auth/signout"
                className="text-xs text-gray-400 hover:text-red-500 transition-colors ml-1"
              >
                Déconnexion
              </a>
            </>
          ) : (
            <Link href="/auth/signin" className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-primary-600 rounded-xl hover:bg-primary-700 transition-all shadow-sm">
              Se connecter
            </Link>
          )}
        </div>
      </div>

      {/* Mobile nav */}
      <div className="md:hidden flex items-center gap-1 px-4 pb-2 overflow-x-auto">
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="px-3 py-1.5 rounded-lg text-xs font-medium text-gray-500 hover:text-primary-700 hover:bg-primary-50 transition-all whitespace-nowrap"
          >
            {link.icon} {link.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
