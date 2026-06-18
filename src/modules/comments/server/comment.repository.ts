import { prisma } from "@/db/client";

const COMMENT_SELECT = {
  commentId: true,
  content: true,
  authorId: true,
  threadId: true,
  isDeleted: true,
  isBestAnswer: true,
  createdAt: true,
  updatedAt: true,
  author: {
    select: { userId: true, firstName: true, lastName: true },
  },
  votes: {
    select: { userId: true, type: true },
  },
} as const;

export async function findCommentsByThread(threadId: number) {
  return prisma.comment.findMany({
    where: { threadId },
    orderBy: { createdAt: "asc" },
    select: COMMENT_SELECT,
  });
}

export async function findCommentById(commentId: number) {
  return prisma.comment.findFirst({
    where: { commentId, isDeleted: false },
    select: COMMENT_SELECT,
  });
}

export async function createComment(data: {
  content: string;
  authorId: number;
  threadId: number;
}) {
  return prisma.comment.create({
    data,
    select: COMMENT_SELECT,
  });
}

export async function updateComment(commentId: number, content: string) {
  return prisma.comment.update({
    where: { commentId },
    data: { content },
    select: COMMENT_SELECT,
  });
}

export async function softDeleteComment(commentId: number) {
  return prisma.comment.update({
    where: { commentId },
    data: { isDeleted: true },
  });
}

export async function markBestAnswer(threadId: number, commentId: number) {
  return prisma.$transaction([
    prisma.comment.updateMany({ where: { threadId }, data: { isBestAnswer: false } }),
    prisma.comment.update({ where: { commentId }, data: { isBestAnswer: true } }),
  ]);
}

export async function unmarkBestAnswer(commentId: number) {
  return prisma.comment.update({
    where: { commentId },
    data: { isBestAnswer: false },
  });
}
