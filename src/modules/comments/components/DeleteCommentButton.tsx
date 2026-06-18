"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface DeleteCommentButtonProps {
  commentId: number;
}

export function DeleteCommentButton({ commentId }: DeleteCommentButtonProps) {
  const router = useRouter();
  const [confirm, setConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    if (!confirm) {
      setConfirm(true);
      return;
    }
    setLoading(true);
    const res = await fetch(`/api/comments/${commentId}`, { method: "DELETE" });
    if (res.ok) {
      router.refresh();
    } else {
      setLoading(false);
      setConfirm(false);
    }
  }

  if (confirm) {
    return (
      <span className="flex items-center gap-1.5">
        <button
          onClick={handleDelete}
          disabled={loading}
          className="text-xs px-2 py-0.5 bg-red-600 text-white rounded transition-colors disabled:opacity-50"
        >
          {loading ? "…" : "Confirmer"}
        </button>
        <button
          onClick={() => setConfirm(false)}
          className="text-xs text-gray-400 hover:text-gray-600"
        >
          Annuler
        </button>
      </span>
    );
  }

  return (
    <button
      onClick={handleDelete}
      className="text-xs text-red-400 hover:text-red-600 transition-colors"
    >
      Supprimer
    </button>
  );
}
