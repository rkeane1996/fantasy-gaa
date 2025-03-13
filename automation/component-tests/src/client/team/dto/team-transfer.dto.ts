import { TeamPlayer } from './create-team.dto';

export class TeamTransferRequest {
  teamId: string;
  playersToAdd: TeamPlayer[];
  playersToReplace: TeamPlayer[];
}
