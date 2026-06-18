import { notFound } from "next/navigation";
import Link from "next/link";
import { getThread } from "@/modules/threads/server/thread.service";
import { getSessionUserId } from "@/lib/auth/session";
import { VoteButtons } from "@/modules/votes/components/VoteButtons";
import { CommentList } from "@/modules/comments/components/CommentList";
import { DeleteThreadButton } from "@/modules/threads/components/DeleteThreadButton";
import { BookmarkButton } from "@/modules/bookmarks/components/BookmarkButton";


function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("fr", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
}

function authorName(
  author: { firstName: string | null; lastName: string | null; emailId: string }
): string {
  const name = [author.firstName, author.lastName].filter(Boolean).join(" ");
  return name || author.emailId.split("@")[0];
}

export default async function ThreadPage({
  params,
}: {
  params: Promise<{ threadId: string }>;
}) {
  const { threadId: rawId } = await params;
  const threadId = parseInt(rawId);

  if (isNaN(threadId)) notFound();

  const userId = await getSessionUserId();
  const thread = await getThread(threadId, userId);

  if (!thread) notFound();

  const isOwner = userId != null && userId === thread.authorId;

  return (
    <div className="max-w-3xl mx-auto">
      <Link
        href="/threads"
        className="text-sm text-gray-500 hover:text-indigo-600 transition-colors"
      >
        ← Retour au forum
      </Link>

      <article className="bg-white border border-gray-200 rounded-xl p-6 mt-4">
        <div className="flex gap-4">
          <div className="flex flex-col items-center pt-1">
            <VoteButtons
              targetId={thread.threadId}
              targetType="thread"
              initialScore={thread.voteScore}
              initialVote={thread.userVote}
            />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-4">
              <h1 className="text-2xl font-bold text-gray-900 leading-snug">
                {thread.title}
              </h1>

              <div className="flex items-center gap-2 flex-shrink-0 mt-1">
                {userId != null && (
                  <BookmarkButton
                    threadId={thread.threadId}
                    initialBookmarked={thread.isBookmarked}
                  />
                )}
                {isOwner && (
                  <Link
                    href={`/threads/${thread.threadId}/edit`}
                    className="text-xs text-indigo-500 hover:text-indigo-700 transition-colors"
                  >
                    Modifier
                  </Link>
                )}
                {isOwner && (
                  <DeleteThreadButton threadId={thread.threadId} />
                )}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 mt-2 text-xs text-gray-400">
              <span>par{" "}
                <Link href={`/profile/${thread.author.userId}`} className="hover:text-indigo-600 transition-colors">
                  {authorName(thread.author)}
                </Link>
              </span>
              <span>·</span>
              <span>{formatDate(thread.createdAt)}</span>
            </div>

            {thread.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {thread.tags.map(({ tag }) => (
                  <Link
                    key={tag.tagId}
                    href={`/threads?tag=${tag.slug}`}
                    className="inline-block px-2 py-0.5 bg-indigo-50 text-indigo-700 text-xs font-medium rounded-full hover:bg-indigo-100 transition-colors"
                  >
                    {tag.name}
                  </Link>
                ))}
              </div>
            )}

            <div className="mt-5 text-sm text-gray-800 leading-relaxed whitespace-pre-wrap break-words">
              {thread.content}
            </div>
          </div>
        </div>
      </article>

      <div className="bg-white border border-gray-200 rounded-xl p-6 mt-4">
        <CommentList
          comments={thread.comments}
          threadId={thread.threadId}
          currentUserId={userId}
          threadAuthorId={thread.authorId}
        />
      </div>
    </div>
  );
}
