import { Role } from "@prisma/client";

export function canEditComment(
  userId: number,
  authorId: number,
  role: Role
): boolean {
  return userId === authorId || role === Role.MODERATOR || role === Role.ADMIN;
}

export function canDeleteComment(
  userId: number,
  authorId: number,
  role: Role
): boolean {
  return userId === authorId || role === Role.MODERATOR || role === Role.ADMIN;
}
