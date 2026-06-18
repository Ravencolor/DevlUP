import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/options";
import Link from "next/link";

export async function ForumSidebar() {
  const session = await getServerSession(authOptions);
  const isLoggedIn = !!session?.user;

  return (
    <aside className="w-44 shrink-0 hidden lg:block">
      <nav className="flex flex-col gap-0.5 text-sm sticky top-20">
        <p className="px-3 py-1.5 text-xs font-semibold text-gray-400 uppercase tracking-wider mt-2 first:mt-0">
          Forum
        </p>
        <Link
          href="/threads"
          className="px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100 hover:text-indigo-600 transition-colors font-medium"
        >
          Accueil
        </Link>
        <Link
          href="/threads/new"
          className="px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100 hover:text-indigo-600 transition-colors"
        >
          + Nouveau thread
        </Link>

        {isLoggedIn && (
          <>
            <p className="px-3 py-1.5 text-xs font-semibold text-gray-400 uppercase tracking-wider mt-3">
              Moi
            </p>
            <Link
              href="/bookmarks"
              className="px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100 hover:text-indigo-600 transition-colors"
            >
              Favoris
            </Link>
            <Link
              href="/profile/me"
              className="px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100 hover:text-indigo-600 transition-colors"
            >
              Mon profil
            </Link>
          </>
        )}
      </nav>
    </aside>
  );
}
