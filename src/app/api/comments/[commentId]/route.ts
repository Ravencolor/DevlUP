import { NextRequest, NextResponse } from "next/server";
import { getSessionUserId } from "@/lib/auth/session";
import { editComment, deleteComment } from "@/modules/comments/server/comment.service";
import { updateCommentSchema } from "@/modules/comments/schemas/comment.schema";
import { toApiError, UnauthorizedError } from "@/lib/utils/errors";
import { prisma } from "@/db/client";
import { Role } from "@prisma/client";

async function getUserRole(userId: number): Promise<Role> {
  const user = await prisma.user.findUnique({
    where: { userId },
    select: { role: true },
  });
  return user?.role ?? Role.USER;
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ commentId: string }> }
) {
  try {
    const { commentId: rawId } = await params;
    const commentId = parseInt(rawId);
    const userId = await getSessionUserId();
    if (!userId) throw new UnauthorizedError();

    const body = await req.json();
    const parsed = updateCommentSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0].message },
        { status: 400 }
      );
    }

    const role = await getUserRole(userId);
    const comment = await editComment(commentId, userId, role, parsed.data.content);
    return NextResponse.json({ comment });
  } catch (error) {
    const { message, status } = toApiError(error);
    return NextResponse.json({ error: message }, { status });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ commentId: string }> }
) {
  try {
    const { commentId: rawId } = await params;
    const commentId = parseInt(rawId);
    const userId = await getSessionUserId();
    if (!userId) throw new UnauthorizedError();

    const role = await getUserRole(userId);
    await deleteComment(commentId, userId, role);
    return NextResponse.json({ success: true });
  } catch (error) {
    const { message, status } = toApiError(error);
    return NextResponse.json({ error: message }, { status });
  }
}
