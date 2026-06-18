import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getSessionUserId } from "@/lib/auth/session";
import { voteThread } from "@/modules/votes/server/vote.service";
import { toApiError, UnauthorizedError } from "@/lib/utils/errors";

const voteSchema = z.object({ type: z.enum(["UP", "DOWN"]) });

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ threadId: string }> }
) {
  try {
    const { threadId: rawId } = await params;
    const threadId = parseInt(rawId);
    const userId = await getSessionUserId();
    if (!userId) throw new UnauthorizedError();

    const body = await req.json();
    const parsed = voteSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid vote type" }, { status: 400 });
    }

    const result = await voteThread(userId, threadId, parsed.data.type);
    return NextResponse.json(result);
  } catch (error) {
    const { message, status } = toApiError(error);
    return NextResponse.json({ error: message }, { status });
  }
}
