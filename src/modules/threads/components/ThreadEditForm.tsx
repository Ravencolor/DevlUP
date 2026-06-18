"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface ThreadEditFormProps {
  threadId: number;
  initialTitle: string;
  initialContent: string;
  initialTags: string[];
  availableTags: { tagId: number; name: string; slug: string }[];
}

export function ThreadEditForm({
  threadId,
  initialTitle,
  initialContent,
  initialTags,
  availableTags,
}: ThreadEditFormProps) {
  const router = useRouter();
  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState(initialContent);
  const [tagInput, setTagInput] = useState(initialTags.join(", "));
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function parseTags(): string[] {
    return tagInput
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t.length > 0)
      .slice(0, 5);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch(`/api/threads/${threadId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content, tags: parseTags() }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Une erreur est survenue.");
        return;
      }

      router.push(`/threads/${threadId}`);
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      {error && (
        <div className="bg-red-50 text-red-700 border border-red-200 rounded-lg px-4 py-3 text-sm">
          {error}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Titre</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          minLength={5}
          maxLength={200}
          className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Contenu</label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
          minLength={10}
          rows={10}
          className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-y font-mono"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Tags{" "}
          <span className="font-normal text-gray-400">(séparés par des virgules, max 5)</span>
        </label>
        <input
          type="text"
          value={tagInput}
          onChange={(e) => setTagInput(e.target.value)}
          placeholder="ex: TypeScript, React, API"
          className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        />
        {availableTags.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {availableTags.slice(0, 20).map((tag) => (
              <button
                key={tag.tagId}
                type="button"
                onClick={() => {
                  const current = parseTags();
                  if (!current.includes(tag.name) && current.length < 5) {
                    setTagInput([...current, tag.name].join(", "));
                  }
                }}
                className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
              >
                {tag.name}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-5 py-2.5 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Annuler
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-5 py-2.5 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
        >
          {loading ? "Enregistrement…" : "Enregistrer les modifications"}
        </button>
      </div>
    </form>
  );
}
