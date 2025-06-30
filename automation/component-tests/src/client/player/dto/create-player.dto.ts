import { County, GAAClub } from "../../../db/mongodb/types/club.type";
import { Position, Status } from "../../../db/mongodb/types/position.type";

export class CreatePlayerRequest {
  playerName: string | number;
  profilePictureUrl: string | null;
  county: County | string;
  club: GAAClub | string;
  position: Position | number;
  price: number | string;
  status: Status| string;
}
