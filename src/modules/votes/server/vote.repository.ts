import { prisma } from "@/db/client";
import { VoteType } from "@prisma/client";

export async function upsertThreadVote(
  userId: number,
  threadId: number,
  type: VoteType
) {
  return prisma.threadVote.upsert({
    where: { userId_threadId: { userId, threadId } },
    update: { type },
    create: { userId, threadId, type },
  });
}

export async function deleteThreadVote(userId: number, threadId: number) {
  return prisma.threadVote.delete({
    where: { userId_threadId: { userId, threadId } },
  });
}

export async function findThreadVote(userId: number, threadId: number) {
  return prisma.threadVote.findUnique({
    where: { userId_threadId: { userId, threadId } },
  });
}

export async function upsertCommentVote(
  userId: number,
  commentId: number,
  type: VoteType
) {
  return prisma.commentVote.upsert({
    where: { userId_commentId: { userId, commentId } },
    update: { type },
    create: { userId, commentId, type },
  });
}

export async function deleteCommentVote(userId: number, commentId: number) {
  return prisma.commentVote.delete({
    where: { userId_commentId: { userId, commentId } },
  });
}

export async function findCommentVote(userId: number, commentId: number) {
  return prisma.commentVote.findUnique({
    where: { userId_commentId: { userId, commentId } },
  });
}
