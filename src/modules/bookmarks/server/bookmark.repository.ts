import { prisma } from "@/db/client";

export async function findBookmark(userId: number, threadId: number) {
  return prisma.bookmark.findUnique({
    where: { userId_threadId: { userId, threadId } },
  });
}

export async function createBookmark(userId: number, threadId: number) {
  return prisma.bookmark.create({ data: { userId, threadId } });
}

export async function deleteBookmark(userId: number, threadId: number) {
  return prisma.bookmark.delete({
    where: { userId_threadId: { userId, threadId } },
  });
}

export async function findBookmarksByUser(userId: number) {
  return prisma.bookmark.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    select: {
      thread: {
        select: {
          threadId: true,
          title: true,
          content: true,
          authorId: true,
          createdAt: true,
          author: { select: { userId: true, firstName: true, lastName: true, emailId: true } },
          tags: { select: { tag: { select: { tagId: true, name: true, slug: true } } } },
          _count: { select: { comments: { where: { isDeleted: false } } } },
          votes: { select: { userId: true, type: true } },
        },
      },
    },
  });
}
