import { ThreadCard } from "./ThreadCard";
import type { ThreadSummary } from "../types";

interface ThreadListProps {
  threads: ThreadSummary[];
  currentUserId?: number | null;
}

export function ThreadList({ threads, currentUserId }: ThreadListProps) {
  if (threads.length === 0) {
    return (
      <div className="text-center py-16 text-gray-400">
        <p className="text-lg">Aucun thread pour l&apos;instant.</p>
        <p className="text-sm mt-1">Sois le premier à lancer une discussion !</p>
      </div>
    );
  }

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden divide-y divide-gray-200 bg-white">
      {threads.map((thread) => (
        <ThreadCard key={thread.threadId} thread={thread} currentUserId={currentUserId} />
      ))}
    </div>
  );
}
