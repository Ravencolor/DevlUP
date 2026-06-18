import { notFound } from "next/navigation";
import Link from "next/link";
import { getPublicProfile } from "@/modules/users/server/user.service";

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("fr", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(date));
}

export default async function UserProfilePage({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const { userId: rawId } = await params;
  const userId = parseInt(rawId);

  if (isNaN(userId)) notFound();

  let profile;
  try {
    profile = await getPublicProfile(userId);
  } catch {
    notFound();
  }

  const { user, stats, threads } = profile;
  const displayName =
    [user.firstName, user.lastName].filter(Boolean).join(" ") ||
    user.emailId.split("@")[0];

  return (
    <div className="max-w-3xl mx-auto flex flex-col gap-6">
      <Link href="/threads" className="text-sm text-gray-500 hover:text-indigo-600 transition-colors self-start">
        ← Retour au forum
      </Link>
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{displayName}</h1>
            <p className="text-xs text-gray-400 mt-1">Membre depuis {formatDate(user.createdAt)}</p>
          </div>
          <span className="px-2 py-1 text-xs font-medium bg-indigo-50 text-indigo-700 rounded-full">
            {user.role}
          </span>
        </div>

        <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-100">
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">{stats.threadCount}</p>
            <p className="text-xs text-gray-500 mt-0.5">Threads</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">{stats.commentCount}</p>
            <p className="text-xs text-gray-500 mt-0.5">Commentaires</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">{stats.upvotesReceived}</p>
            <p className="text-xs text-gray-500 mt-0.5">Upvotes reçus</p>
          </div>
        </div>
      </div>

      {threads.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h2 className="text-base font-semibold text-gray-700 mb-4">
            Threads de {displayName}
          </h2>
          <div className="flex flex-col gap-2">
            {threads.map((t) => (
              <Link
                key={t.threadId}
                href={`/threads/${t.threadId}`}
                className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0 hover:text-indigo-600 transition-colors group"
              >
                <div className="flex-1 min-w-0">
                  <span className="text-sm font-medium text-gray-800 group-hover:text-indigo-600">
                    {t.title}
                  </span>
                  {t.tags.length > 0 && (
                    <div className="flex gap-1 mt-0.5">
                      {t.tags.map(({ tag }) => (
                        <span
                          key={tag.tagId}
                          className="px-1.5 py-0.5 bg-indigo-50 text-indigo-600 text-xs rounded-full"
                        >
                          {tag.name}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <span className="text-xs text-gray-400 shrink-0 ml-4">
                  {t._count.comments} rép.
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
