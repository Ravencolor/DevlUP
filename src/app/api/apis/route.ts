import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/db/client";
import { getSessionUserId } from "@/lib/auth/session";
import { toApiError, UnauthorizedError } from "@/lib/utils/errors";

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
    const { message, status } = toApiError(error);
    return NextResponse.json({ error: message }, { status });
  }
}

// POST - Créer une nouvelle API
export async function POST(request: NextRequest) {
  try {
    const userId = await getSessionUserId();
    if (!userId) throw new UnauthorizedError();

    const body = await request.json();
    const { name, description, visibility, category, baseUrl } = body;

    if (!name || !description) {
      return NextResponse.json(
        { error: "Nom et description sont requis" },
        { status: 400 }
      );
    }

    const api = await prisma.api.create({
      data: {
        name,
        description,
        visibility: visibility || "PUBLIC",
        category: category || "OTHER",
        baseUrl: baseUrl?.trim() ? baseUrl.trim() : null,
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
    const { message, status } = toApiError(error);
    return NextResponse.json({ error: message }, { status });
  }
}
