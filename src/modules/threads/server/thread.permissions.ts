import { Role } from "@prisma/client";

export function canEditThread(
  userId: number,
  authorId: number,
  role: Role
): boolean {
  return userId === authorId || role === Role.MODERATOR || role === Role.ADMIN;
}

export function canDeleteThread(
  userId: number,
  authorId: number,
  role: Role
): boolean {
  return userId === authorId || role === Role.MODERATOR || role === Role.ADMIN;
}
