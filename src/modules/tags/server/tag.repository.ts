import { prisma } from "@/db/client";

export async function findAllTags() {
  return prisma.tag.findMany({
    orderBy: { name: "asc" },
    select: { tagId: true, name: true, slug: true },
  });
}

export async function findTagBySlug(slug: string) {
  return prisma.tag.findUnique({ where: { slug } });
}
