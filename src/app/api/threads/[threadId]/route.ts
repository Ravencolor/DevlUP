import { NextRequest, NextResponse } from "next/server";
import { getSessionUserId } from "@/lib/auth/session";
import { getThread, editThread, deleteThread } from "@/modules/threads/server/thread.service";
import { updateThreadSchema } from "@/modules/threads/schemas/thread.schema";
import { toApiError, UnauthorizedError, NotFoundError } from "@/lib/utils/errors";
import { prisma } from "@/db/client";
import { Role } from "@prisma/client";

async function getUserRole(userId: number): Promise<Role> {
  const user = await prisma.user.findUnique({
    where: { userId },
    select: { role: true },
  });
  return user?.role ?? Role.USER;
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ threadId: string }> }
) {
  try {
    const { threadId: rawId } = await params;
    const threadId = parseInt(rawId);
    const userId = await getSessionUserId();

    const thread = await getThread(threadId, userId);
    if (!thread) throw new NotFoundError("Thread");

    return NextResponse.json({ thread });
  } catch (error) {
    const { message, status } = toApiError(error);
    return NextResponse.json({ error: message }, { status });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ threadId: string }> }
) {
  try {
    const { threadId: rawId } = await params;
    const threadId = parseInt(rawId);
    const userId = await getSessionUserId();
    if (!userId) throw new UnauthorizedError();

    const body = await req.json();
    const parsed = updateThreadSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0].message },
        { status: 400 }
      );
    }

    const role = await getUserRole(userId);
    const thread = await editThread(threadId, userId, role, parsed.data);
    return NextResponse.json({ thread });
  } catch (error) {
    const { message, status } = toApiError(error);
    return NextResponse.json({ error: message }, { status });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ threadId: string }> }
) {
  try {
    const { threadId: rawId } = await params;
    const threadId = parseInt(rawId);
    const userId = await getSessionUserId();
    if (!userId) throw new UnauthorizedError();

    const role = await getUserRole(userId);
    await deleteThread(threadId, userId, role);
    return NextResponse.json({ success: true });
  } catch (error) {
    const { message, status } = toApiError(error);
    return NextResponse.json({ error: message }, { status });
  }
}
