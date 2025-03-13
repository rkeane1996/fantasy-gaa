import { TeamInfo, TeamPlayer } from "./create-team.dto";

export class GetTeamResponse {
  userId: string;
  teamInfo: TeamInfo;
  players: TeamPlayer[];
  budget: number;
  totalPoints: number;
  transfers: TeamTransfer;
}

export class TeamTransfer {
  cost: number;
  limit: number;
  made: number;
  freeTransfers: number;
}