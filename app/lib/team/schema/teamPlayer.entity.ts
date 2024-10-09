import { County } from '../../../lib/common/enum/counties';

export class TeamPlayer {
  playerId: string;
  position: string;
  county: County;
  price: number;
  isCaptain: boolean;
  isViceCaptain: boolean;
  isSub: boolean;
}
