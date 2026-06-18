export interface CommentAuthor {
  userId: number;
  firstName: string | null;
  lastName: string | null;
}

export interface CommentSummary {
  commentId: number;
  content: string;
  authorId: number;
  threadId: number;
  author: CommentAuthor;
  voteScore: number;
  userVote: "UP" | "DOWN" | null;
  isDeleted: boolean;
  isBestAnswer: boolean;
  createdAt: Date;
  updatedAt: Date;
}
