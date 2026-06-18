import { NextRequest, NextResponse } from "next/server";
import { getSessionUserId } from "@/lib/auth/session";
import { toApiError, UnauthorizedError } from "@/lib/utils/errors";
import { updateProfileSchema } from "@/modules/users/schemas/user.schema";
import { updateProfile } from "@/modules/users/server/user.service";

export async function PATCH(req: NextRequest) {
  try {
    const userId = await getSessionUserId();
    if (!userId) throw new UnauthorizedError();

    const body = await req.json();
    const parsed = updateProfileSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0].message },
        { status: 400 }
      );
    }

    const user = await updateProfile(userId, parsed.data);
    return NextResponse.json({ user });
  } catch (e) {
    const { message, status } = toApiError(e);
    return NextResponse.json({ error: message }, { status });
  }
}
