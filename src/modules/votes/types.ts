export type VoteType = "UP" | "DOWN";

export interface VoteResult {
  voteScore: number;
  userVote: VoteType | null;
}
