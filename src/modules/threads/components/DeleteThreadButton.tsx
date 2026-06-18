"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface DeleteThreadButtonProps {
  threadId: number;
}

export function DeleteThreadButton({ threadId }: DeleteThreadButtonProps) {
  const router = useRouter();
  const [confirm, setConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    if (!confirm) {
      setConfirm(true);
      return;
    }
    setLoading(true);
    const res = await fetch(`/api/threads/${threadId}`, { method: "DELETE" });
    if (res.ok) {
      router.push("/threads");
      router.refresh();
    } else {
      setLoading(false);
      setConfirm(false);
    }
  }

  return confirm ? (
    <div className="flex items-center gap-2">
      <span className="text-sm text-red-600">Confirmer la suppression ?</span>
      <button
        onClick={handleDelete}
        disabled={loading}
        className="text-sm px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
      >
        {loading ? "Suppression…" : "Oui, supprimer"}
      </button>
      <button
        onClick={() => setConfirm(false)}
        className="text-sm px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
      >
        Annuler
      </button>
    </div>
  ) : (
    <button
      onClick={handleDelete}
      className="text-sm text-red-500 hover:text-red-700 border border-red-200 hover:border-red-400 px-3 py-1 rounded-lg transition-colors"
    >
      Supprimer
    </button>
  );
}
