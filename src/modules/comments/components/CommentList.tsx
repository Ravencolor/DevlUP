import { CommentCard } from "./CommentCard";
import { CommentEditor } from "./CommentEditor";
import type { CommentSummary } from "../types";

interface CommentListProps {
  comments: CommentSummary[];
  threadId: number;
  currentUserId?: number | null;
  threadAuthorId?: number | null;
}

export function CommentList({ comments, threadId, currentUserId, threadAuthorId }: CommentListProps) {
  return (
    <section>
      <h2 className="text-base font-semibold text-gray-700 mb-4">
        {comments.length} commentaire{comments.length !== 1 ? "s" : ""}
      </h2>

      <div className="mb-6">
        <CommentEditor threadId={threadId} />
      </div>

      {comments.length > 0 && (
        <div>
          {comments.map((comment) => (
            <CommentCard
              key={comment.commentId}
              comment={comment}
              currentUserId={currentUserId}
              threadAuthorId={threadAuthorId}
            />
          ))}
        </div>
      )}
    </section>
  );
}
