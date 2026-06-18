import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/options";
import Link from "next/link";

export async function Navbar() {
  const session = await getServerSession(authOptions);
  const user = session?.user;

  const displayName =
    user?.name?.split(" ")[0] ?? user?.email?.split("@")[0] ?? "Compte";

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link
            href="/"
            className="font-bold text-xl text-indigo-600 tracking-tight"
          >
            DevlUP
          </Link>
          <div className="hidden sm:flex items-center gap-5 text-sm">
            <Link
              href="/threads"
              className="text-gray-600 hover:text-indigo-600 font-medium transition-colors"
            >
              Forum
            </Link>
            <Link
              href="/apiHub"
              className="text-gray-600 hover:text-indigo-600 font-medium transition-colors"
            >
              API Hub
            </Link>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {user ? (
            <>
              <div className="hidden sm:flex items-center gap-4 text-sm">
                <Link
                  href="/bookmarks"
                  className="text-gray-600 hover:text-indigo-600 font-medium transition-colors"
                >
                  Favoris
                </Link>
                <Link
                  href="/profile/me"
                  className="text-gray-600 hover:text-indigo-600 font-medium transition-colors"
                >
                  {displayName}
                </Link>
              </div>
              <a
                href="/api/auth/signout"
                className="text-sm text-gray-500 hover:text-red-500 transition-colors"
              >
                Déconnexion
              </a>
            </>
          ) : (
            <Link
              href="/auth/signin"
              className="text-sm font-medium text-white bg-indigo-600 px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Connexion
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
