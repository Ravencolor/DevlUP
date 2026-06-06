import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const body = await request.json();
  const { questId, selectedAnswer } = body as {
    questId: number;
    selectedAnswer: number;
  };

  if (questId === undefined || selectedAnswer === undefined) {
    return NextResponse.json({ error: "Données manquantes" }, { status: 400 });
  }

  const user = await prisma.user.findUnique({
    where: { emailId: session.user.email },
  });

  if (!user) {
    return NextResponse.json({ error: "Utilisateur introuvable" }, { status: 404 });
  }

  const quest = await prisma.quest.findUnique({ where: { id: questId } });
  if (!quest) {
    return NextResponse.json({ error: "Quête introuvable" }, { status: 404 });
  }

  const existing = await prisma.userQuestAttempt.findUnique({
    where: { userId_questId: { userId: user.userId, questId } },
  });

  if (existing) {
    return NextResponse.json({ error: "Déjà répondu" }, { status: 409 });
  }

  const isCorrect = selectedAnswer === quest.correctAnswer;
  const pointsEarned = isCorrect ? quest.pointsReward : 0;

  await prisma.$transaction([
    prisma.userQuestAttempt.create({
      data: {
        userId: user.userId,
        questId,
        selectedAnswer,
        isCorrect,
      },
    }),
    ...(isCorrect
      ? [
          prisma.user.update({
            where: { userId: user.userId },
            data: { points: { increment: pointsEarned } },
          }),
        ]
      : []),
  ]);

  const updated = await prisma.user.findUnique({
    where: { userId: user.userId },
    select: { points: true },
  });

  return NextResponse.json({
    isCorrect,
    pointsEarned,
    correctAnswer: quest.correctAnswer,
    totalPoints: updated?.points ?? user.points,
  });
}
