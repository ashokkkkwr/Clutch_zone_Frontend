export interface Player {
  username: string;
}

export interface Team {
  team_name: string;
}

export interface Match {
  round: number;
  position: number;
  player1?: { username: string } | null;
  player2?: { username: string } | null;
  winner?: { username: string } | null;
  team1?: { team_name: string } | null;
  team2?: { team_name: string } | null;
  winnerTeam?: { team_name: string } | null;
  player1Id: string;
  player2Id: string;
  winnerId: string;
  team1Id: string;
  team2Id: string;
  winnerTeamId: string;
  match_time: string;
}

export interface Bracket {
  leaderboard: any;
  isPointsBased: boolean;
  tournament_name: string;
  isDraft: boolean;
  isTeamTournament?: boolean;
  message?: string;
  matches: Match[];
}

export interface MatchSubmissionData {
  screenshot: File | null;
  kills: number;
  placement: number;
  totalPoints: number;
}

export interface DecodedToken {
  id: string;
}

export interface MatchesByRound {
  [key: number]: Match[];
}