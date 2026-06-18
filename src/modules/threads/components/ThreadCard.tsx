import Link from "next/link";
import { VoteButtons } from "@/modules/votes/components/VoteButtons";
import { BookmarkButton } from "@/modules/bookmarks/components/BookmarkButton";
import type { ThreadSummary } from "../types";

function formatDate(date: Date): string {
  return new Intl.RelativeTimeFormat("fr", { numeric: "auto" }).format(
    Math.round((new Date(date).getTime() - Date.now()) / (1000 * 60 * 60 * 24)),
    "day"
  );
}

function authorName(author: ThreadSummary["author"]): string {
  const name = [author.firstName, author.lastName].filter(Boolean).join(" ");
  return name || author.emailId.split("@")[0];
}

interface ThreadCardProps {
  thread: ThreadSummary;
  currentUserId?: number | null;
}

export function ThreadCard({ thread, currentUserId }: ThreadCardProps) {
  return (
    <div className="bg-white rounded-2xl border border-border shadow-sm hover:shadow-md hover:border-primary-200 transition-all duration-200 p-5 flex gap-4">
      {/* Stats column */}
      <div className="flex flex-col items-center gap-3 shrink-0 w-16 pt-1">
        <VoteButtons
          targetId={thread.threadId}
          targetType="thread"
          initialScore={thread.voteScore}
          initialVote={thread.userVote}
        />
        <div className="text-center">
          <p className="text-sm font-bold text-primary-600">{thread.commentCount}</p>
          <p className="text-[10px] text-gray-400 uppercase font-semibold">rép.</p>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 flex flex-col gap-1.5">
        {/* Title + bookmark */}
        <div className="flex items-start justify-between gap-2">
          <Link
            href={`/threads/${thread.threadId}`}
            className="text-base font-semibold text-gray-900 hover:text-primary-700 transition-colors leading-snug"
          >
            {thread.title}
          </Link>
          {currentUserId != null && (
            <BookmarkButton
              threadId={thread.threadId}
              initialBookmarked={thread.isBookmarked}
            />
          )}
        </div>

        {/* Snippet */}
        <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed">
          {thread.content}
        </p>

        {/* Bottom row */}
        <div className="flex items-center justify-between gap-2 mt-2 flex-wrap">
          <div className="flex flex-wrap gap-1">
            {thread.tags.map(({ tag }) => (
              <Link
                key={tag.tagId}
                href={`/threads?tag=${tag.slug}`}
                className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-semibold bg-primary-50 text-primary-700"
              >
                {tag.name}
              </Link>
            ))}
          </div>

          <div className="text-xs text-gray-400 shrink-0">
            <Link href={`/profile/${thread.author.userId}`} className="text-primary-600 hover:underline font-medium">
              {authorName(thread.author)}
            </Link>
            <span className="ml-1">{formatDate(thread.createdAt)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
