import { prisma } from "@/db/client";

function slugify(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

const THREAD_SELECT = {
  threadId: true,
  title: true,
  content: true,
  authorId: true,
  isDeleted: true,
  createdAt: true,
  updatedAt: true,
  author: {
    select: { userId: true, firstName: true, lastName: true, emailId: true },
  },
  tags: {
    select: {
      tag: {
        select: { tagId: true, name: true, slug: true },
      },
    },
  },
  _count: {
    select: { comments: { where: { isDeleted: false } } },
  },
  votes: {
    select: { userId: true, type: true },
  },
  bookmarks: {
    select: { userId: true },
  },
} as const;

export async function findThreads({
  skip,
  take,
  tagSlug,
}: {
  skip: number;
  take: number;
  tagSlug?: string;
}) {
  const where = {
    isDeleted: false,
    ...(tagSlug ? { tags: { some: { tag: { slug: tagSlug } } } } : {}),
  };

  const [threads, total] = await prisma.$transaction([
    prisma.thread.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take,
      select: THREAD_SELECT,
    }),
    prisma.thread.count({ where }),
  ]);

  return { threads, total };
}

export async function findThreadById(threadId: number) {
  return prisma.thread.findFirst({
    where: { threadId, isDeleted: false },
    select: THREAD_SELECT,
  });
}

export async function createThread(data: {
  title: string;
  content: string;
  authorId: number;
  tagNames: string[];
}) {
  return prisma.thread.create({
    data: {
      title: data.title,
      content: data.content,
      authorId: data.authorId,
      tags: {
        create: data.tagNames.map((name) => {
          const slug = slugify(name);
          return {
            tag: {
              connectOrCreate: {
                where: { slug },
                create: { name: name.trim(), slug },
              },
            },
          };
        }),
      },
    },
    select: THREAD_SELECT,
  });
}

export async function updateThread(
  threadId: number,
  data: { title?: string; content?: string; tagNames?: string[] }
) {
  return prisma.$transaction(async (tx) => {
    if (data.tagNames !== undefined) {
      await tx.threadTag.deleteMany({ where: { threadId } });
    }

    return tx.thread.update({
      where: { threadId },
      data: {
        ...(data.title !== undefined ? { title: data.title } : {}),
        ...(data.content !== undefined ? { content: data.content } : {}),
        ...(data.tagNames !== undefined
          ? {
              tags: {
                create: data.tagNames.map((name) => {
                  const slug = slugify(name);
                  return {
                    tag: {
                      connectOrCreate: {
                        where: { slug },
                        create: { name: name.trim(), slug },
                      },
                    },
                  };
                }),
              },
            }
          : {}),
      },
      select: THREAD_SELECT,
    });
  });
}

export async function softDeleteThread(threadId: number) {
  return prisma.thread.update({
    where: { threadId },
    data: { isDeleted: true },
  });
}

export async function findThreadAuthorId(threadId: number): Promise<number | null> {
  const thread = await prisma.thread.findFirst({
    where: { threadId, isDeleted: false },
    select: { authorId: true },
  });
  return thread?.authorId ?? null;
}
