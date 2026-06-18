import { NextResponse } from "next/server";
import { listTags } from "@/modules/tags/server/tag.service";
import { toApiError } from "@/lib/utils/errors";

export async function GET() {
  try {
    const tags = await listTags();
    return NextResponse.json({ tags });
  } catch (error) {
    const { message, status } = toApiError(error);
    return NextResponse.json({ error: message }, { status });
  }
}
