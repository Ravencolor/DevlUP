import { listTags } from "@/modules/tags/server/tag.service";
import { ThreadEditor } from "@/modules/threads/components/ThreadEditor";
import Link from "next/link";

export default async function NewThreadPage() {
  const tags = await listTags();

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <Link
          href="/threads"
          className="text-sm text-gray-500 hover:text-indigo-600 transition-colors"
        >
          ← Retour au forum
        </Link>
        <h1 className="text-2xl font-bold text-gray-900 mt-2">
          Nouveau thread
        </h1>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <ThreadEditor availableTags={tags} />
      </div>
    </div>
  );
}
