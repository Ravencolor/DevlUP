"use client";

import { useState } from "react";

interface BookmarkButtonProps {
  threadId: number;
  initialBookmarked: boolean;
}

export function BookmarkButton({ threadId, initialBookmarked }: BookmarkButtonProps) {
  const [isBookmarked, setIsBookmarked] = useState(initialBookmarked);
  const [loading, setLoading] = useState(false);

  async function toggle() {
    setLoading(true);
    const res = await fetch(`/api/threads/${threadId}/bookmark`, { method: "POST" });
    if (res.ok) {
      const data = await res.json();
      setIsBookmarked(data.isBookmarked);
    }
    setLoading(false);
  }

  return (
    <button
      onClick={toggle}
      disabled={loading}
      title={isBookmarked ? "Retirer des favoris" : "Ajouter aux favoris"}
      className={`text-xl leading-none transition-colors disabled:opacity-50 ${
        isBookmarked
          ? "text-yellow-400 hover:text-yellow-500"
          : "text-gray-300 hover:text-yellow-400"
      }`}
    >
      {isBookmarked ? "★" : "☆"}
    </button>
  );
}
