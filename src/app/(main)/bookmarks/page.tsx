import { redirect } from "next/navigation";
import Link from "next/link";
import { getSessionUserId } from "@/lib/auth/session";
import { findBookmarksByUser } from "@/modules/bookmarks/server/bookmark.repository";
import { BookmarkButton } from "@/modules/bookmarks/components/BookmarkButton";

function formatDate(date: Date): string {
  return new Intl.RelativeTimeFormat("fr", { numeric: "auto" }).format(
    Math.round((new Date(date).getTime() - Date.now()) / (1000 * 60 * 60 * 24)),
    "day"
  );
}

function authorName(author: { firstName: string | null; lastName: string | null; emailId: string }): string {
  const name = [author.firstName, author.lastName].filter(Boolean).join(" ");
  return name || author.emailId.split("@")[0];
}

export default async function BookmarksPage() {
  const userId = await getSessionUserId();
  if (!userId) redirect("/auth/signin");

  const bookmarks = await findBookmarksByUser(userId);

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Mes favoris</h1>
        <Link href="/threads" className="text-sm text-gray-500 hover:text-indigo-600 transition-colors">
          ← Retour au forum
        </Link>
      </div>

      {bookmarks.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p className="text-lg">Aucun favori pour l&apos;instant.</p>
          <p className="text-sm mt-1">
            Clique sur l&apos;étoile ☆ d&apos;un thread pour l&apos;ajouter ici.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {bookmarks.map(({ thread }) => {
            const voteScore = thread.votes.reduce(
              (acc, v) => acc + (v.type === "UP" ? 1 : -1),
              0
            );

            return (
              <div
                key={thread.threadId}
                className="bg-white border border-gray-200 rounded-xl p-5 hover:border-indigo-300 transition-colors"
              >
                <div className="flex items-start justify-between gap-3">
                  <Link
                    href={`/threads/${thread.threadId}`}
                    className="text-lg font-semibold text-gray-900 hover:text-indigo-600 transition-colors leading-snug"
                  >
                    {thread.title}
                  </Link>
                  <BookmarkButton threadId={thread.threadId} initialBookmarked={true} />
                </div>

                <p className="mt-1 text-sm text-gray-500 line-clamp-2">{thread.content}</p>

                {thread.tags.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {thread.tags.map(({ tag }) => (
                      <Link
                        key={tag.tagId}
                        href={`/threads?tag=${tag.slug}`}
                        className="px-2 py-0.5 bg-indigo-50 text-indigo-700 text-xs font-medium rounded-full hover:bg-indigo-100 transition-colors"
                      >
                        {tag.name}
                      </Link>
                    ))}
                  </div>
                )}

                <div className="mt-3 flex items-center gap-3 text-xs text-gray-400">
                  <span>par {authorName(thread.author)}</span>
                  <span>·</span>
                  <span>{formatDate(thread.createdAt)}</span>
                  <span>·</span>
                  <span>{voteScore} votes</span>
                  <span>·</span>
                  <span>{thread._count.comments} commentaire{thread._count.comments !== 1 ? "s" : ""}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
