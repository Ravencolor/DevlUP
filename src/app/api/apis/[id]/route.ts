import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const api = await prisma.api.findUnique({
      where: { id: Number(id) },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            emailId: true,
          },
        },
        endpoints: {
          include: {
            parameters: true,
            responses: true,
          },
          orderBy: { createdAt: "asc" },
        },
      },
    });

    if (!api) {
      return NextResponse.json({ error: "API introuvable" }, { status: 404 });
    }

    return NextResponse.json(api);
  } catch (error) {
    console.error("Error fetching API:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération de l'API" },
      { status: 500 }
    );
  }
}

