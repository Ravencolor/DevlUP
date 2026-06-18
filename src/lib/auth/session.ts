import { getServerSession } from "next-auth";
import { authOptions } from "./options";

export async function getSessionUserId(): Promise<number | null> {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return null;
  const id = parseInt(session.user.id);
  return isNaN(id) ? null : id;
}

export async function requireSessionUserId(): Promise<number> {
  const id = await getSessionUserId();
  if (!id) throw new Error("UNAUTHORIZED");
  return id;
}
