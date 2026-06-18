import { NextRequest, NextResponse } from "next/server";
import { getSessionUserId } from "@/lib/auth/session";
import { addComment } from "@/modules/comments/server/comment.service";
import { createCommentSchema } from "@/modules/comments/schemas/comment.schema";
import { toApiError, UnauthorizedError } from "@/lib/utils/errors";

export async function POST(req: NextRequest) {
  try {
    const userId = await getSessionUserId();
    if (!userId) throw new UnauthorizedError();

    const body = await req.json();
    const parsed = createCommentSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0].message },
        { status: 400 }
      );
    }

    const comment = await addComment(userId, parsed.data);
    return NextResponse.json({ comment }, { status: 201 });
  } catch (error) {
    const { message, status } = toApiError(error);
    return NextResponse.json({ error: message }, { status });
  }
}
