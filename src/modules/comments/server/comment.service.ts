import {
  createComment,
  updateComment,
  softDeleteComment,
  findCommentById,
  markBestAnswer,
  unmarkBestAnswer,
} from "./comment.repository";
import { findThreadAuthorId } from "@/modules/threads/server/thread.repository";
import { canEditComment, canDeleteComment } from "./comment.permissions";
import { ForbiddenError, NotFoundError } from "@/lib/utils/errors";
import type { CommentSummary } from "../types";
import type { Role } from "@prisma/client";

type RawComment = NonNullable<Awaited<ReturnType<typeof findCommentById>>>;

function mapComment(
  raw: RawComment,
  userId: number | null
): CommentSummary {
  const voteScore = raw.votes.reduce(
    (acc, v) => acc + (v.type === "UP" ? 1 : -1),
    0
  );
  const vote = userId ? raw.votes.find((v) => v.userId === userId) : undefined;

  return {
    commentId: raw.commentId,
    content: raw.content,
    authorId: raw.authorId,
    threadId: raw.threadId,
    author: raw.author,
    voteScore,
    userVote: (vote?.type as "UP" | "DOWN") ?? null,
    isDeleted: raw.isDeleted,
    isBestAnswer: raw.isBestAnswer,
    createdAt: raw.createdAt,
    updatedAt: raw.updatedAt,
  };
}

export async function addComment(
  userId: number,
  data: { content: string; threadId: number }
): Promise<CommentSummary> {
  const raw = await createComment({ ...data, authorId: userId });
  return mapComment(raw, userId);
}

export async function editComment(
  commentId: number,
  userId: number,
  role: Role,
  content: string
): Promise<CommentSummary> {
  const existing = await findCommentById(commentId);
  if (!existing) throw new NotFoundError("Comment");
  if (!canEditComment(userId, existing.authorId, role)) throw new ForbiddenError();

  const raw = await updateComment(commentId, content);
  return mapComment(raw, userId);
}

export async function deleteComment(
  commentId: number,
  userId: number,
  role: Role
): Promise<void> {
  const existing = await findCommentById(commentId);
  if (!existing) throw new NotFoundError("Comment");
  if (!canDeleteComment(userId, existing.authorId, role)) throw new ForbiddenError();

  await softDeleteComment(commentId);
}

export async function toggleBestAnswer(
  commentId: number,
  userId: number
): Promise<{ isBestAnswer: boolean }> {
  const comment = await findCommentById(commentId);
  if (!comment) throw new NotFoundError("Comment");

  const threadAuthorId = await findThreadAuthorId(comment.threadId);
  if (threadAuthorId === null) throw new NotFoundError("Thread");
  if (threadAuthorId !== userId) throw new ForbiddenError();

  if (comment.isBestAnswer) {
    await unmarkBestAnswer(commentId);
    return { isBestAnswer: false };
  } else {
    await markBestAnswer(comment.threadId, commentId);
    return { isBestAnswer: true };
  }
}
