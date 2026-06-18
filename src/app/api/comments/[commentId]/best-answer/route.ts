import { NextResponse } from "next/server";
import { getSessionUserId } from "@/lib/auth/session";
import { toApiError, UnauthorizedError } from "@/lib/utils/errors";
import { toggleBestAnswer } from "@/modules/comments/server/comment.service";

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ commentId: string }> }
) {
  try {
    const userId = await getSessionUserId();
    if (!userId) throw new UnauthorizedError();

    const { commentId: rawId } = await params;
    const commentId = parseInt(rawId);

    const result = await toggleBestAnswer(commentId, userId);
    return NextResponse.json(result);
  } catch (e) {
    const { message, status } = toApiError(e);
    return NextResponse.json({ error: message }, { status });
  }
}
