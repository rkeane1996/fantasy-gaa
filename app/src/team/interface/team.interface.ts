import { TeamPlayer } from '../dto/team-transfer.dto';

export interface ITeam {
  teamId: string;
  userId: string;
  teamName: string;
  players: TeamPlayer[];
}
