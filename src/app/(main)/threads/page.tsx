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
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">💬 Toutes les questions</h1>
          <p className="text-sm text-gray-500 mt-1">{total} thread{total !== 1 ? "s" : ""}</p>
        </div>
        <Link href="/threads/new" className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-primary-600 rounded-xl hover:bg-primary-700 transition-all shadow-sm">
          + Nouveau thread
        </Link>
      </div>

      {tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-6 pb-4 border-b border-border">
          <Link
            href="/threads"
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              !tagSlug
                ? "bg-primary-600 text-white shadow-sm"
                : "bg-surface border border-border text-gray-600 hover:border-primary-300"
            }`}
          >
            Tous
          </Link>
          {tags.map((tag) => (
            <Link
              key={tag.tagId}
              href={`/threads?tag=${tag.slug}`}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                tagSlug === tag.slug
                  ? "bg-primary-600 text-white shadow-sm"
                  : "bg-surface border border-border text-gray-600 hover:border-primary-300"
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
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 rounded-xl hover:bg-gray-100 transition-all"
            >
              ← Précédent
            </Link>
          )}
          <span className="px-4 py-2 text-sm text-gray-500">
            Page {page} / {pages}
          </span>
          {page < pages && (
            <Link
              href={`/threads?page=${page + 1}${tagSlug ? `&tag=${tagSlug}` : ""}`}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 rounded-xl hover:bg-gray-100 transition-all"
            >
              Suivant →
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
