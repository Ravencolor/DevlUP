import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/options";
import { Navbar } from "@/ui/components/nav/Navbar";
import { prisma } from "@/lib/prisma";

async function getRecentThreads() {
  return prisma.thread.findMany({
    where: { isDeleted: false },
    orderBy: { createdAt: "desc" },
    take: 5,
    include: {
      author: { select: { userId: true, firstName: true, lastName: true, emailId: true } },
      tags: { include: { tag: true } },
      _count: { select: { comments: true } },
    },
  });
}

async function getTodayQuest() {
  const today = new Date().toISOString().split("T")[0];
  return prisma.quest.findUnique({ where: { date: today } });
}

async function getTopUsers() {
  return prisma.user.findMany({
    orderBy: { points: "desc" },
    take: 5,
    select: { userId: true, firstName: true, lastName: true, points: true, emailId: true },
  });
}

async function getStats() {
  const [threads, users, comments] = await Promise.all([
    prisma.thread.count({ where: { isDeleted: false } }),
    prisma.user.count(),
    prisma.comment.count({ where: { isDeleted: false } }),
  ]);
  return { threads, users, comments };
}

function formatRelative(date: Date): string {
  const diff = Math.round((Date.now() - new Date(date).getTime()) / (1000 * 60));
  if (diff < 1) return "à l'instant";
  if (diff < 60) return `il y a ${diff}min`;
  if (diff < 1440) return `il y a ${Math.floor(diff / 60)}h`;
  return `il y a ${Math.floor(diff / 1440)}j`;
}

function authorName(author: { firstName: string | null; lastName: string | null; emailId: string }): string {
  const name = [author.firstName, author.lastName].filter(Boolean).join(" ");
  return name || author.emailId.split("@")[0];
}

