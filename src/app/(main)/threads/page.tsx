import Link from "next/link";
import { listThreads } from "@/modules/threads/server/thread.service";
import { listTags } from "@/modules/tags/server/tag.service";
import { ThreadList } from "@/modules/threads/components/ThreadList";
import { getSessionUserId } from "@/lib/auth/session";

interface SearchParams {
  page?: string;
  tag?: string;
}

export default async function ThreadsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const sp = await searchParams;
  const page = Math.max(1, parseInt(sp.page ?? "1") || 1);
  const tagSlug = sp.tag;

  const userId = await getSessionUserId();

  const [{ threads, total, pages }, tags] = await Promise.all([
    listThreads({ page, limit: 20, tagSlug, userId }),
    listTags(),
  ]);

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Toutes les questions</h1>
          <p className="text-sm text-gray-400 mt-0.5">{total} thread{total !== 1 ? "s" : ""}</p>
        </div>
        <Link
          href="/threads/new"
          className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors"
        >
          + Nouveau thread
        </Link>
      </div>

      {tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-4 pb-4 border-b border-gray-200">
          <Link
            href="/threads"
            className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
              !tagSlug
                ? "bg-indigo-600 text-white"
                : "bg-white border border-gray-200 text-gray-600 hover:border-indigo-300"
            }`}
          >
            Tous
          </Link>
          {tags.map((tag) => (
            <Link
              key={tag.tagId}
              href={`/threads?tag=${tag.slug}`}
              className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                tagSlug === tag.slug
                  ? "bg-indigo-600 text-white"
                  : "bg-white border border-gray-200 text-gray-600 hover:border-indigo-300"
              }`}
            >
              {tag.name}
            </Link>
          ))}
        </div>
      )}

      <ThreadList threads={threads} currentUserId={userId} />

      {pages > 1 && (
        <div className="flex justify-center gap-2 mt-8">
          {page > 1 && (
            <Link
              href={`/threads?page=${page - 1}${tagSlug ? `&tag=${tagSlug}` : ""}`}
              className="px-4 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors"
            >
              ← Précédent
            </Link>
          )}
          <span className="px-4 py-2 text-sm text-gray-500">
            Page {page} / {pages} ({total} threads)
          </span>
          {page < pages && (
            <Link
              href={`/threads?page=${page + 1}${tagSlug ? `&tag=${tagSlug}` : ""}`}
              className="px-4 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors"
            >
              Suivant →
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
