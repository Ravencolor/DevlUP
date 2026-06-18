import {
  findUserById,
  updateUser,
  getUserStats,
  getUserThreads,
} from "./user.repository";
import { NotFoundError } from "@/lib/utils/errors";

export async function getPublicProfile(userId: number) {
  const [user, stats, threads] = await Promise.all([
    findUserById(userId),
    getUserStats(userId),
    getUserThreads(userId),
  ]);

  if (!user) throw new NotFoundError("Utilisateur");

  return { user, stats, threads };
}

export async function updateProfile(
  userId: number,
  data: { firstName?: string; lastName?: string; contactNumber?: string }
) {
  const user = await updateUser(userId, data);
  return user;
}