export default async function Home() {
  const [session, recentThreads, todayQuest, topUsers, stats] = await Promise.all([
    getServerSession(authOptions),
    getRecentThreads(),
    getTodayQuest(),
    getTopUsers(),
    getStats(),
  ]);

  const isLoggedIn = !!session?.user;

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900 text-white">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-72 h-72 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-primary-300 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-xs font-semibold mb-6">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              {stats.users} développeurs actifs
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight leading-tight">
              La communauté qui fait
              <span className="block text-primary-200">monter en compétences.</span>
            </h1>
            <p className="mt-5 text-lg text-primary-100 leading-relaxed max-w-lg">
              Forum, API Hub, quêtes quotidiennes — tout ce qu&apos;il faut pour progresser en dev, ensemble.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/threads"
                className="inline-flex items-center gap-2 px-6 py-3 text-sm font-bold bg-white text-primary-700 rounded-xl hover:bg-primary-50 transition-all shadow-lg shadow-black/10"
              >
                💬 Explorer le forum
              </Link>
              {!isLoggedIn && (
                <Link
                  href="/auth/signin"
                  className="inline-flex items-center gap-2 px-6 py-3 text-sm font-bold text-white border-2 border-white/30 rounded-xl hover:bg-white/10 transition-all"
                >
                  Rejoindre DevlUP
                </Link>
              )}
            </div>
          </div>

          {/* Stats */}
          <div className="mt-12 grid grid-cols-3 gap-4 max-w-md">
            {[
              { label: "Threads", value: stats.threads },
              { label: "Réponses", value: stats.comments },
              { label: "Membres", value: stats.users },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-2xl sm:text-3xl font-extrabold">{stat.value}</p>
                <p className="text-xs text-primary-200 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Left column — Forum threads */}
          <div className="lg:col-span-2 space-y-6">
            {/* Section header */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold tracking-tight text-gray-900">🔥 Discussions récentes</h2>
                <p className="text-sm text-gray-500 mt-1">Les dernières questions de la communauté</p>
              </div>
              <Link href="/threads" className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-primary-700 bg-primary-50 rounded-xl hover:bg-primary-100 transition-all">
                Voir tout →
              </Link>
            </div>

            {/* Thread list */}
            <div className="space-y-3">
              {recentThreads.length === 0 ? (
                <div className="bg-white rounded-2xl border border-border shadow-sm p-12 text-center">
                  <p className="text-gray-400 text-lg">Aucun thread pour l&apos;instant.</p>
                  <Link href="/threads/new" className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-primary-600 rounded-xl hover:bg-primary-700 transition-all shadow-sm mt-4">
                    Créer le premier thread
                  </Link>
                </div>
              ) : (
                recentThreads.map((thread) => (
                  <Link key={thread.threadId} href={`/threads/${thread.threadId}`} className="block">
                    <div className="bg-white rounded-2xl border border-border shadow-sm hover:shadow-md hover:border-primary-200 transition-all duration-200 p-5 group">
                      <div className="flex items-start gap-4">
                        {/* Comment count */}
                        <div className="flex flex-col items-center gap-0.5 shrink-0 pt-1">
                          <span className="text-lg font-bold text-primary-600">{thread._count.comments}</span>
                          <span className="text-[10px] text-gray-400 uppercase font-semibold">rép.</span>
                        </div>
                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-900 group-hover:text-primary-700 transition-colors line-clamp-1">
                            {thread.title}
                          </h3>
                          <p className="text-sm text-gray-500 mt-1 line-clamp-2 leading-relaxed">
                            {thread.content.replace(/<[^>]*>/g, "").slice(0, 120)}
                          </p>
                          <div className="flex items-center gap-3 mt-3 flex-wrap">
                            {thread.tags.slice(0, 3).map(({ tag }) => (
                              <span key={tag.tagId} className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-semibold bg-primary-50 text-primary-700">
                                {tag.name}
                              </span>
                            ))}
                            <span className="text-xs text-gray-400">
                              par <span className="font-medium text-gray-600">{authorName(thread.author)}</span>
                              {" · "}{formatRelative(thread.createdAt)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))
              )}
            </div>

            {/* CTA nouveau thread */}
            {isLoggedIn && (
              <Link href="/threads/new" className="block">
                <div className="bg-white rounded-2xl border border-border shadow-sm border-dashed border-2 border-primary-200 p-6 text-center hover:bg-primary-50 transition-all group cursor-pointer">
                  <span className="text-2xl">✍️</span>
                  <p className="font-semibold text-primary-700 mt-2 group-hover:text-primary-800">Poser une question</p>
                  <p className="text-xs text-gray-400 mt-1">Partagez vos problèmes, la communauté vous aide !</p>
                </div>
              </Link>
            )}
          </div>

          {/* Right column — Sidebar */}
          <div className="space-y-6">

            {/* Daily Quest Widget */}
            {todayQuest && (
              <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
                <div className="bg-gradient-to-r from-amber-500 to-orange-500 p-4">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">⚡</span>
                    <div>
                      <h3 className="font-bold text-white text-sm">Quête du jour</h3>
                      <p className="text-amber-100 text-xs">{todayQuest.pointsReward} pts à gagner</p>
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <p className="text-sm font-medium text-gray-800 leading-relaxed line-clamp-3">
                    {todayQuest.question}
                  </p>
                  <Link href="/quest" className="mt-3 w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-bold text-amber-700 bg-amber-50 rounded-xl hover:bg-amber-100 transition-all">
                    Répondre maintenant →
                  </Link>
                </div>
              </div>
            )}

            {/* Leaderboard Widget */}
            <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
              <div className="p-4 border-b border-border">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-sm flex items-center gap-2">
                    🏆 Top développeurs
                  </h3>
                  <Link href="/leaderboard" className="text-xs text-primary-600 font-semibold hover:text-primary-800 transition-colors">
                    Voir tout
                  </Link>
                </div>
              </div>
              <ul>
                {topUsers.map((user, i) => (
                  <li key={user.userId} className="flex items-center gap-3 px-4 py-3 border-b border-border last:border-0 hover:bg-gray-50 transition-colors">
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black ${
                      i === 0 ? "bg-amber-400 text-amber-900" :
                      i === 1 ? "bg-gray-200 text-gray-600" :
                      i === 2 ? "bg-orange-200 text-orange-700" :
                      "bg-gray-100 text-gray-400"
                    }`}>
                      {i + 1}
                    </span>
                    <span className="flex-1 text-sm font-medium text-gray-700 truncate">
                      {authorName(user)}
                    </span>
                    <span className="text-xs font-bold text-primary-600">{user.points} pts</span>
                  </li>
                ))}
                {topUsers.length === 0 && (
                  <li className="p-6 text-center text-sm text-gray-400">Aucun joueur pour l&apos;instant</li>
                )}
              </ul>
            </div>

            {/* API Hub promo */}
            <Link href="/apiHub" className="block">
              <div className="bg-white rounded-2xl border border-border shadow-sm hover:shadow-md hover:border-primary-200 transition-all duration-200 p-5 group">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-primary-100 flex items-center justify-center text-xl">🔌</div>
                  <div>
                    <h3 className="font-bold text-sm text-gray-900 group-hover:text-primary-700 transition-colors">API Hub</h3>
                    <p className="text-xs text-gray-400">Explore et partage des APIs</p>
                  </div>
                </div>
                <p className="text-xs text-gray-500 leading-relaxed">
                  Découvre les APIs créées par la communauté, documente les tiennes façon Swagger.
                </p>
              </div>
            </Link>

            {/* Join CTA (if not logged in) */}
            {!isLoggedIn && (
              <div className="bg-white rounded-2xl border border-border shadow-sm bg-gradient-to-br from-primary-50 to-primary-100 border-primary-200 p-6 text-center">
                <span className="text-3xl">🚀</span>
                <h3 className="font-bold text-primary-900 mt-3">Rejoins la communauté</h3>
                <p className="text-xs text-primary-600 mt-1">Pose des questions, gagne des points, monte en compétences.</p>
                <Link href="/auth/signin" className="inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-primary-600 rounded-xl hover:bg-primary-700 transition-all shadow-sm w-full mt-4">
                  Créer un compte
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-border mt-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-primary-600 flex items-center justify-center">
              <span className="text-white font-black text-[10px]">D</span>
            </div>
            <span className="text-sm font-bold text-gray-400">DevlUP</span>
          </div>
          <p className="text-xs text-gray-400">© 2026 DevlUP — Fait avec ❤️ par des développeurs, pour des développeurs.</p>
        </div>
      </footer>
    </div>
  );
}