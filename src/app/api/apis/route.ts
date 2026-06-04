import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET - Liste toutes les APIs
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const visibility = searchParams.get("visibility") || "";
    const category = searchParams.get("category") || "";

    const where: Record<string, unknown> = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }

    if (visibility && visibility !== "ALL") {
      where.visibility = visibility;
    }

    if (category && category !== "ALL") {
      where.category = category;
    }

    const apis = await prisma.api.findMany({
      where,
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            emailId: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(apis);
  } catch (error) {
    console.error("Error fetching APIs:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des APIs" },
      { status: 500 }
    );
  }
}

// POST - Créer une nouvelle API
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, description, visibility, category, baseUrl, userId } = body;

    if (!name || !description || !userId) {
      return NextResponse.json(
        { error: "Nom, description et userId sont requis" },
        { status: 400 }
      );
    }

    const api = await prisma.api.create({
      data: {
        name,
        description,
        visibility: visibility || "PUBLIC",
        category: category || "OTHER",
        baseUrl: baseUrl || null,
        userId,
      },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            emailId: true,
          },
        },
      },
    });

    return NextResponse.json(api, { status: 201 });
  } catch (error) {
    console.error("Error creating API:", error);
    return NextResponse.json(
      { error: "Erreur lors de la création de l'API" },
      { status: 500 }
    );
  }
}

