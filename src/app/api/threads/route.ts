import { NextRequest, NextResponse } from "next/server";
import { getSessionUserId } from "@/lib/auth/session";
import { listThreads, createThreadForUser } from "@/modules/threads/server/thread.service";
import { createThreadSchema } from "@/modules/threads/schemas/thread.schema";
import { parsePageParams } from "@/lib/utils/pagination";
import { toApiError, UnauthorizedError } from "@/lib/utils/errors";

export async function GET(req: NextRequest) {
  try {
    const params = req.nextUrl.searchParams;
    const page = parsePageParams(params);
    const tagSlug = params.get("tag") ?? undefined;
    const userId = await getSessionUserId();

    const result = await listThreads({ ...page, tagSlug, userId });
    return NextResponse.json(result);
  } catch (error) {
    const { message, status } = toApiError(error);
    return NextResponse.json({ error: message }, { status });
  }
}

export async function POST(req: NextRequest) {
  try {
    const userId = await getSessionUserId();
    if (!userId) throw new UnauthorizedError();

    const body = await req.json();
    const parsed = createThreadSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0].message },
        { status: 400 }
      );
    }

    const thread = await createThreadForUser(userId, parsed.data);
    return NextResponse.json({ thread }, { status: 201 });
  } catch (error) {
    const { message, status } = toApiError(error);
    return NextResponse.json({ error: message }, { status });
  }
}
