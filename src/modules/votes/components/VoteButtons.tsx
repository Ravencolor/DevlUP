"use client";

import { useState } from "react";
import type { VoteType } from "../types";

interface VoteButtonsProps {
  targetId: number;
  targetType: "thread" | "comment";
  initialScore: number;
  initialVote: VoteType | null;
}

export function VoteButtons({
  targetId,
  targetType,
  initialScore,
  initialVote,
}: VoteButtonsProps) {
  const [score, setScore] = useState(initialScore);
  const [userVote, setUserVote] = useState<VoteType | null>(initialVote);
  const [loading, setLoading] = useState(false);

  async function handleVote(type: VoteType) {
    if (loading) return;
    setLoading(true);

    const url =
      targetType === "thread"
        ? `/api/threads/${targetId}/vote`
        : `/api/comments/${targetId}/vote`;

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type }),
      });

      if (res.ok) {
        const data = await res.json();
        setScore(data.voteScore);
        setUserVote(data.userVote);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex items-center gap-1">
      <button
        onClick={() => handleVote("UP")}
        disabled={loading}
        className={`p-1 rounded transition-colors ${
          userVote === "UP"
            ? "text-orange-500"
            : "text-gray-400 hover:text-orange-500"
        }`}
        aria-label="Upvote"
      >
        ▲
      </button>
      <span className="text-sm font-semibold w-6 text-center">{score}</span>
      <button
        onClick={() => handleVote("DOWN")}
        disabled={loading}
        className={`p-1 rounded transition-colors ${
          userVote === "DOWN"
            ? "text-blue-500"
            : "text-gray-400 hover:text-blue-500"
        }`}
        aria-label="Downvote"
      >
        ▼
      </button>
    </div>
  );
}
