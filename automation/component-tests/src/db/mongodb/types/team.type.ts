import { County } from "./club.type";

export interface ITeam  {
    userId: string;
    teamInfo: ITeamInfo;
    players: Array<ITeamPlayer>;
    budget: number;
    totalPoints: number;
    transfers: ITeamTransfer;
  }
  

  export interface ITeamInfo {
    teamName: string;
    jerseyColour: string;
    shortsColour: string;
  }

  export interface ITeamPlayer {
    playerId: string;
    position: string;
    county: County;
    price: number;
    isCaptain: boolean;
    isViceCaptain: boolean;
    isSub: boolean;
  }

  export interface ITeamTransfer {
    cost: number;
    limit: number;
    made: number;
    freeTransfers: number;
  }
  