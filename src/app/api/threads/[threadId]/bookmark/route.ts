import { NextResponse } from "next/server";
import { getSessionUserId } from "@/lib/auth/session";
import { toApiError, UnauthorizedError } from "@/lib/utils/errors";
import {
  findBookmark,
  createBookmark,
  deleteBookmark,
} from "@/modules/bookmarks/server/bookmark.repository";

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ threadId: string }> }
) {
  try {
    const userId = await getSessionUserId();
    if (!userId) throw new UnauthorizedError();

    const { threadId: rawId } = await params;
    const threadId = parseInt(rawId);

    const existing = await findBookmark(userId, threadId);
    if (existing) {
      await deleteBookmark(userId, threadId);
      return NextResponse.json({ isBookmarked: false });
    } else {
      await createBookmark(userId, threadId);
      return NextResponse.json({ isBookmarked: true });
    }
  } catch (e) {
    const { message, status } = toApiError(e);
    return NextResponse.json({ error: message }, { status });
  }
}
