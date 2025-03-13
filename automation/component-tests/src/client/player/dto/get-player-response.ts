import { County, GAAClub } from "../../../db/mongodb/types/club.type";
import { Position, Status } from "../../../db/mongodb/types/position.type";

export interface FindPlayerResponse {
    totalPoints: number;
    playerName: string;
    profilePictureUrl: string;
    county: County;
    club: GAAClub;
    position: Position;
    price: number;
    status: Status;
    id: string;
    dateCreated: Date;
  }