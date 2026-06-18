export interface ThreadAuthor {
  userId: number;
  firstName: string | null;
  lastName: string | null;
  emailId: string;
}

export interface TagRef {
  tag: { tagId: number; name: string; slug: string };
}

export interface ThreadSummary {
  threadId: number;
  title: string;
  content: string;
  authorId: number;
  author: ThreadAuthor;
  tags: TagRef[];
  voteScore: number;
  commentCount: number;
  userVote: "UP" | "DOWN" | null;
  isBookmarked: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ThreadDetail extends ThreadSummary {
  comments: import("@/modules/comments/types").CommentSummary[];
}
