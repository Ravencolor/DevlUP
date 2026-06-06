"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";

interface LeaderboardEntry {
  rank: number;
  firstName: string | null;
  lastName: string | null;
  emailId: string;
  points: number;
  isCurrentUser: boolean;
}

interface CurrentUser {
  rank: number | null;
  firstName: string | null;
  lastName: string | null;
  points: number;
}

function displayName(firstName: string | null, lastName: string | null, email: string): string {
  const name = `${firstName ?? ""} ${lastName ?? ""}`.trim();
  return name || email.split("@")[0];
}

function RankBadge({ rank }: { rank: number }) {
  if (rank === 1) return (
    <span className="w-8 h-8 flex items-center justify-center rounded-full bg-yellow-400 text-yellow-900 font-black text-xs">1</span>
  );
  if (rank === 2) return (
    <span className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-200 text-gray-600 font-black text-xs">2</span>
  );
  if (rank === 3) return (
    <span className="w-8 h-8 flex items-center justify-center rounded-full bg-orange-200 text-orange-700 font-black text-xs">3</span>
  );
  return (
    <span className="w-8 h-8 flex items-center justify-center text-gray-400 font-semibold text-sm">{rank}</span>
  );
}

export default function LeaderboardPage() {
  const [top10, setTop10] = useState<LeaderboardEntry[]>([]);
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/leaderboard")
      .then((r) => r.json())
      .then((data) => {
        setTop10(data.top10 ?? []);
        setCurrentUser(data.currentUser ?? null);
      })
      .finally(() => setLoading(false));
  }, []);

  const currentUserInTop10 = top10.some((u) => u.isCurrentUser);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-3xl mx-auto px-6 py-10">
        {/* Page header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-black">Classement</h1>
          <p className="text-gray-500 mt-1">Top 10 des développeurs</p>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-7 h-7 border-2 border-black border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <>
            {/* Top 10 list */}
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
              {top10.length === 0 ? (
                <div className="p-12 text-center text-gray-400">
                  Aucun joueur pour l&apos;instant.
                </div>
              ) : (
                <ul>
                  {top10.map((entry, i) => (
                    <li
                      key={entry.rank}
                      className={`flex items-center gap-4 px-6 py-4 transition-colors ${
                        i < top10.length - 1 ? "border-b border-gray-100" : ""
                      } ${entry.isCurrentUser ? "bg-gray-50" : "hover:bg-gray-50"}`}
                    >
                      <RankBadge rank={entry.rank} />

                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm text-black truncate">
                          {displayName(entry.firstName, entry.lastName, entry.emailId)}
                          {entry.isCurrentUser && (
                            <span className="ml-2 text-xs font-normal text-gray-400">(toi)</span>
                          )}
                        </p>
                      </div>

                      <div className="flex items-baseline gap-1">
                        <span className="text-sm font-bold text-black">{entry.points}</span>
                        <span className="text-xs text-gray-400">pts</span>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Current user outside top 10 */}
            {!currentUserInTop10 && currentUser && (
              <>
                <div className="flex items-center gap-3 my-5">
                  <div className="flex-1 h-px bg-gray-200" />
                  <span className="text-xs text-gray-400 font-medium px-1">Ta position</span>
                  <div className="flex-1 h-px bg-gray-200" />
                </div>

                <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                  <div className="flex items-center gap-4 px-6 py-4">
                    <span className="w-8 h-8 flex items-center justify-center text-gray-500 font-semibold text-sm">
                      {currentUser.rank ?? "—"}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm text-black truncate">
                        {displayName(currentUser.firstName, currentUser.lastName, "")}
                        <span className="ml-2 text-xs font-normal text-gray-400">(toi)</span>
                      </p>
                    </div>
                    <div className="flex items-baseline gap-1">
                      <span className="text-sm font-bold text-black">{currentUser.points}</span>
                      <span className="text-xs text-gray-400">pts</span>
                    </div>
                  </div>
                </div>
              </>
            )}
          </>
        )}
      </main>
    </div>
  );
}
