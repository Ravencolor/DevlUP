"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface BestAnswerButtonProps {
  commentId: number;
  initialBestAnswer: boolean;
}

export function BestAnswerButton({ commentId, initialBestAnswer }: BestAnswerButtonProps) {
  const [isBestAnswer, setIsBestAnswer] = useState(initialBestAnswer);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function toggle() {
    setLoading(true);
    const res = await fetch(`/api/comments/${commentId}/best-answer`, { method: "POST" });
    if (res.ok) {
      const data = await res.json();
      setIsBestAnswer(data.isBestAnswer);
      router.refresh();
    }
    setLoading(false);
  }

  return (
    <button
      onClick={toggle}
      disabled={loading}
      title={isBestAnswer ? "Retirer la meilleure réponse" : "Marquer comme meilleure réponse"}
      className={`text-xs px-2 py-0.5 rounded transition-colors disabled:opacity-50 ${
        isBestAnswer
          ? "bg-green-100 text-green-700 hover:bg-green-200"
          : "border border-gray-200 text-gray-400 hover:border-green-400 hover:text-green-600"
      }`}
    >
      {isBestAnswer ? "✓ Meilleure réponse" : "Marquer comme réponse"}
    </button>
  );
}
