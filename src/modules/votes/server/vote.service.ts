import {
  upsertThreadVote,
  deleteThreadVote,
  findThreadVote,
  upsertCommentVote,
  deleteCommentVote,
  findCommentVote,
} from "./vote.repository";
import { findThreadById } from "@/modules/threads/server/thread.repository";
import { findCommentById } from "@/modules/comments/server/comment.repository";
import { NotFoundError } from "@/lib/utils/errors";
import type { VoteResult, VoteType } from "../types";
import { VoteType as PrismaVoteType } from "@prisma/client";

function computeScore(
  votes: { type: string }[],
  userId: number,
  newType: VoteType | null
): number {
  return votes.reduce((acc, v) => {
    if (v.type === "UP") return acc + 1;
    if (v.type === "DOWN") return acc - 1;
    return acc;
  }, 0);
}

export async function voteThread(
  userId: number,
  threadId: number,
  type: VoteType
): Promise<VoteResult> {
  const thread = await findThreadById(threadId);
  if (!thread) throw new NotFoundError("Thread");

  const existing = await findThreadVote(userId, threadId);

  if (existing?.type === type) {
    await deleteThreadVote(userId, threadId);
    const score = computeScore(thread.votes.filter((v) => v.userId !== userId), userId, null);
    return { voteScore: score, userVote: null };
  }

  await upsertThreadVote(userId, threadId, type as PrismaVoteType);

  const updatedThread = await findThreadById(threadId);
  const score = updatedThread!.votes.reduce(
    (acc, v) => acc + (v.type === "UP" ? 1 : -1),
    0
  );
  return { voteScore: score, userVote: type };
}

export async function voteComment(
  userId: number,
  commentId: number,
  type: VoteType
): Promise<VoteResult> {
  const comment = await findCommentById(commentId);
  if (!comment) throw new NotFoundError("Comment");

  const existing = await findCommentVote(userId, commentId);

  if (existing?.type === type) {
    await deleteCommentVote(userId, commentId);
    const score = comment.votes
      .filter((v) => v.userId !== userId)
      .reduce((acc, v) => acc + (v.type === "UP" ? 1 : -1), 0);
    return { voteScore: score, userVote: null };
  }

  await upsertCommentVote(userId, commentId, type as PrismaVoteType);

  const updated = await findCommentById(commentId);
  const score = updated!.votes.reduce(
    (acc, v) => acc + (v.type === "UP" ? 1 : -1),
    0
  );
  return { voteScore: score, userVote: type };
}
