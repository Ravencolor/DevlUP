"use client";

import { useEffect, useState } from "react";

interface Quest {
  id: number;
  date: string;
  question: string;
  options: string[];
  pointsReward: number;
}

interface Attempt {
  selectedAnswer: number;
  isCorrect: boolean;
  correctAnswer: number;
}

interface QuestResult {
  isCorrect: boolean;
  pointsEarned: number;
  correctAnswer: number;
  totalPoints: number;
}

const LABELS = ["A", "B", "C", "D"];

export default function QuestPage() {
  const [quest, setQuest] = useState<Quest | null>(null);
  const [attempt, setAttempt] = useState<Attempt | null>(null);
  const [selected, setSelected] = useState<number | null>(null);
  const [result, setResult] = useState<QuestResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetch("/api/quest/today")
      .then((r) => r.json())
      .then((data) => {
        setQuest(data.quest);
        setAttempt(data.attempt);
      })
      .finally(() => setLoading(false));
  }, []);

  async function handleSubmit() {
    if (selected === null || !quest) return;
    setSubmitting(true);
    const res = await fetch("/api/quest/answer", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ questId: quest.id, selectedAnswer: selected }),
    });
    const data = await res.json();
    setResult(data);
    setSubmitting(false);
  }

  function getOptionClass(index: number): string {
    const base =
      "w-full text-left px-4 py-3.5 rounded-xl border transition-all duration-100 text-sm font-medium";

    const answered = attempt ?? result;
    if (!answered) {
      return selected === index
        ? `${base} border-black bg-black text-white`
        : `${base} border-gray-200 bg-white text-gray-700 hover:border-gray-400 cursor-pointer`;
    }

    const correct = attempt?.correctAnswer ?? result?.correctAnswer ?? -1;
    const chosen = attempt?.selectedAnswer ?? selected;

    if (index === correct) return `${base} border-green-500 bg-green-50 text-green-800`;
    if (index === chosen) return `${base} border-red-400 bg-red-50 text-red-700`;
    return `${base} border-gray-100 bg-white text-gray-300`;
  }

  const today = new Date().toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  const answered = attempt ?? result;
  const isCorrect = result?.isCorrect ?? attempt?.isCorrect;

  return (
      <main className="max-w-3xl mx-auto px-6 py-10">
        {/* Page header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">⚡ Quête du jour</h1>
          <p className="text-sm text-gray-500 mt-1 capitalize">{today}</p>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-7 h-7 border-2 border-black border-t-transparent rounded-full animate-spin" />
          </div>
        ) : !quest ? (
          <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
            <p className="text-gray-500 text-lg font-medium">Pas de quête disponible aujourd&apos;hui.</p>
            <p className="text-gray-400 text-sm mt-2">Reviens demain !</p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Points badge */}
            <div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-xs font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                {quest.pointsReward} pts à gagner
              </span>
            </div>

            {/* Question card */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <p className="text-base font-semibold text-black leading-relaxed mb-6">
                {quest.question}
              </p>

              <div className="space-y-2.5">
                {(quest.options as string[]).map((option, i) => (
                  <button
                    key={i}
                    className={getOptionClass(i)}
                    onClick={() => { if (!attempt && !result) setSelected(i); }}
                    disabled={!!attempt || !!result}
                  >
                    <span className="inline-flex items-center gap-3">
                      <span
                        className={`w-5 h-5 rounded-full text-xs font-bold flex items-center justify-center shrink-0 ${
                          selected === i && !answered
                            ? "bg-white text-black"
                            : "bg-gray-100 text-gray-500"
                        }`}
                      >
                        {LABELS[i]}
                      </span>
                      {option}
                    </span>
                  </button>
                ))}
              </div>

              {!attempt && !result && (
                <button
                  onClick={handleSubmit}
                  disabled={selected === null || submitting}
                  className="mt-5 w-full py-3 rounded-xl bg-black text-white text-sm font-semibold hover:bg-gray-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  {submitting ? "Validation..." : "Valider ma réponse"}
                </button>
              )}
            </div>

            {/* Result */}
            {answered && (
              <div className={`rounded-2xl border p-5 flex items-start gap-4 ${isCorrect ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"}`}>
                <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${isCorrect ? "bg-green-100" : "bg-red-100"}`}>
                  {isCorrect ? (
                    <svg className="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  )}
                </div>
                <div>
                  <p className={`font-semibold text-sm ${isCorrect ? "text-green-800" : "text-red-700"}`}>
                    {isCorrect ? "Bonne réponse !" : "Mauvaise réponse"}
                  </p>
                  <p className="text-sm text-gray-600 mt-0.5">
                    {result?.isCorrect
                      ? `+${result.pointsEarned} points — Total : ${result.totalPoints} pts`
                      : attempt?.isCorrect
                      ? "Tu avais déjà répondu correctement."
                      : `La bonne réponse était : ${LABELS[(result?.correctAnswer ?? attempt?.correctAnswer) as number]}`}
                  </p>
                  <p className="text-xs text-gray-400 mt-2">La prochaine quête arrive demain.</p>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
  );
}
