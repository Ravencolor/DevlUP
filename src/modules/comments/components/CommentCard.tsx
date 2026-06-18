import Link from "next/link";
import { VoteButtons } from "@/modules/votes/components/VoteButtons";
import { DeleteCommentButton } from "./DeleteCommentButton";
import { BestAnswerButton } from "./BestAnswerButton";
import type { CommentSummary } from "../types";

function formatDate(date: Date): string {
  return new Intl.RelativeTimeFormat("fr", { numeric: "auto" }).format(
    Math.round(
      (new Date(date).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
    ),
    "day"
  );
}

function authorName(author: CommentSummary["author"]): string {
  const name = [author.firstName, author.lastName].filter(Boolean).join(" ");
  return name || `Utilisateur #${author.userId}`;
}

interface CommentCardProps {
  comment: CommentSummary;
  currentUserId?: number | null;
  threadAuthorId?: number | null;
}

export function CommentCard({ comment, currentUserId, threadAuthorId }: CommentCardProps) {
  if (comment.isDeleted) {
    return (
      <div className="flex gap-3 py-4 border-b border-gray-100 last:border-0 opacity-50">
        <div className="w-12" />
        <p className="text-sm italic text-gray-400">
          [Ce commentaire a été supprimé]
        </p>
      </div>
    );
  }

  const isOwner = currentUserId != null && currentUserId === comment.authorId;
  const isThreadAuthor = currentUserId != null && currentUserId === threadAuthorId;

  return (
    <div className={`flex gap-3 py-4 border-b border-gray-100 last:border-0 ${comment.isBestAnswer ? "bg-green-50 -mx-6 px-6 rounded-lg" : ""}`}>
      <div className="pt-0.5">
        <VoteButtons
          targetId={comment.commentId}
          targetType="comment"
          initialScore={comment.voteScore}
          initialVote={comment.userVote}
        />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2 mb-1.5">
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <Link href={`/profile/${comment.author.userId}`} className="font-medium text-gray-600 hover:text-indigo-600 transition-colors">
              {authorName(comment.author)}
            </Link>
            <span>·</span>
            <span>{formatDate(comment.createdAt)}</span>
            {comment.isBestAnswer && (
              <span className="px-1.5 py-0.5 bg-green-100 text-green-700 rounded font-medium">
                ✓ Meilleure réponse
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {isThreadAuthor && (
              <BestAnswerButton
                commentId={comment.commentId}
                initialBestAnswer={comment.isBestAnswer}
              />
            )}
            {isOwner && (
              <DeleteCommentButton commentId={comment.commentId} />
            )}
          </div>
        </div>

        <p className="text-sm text-gray-800 whitespace-pre-wrap break-words">
          {comment.content}
        </p>
      </div>
    </div>
  );
}
