import {
  findThreads,
  findThreadById,
  createThread,
  updateThread,
  softDeleteThread,
  findThreadAuthorId,
} from "./thread.repository";
import { findCommentsByThread } from "@/modules/comments/server/comment.repository";
import { canEditThread, canDeleteThread } from "./thread.permissions";
import { ForbiddenError, NotFoundError } from "@/lib/utils/errors";
import { toSkip, toPagination, type PageParams } from "@/lib/utils/pagination";
import type { ThreadSummary, ThreadDetail } from "../types";
import type { Role } from "@prisma/client";

type RawThread = Awaited<ReturnType<typeof findThreadById>>;

function toVoteScore(votes: { type: string }[]): number {
  return votes.reduce(
    (acc, v) => acc + (v.type === "UP" ? 1 : -1),
    0
  );
}

function toUserVote(
  votes: { userId: number; type: string }[],
  userId: number | null
): "UP" | "DOWN" | null {
  if (!userId) return null;
  const vote = votes.find((v) => v.userId === userId);
  return (vote?.type as "UP" | "DOWN") ?? null;
}

function mapThread(raw: NonNullable<RawThread>, userId: number | null): ThreadSummary {
  return {
    threadId: raw.threadId,
    title: raw.title,
    content: raw.content,
    authorId: raw.authorId,
    author: raw.author,
    tags: raw.tags,
    voteScore: toVoteScore(raw.votes),
    commentCount: raw._count.comments,
    userVote: toUserVote(raw.votes, userId),
    isBookmarked: userId != null && raw.bookmarks.some((b) => b.userId === userId),
    createdAt: raw.createdAt,
    updatedAt: raw.updatedAt,
  };
}

export async function listThreads(
  params: PageParams & { tagSlug?: string; userId: number | null }
) {
  const { threads, total } = await findThreads({
    skip: toSkip(params),
    take: params.limit,
    tagSlug: params.tagSlug,
  });

  return {
    threads: threads.map((t) => mapThread(t, params.userId)),
    ...toPagination(total, params),
  };
}

export async function getThread(
  threadId: number,
  userId: number | null
): Promise<ThreadDetail | null> {
  const [raw, rawComments] = await Promise.all([
    findThreadById(threadId),
    findCommentsByThread(threadId),
  ]);

  if (!raw) return null;

  const comments = rawComments.map((c) => ({
    commentId: c.commentId,
    content: c.content,
    authorId: c.authorId,
    threadId: c.threadId,
    author: c.author,
    voteScore: toVoteScore(c.votes),
    userVote: toUserVote(c.votes, userId),
    isDeleted: c.isDeleted,
    isBestAnswer: c.isBestAnswer,
    createdAt: c.createdAt,
    updatedAt: c.updatedAt,
  }));

  return { ...mapThread(raw, userId), comments };
}

export async function createThreadForUser(
  userId: number,
  data: { title: string; content: string; tags: string[] }
): Promise<ThreadSummary> {
  const raw = await createThread({
    title: data.title,
    content: data.content,
    authorId: userId,
    tagNames: data.tags,
  });
  return mapThread(raw, userId);
}

export async function editThread(
  threadId: number,
  userId: number,
  role: Role,
  data: { title?: string; content?: string; tags?: string[] }
): Promise<ThreadSummary> {
  const existing = await findThreadById(threadId);
  if (!existing) throw new NotFoundError("Thread");
  if (!canEditThread(userId, existing.authorId, role)) throw new ForbiddenError();

  const raw = await updateThread(threadId, {
    title: data.title,
    content: data.content,
    tagNames: data.tags,
  });
  return mapThread(raw, userId);
}

export async function deleteThread(
  threadId: number,
  userId: number,
  role: Role
): Promise<void> {
  const existing = await findThreadById(threadId);
  if (!existing) throw new NotFoundError("Thread");
  if (!canDeleteThread(userId, existing.authorId, role)) throw new ForbiddenError();

  await softDeleteThread(threadId);
}
