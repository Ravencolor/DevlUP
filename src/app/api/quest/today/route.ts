import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const today = new Date().toISOString().split("T")[0];

  const quest = await prisma.quest.findUnique({
    where: { date: today },
  });

  if (!quest) {
    return NextResponse.json({ quest: null, attempt: null });
  }

  const user = await prisma.user.findUnique({
    where: { emailId: session.user.email },
  });

  const attempt = user
    ? await prisma.userQuestAttempt.findUnique({
        where: { userId_questId: { userId: user.userId, questId: quest.id } },
      })
    : null;

  return NextResponse.json({
    quest: {
      id: quest.id,
      date: quest.date,
      question: quest.question,
      options: quest.options,
      pointsReward: quest.pointsReward,
    },
    attempt: attempt
      ? {
          selectedAnswer: attempt.selectedAnswer,
          isCorrect: attempt.isCorrect,
          correctAnswer: quest.correctAnswer,
        }
      : null,
  });
}
