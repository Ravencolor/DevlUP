import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const top10 = await prisma.user.findMany({
    orderBy: { points: "desc" },
    take: 10,
    select: {
      userId: true,
      firstName: true,
      lastName: true,
      emailId: true,
      points: true,
    },
  });

  const currentUser = await prisma.user.findUnique({
    where: { emailId: session.user.email },
    select: { userId: true, firstName: true, lastName: true, points: true },
  });

  let currentUserRank: number | null = null;
  if (currentUser) {
    const usersAbove = await prisma.user.count({
      where: { points: { gt: currentUser.points } },
    });
    currentUserRank = usersAbove + 1;
  }

  return NextResponse.json({
    top10: top10.map((u, i) => ({
      rank: i + 1,
      firstName: u.firstName,
      lastName: u.lastName,
      emailId: u.emailId,
      points: u.points,
      isCurrentUser: u.emailId === session.user!.email,
    })),
    currentUser: currentUser
      ? {
          rank: currentUserRank,
          firstName: currentUser.firstName,
          lastName: currentUser.lastName,
          points: currentUser.points,
        }
      : null,
  });
}
