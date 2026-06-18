import { prisma } from "@/db/client";

export async function findUserById(userId: number) {
  return prisma.user.findUnique({
    where: { userId },
    select: {
      userId: true,
      firstName: true,
      lastName: true,
      emailId: true,
      contactNumber: true,
      role: true,
      createdAt: true,
    },
  });
}

export async function updateUser(
  userId: number,
  data: { firstName?: string; lastName?: string; contactNumber?: string }
) {
  return prisma.user.update({
    where: { userId },
    data,
    select: {
      userId: true,
      firstName: true,
      lastName: true,
      emailId: true,
      contactNumber: true,
      role: true,
      createdAt: true,
    },
  });
}

export async function getUserStats(userId: number) {
  const [threadCount, commentCount, upvotesOnThreads, upvotesOnComments] =
    await prisma.$transaction([
      prisma.thread.count({ where: { authorId: userId, isDeleted: false } }),
      prisma.comment.count({ where: { authorId: userId, isDeleted: false } }),
      prisma.threadVote.count({
        where: { thread: { authorId: userId }, type: "UP" },
      }),
      prisma.commentVote.count({
        where: { comment: { authorId: userId }, type: "UP" },
      }),
    ]);

  return {
    threadCount,
    commentCount,
    upvotesReceived: upvotesOnThreads + upvotesOnComments,
  };
}

export async function getUserThreads(userId: number) {
  return prisma.thread.findMany({
    where: { authorId: userId, isDeleted: false },
    orderBy: { createdAt: "desc" },
    take: 10,
    select: {
      threadId: true,
      title: true,
      createdAt: true,
      _count: { select: { comments: { where: { isDeleted: false } } } },
      tags: { select: { tag: { select: { tagId: true, name: true, slug: true } } } },
    },
  });
}
