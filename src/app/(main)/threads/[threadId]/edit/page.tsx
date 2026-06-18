import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { getThread } from "@/modules/threads/server/thread.service";
import { listTags } from "@/modules/tags/server/tag.service";
import { getSessionUserId } from "@/lib/auth/session";
import { ThreadEditForm } from "@/modules/threads/components/ThreadEditForm";

export default async function EditThreadPage({
  params,
}: {
  params: Promise<{ threadId: string }>;
}) {
  const { threadId: rawId } = await params;
  const threadId = parseInt(rawId);

  if (isNaN(threadId)) notFound();

  const userId = await getSessionUserId();
  if (!userId) redirect("/auth/signin");

  const [thread, tags] = await Promise.all([
    getThread(threadId, userId),
    listTags(),
  ]);

  if (!thread) notFound();
  if (thread.authorId !== userId) notFound();

  return (
    <div className="max-w-3xl mx-auto">
      <Link
        href={`/threads/${threadId}`}
        className="text-sm text-gray-500 hover:text-indigo-600 transition-colors"
      >
        ← Retour au thread
      </Link>

      <div className="bg-white border border-gray-200 rounded-xl p-6 mt-4">
        <h1 className="text-xl font-bold text-gray-900 mb-6">Modifier le thread</h1>
        <ThreadEditForm
          threadId={thread.threadId}
          initialTitle={thread.title}
          initialContent={thread.content}
          initialTags={thread.tags.map(({ tag }) => tag.name)}
          availableTags={tags}
        />
      </div>
    </div>
  );
}
