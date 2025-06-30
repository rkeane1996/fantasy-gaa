import { Status } from "../../../db/mongodb/types/position.type";

export class UpdatePlayerStatusDto {
    playerId: string;
    status: Status | string;
  }