import { HydratedDocument, model, Schema } from "mongoose";
import { County, GAAClub } from "../types/club.type";
import { Position, Status } from "../types/position.type";
import { IPlayer } from "../types/player.type";


const playerSchema = new Schema(
    {
        playerName: String,
        profilePictureUrl: String,
        position: String,
        club: String,
        county: String,
        status: String,
        price: Number,
        totalPoints: Number,
    }
)

export type PlayerDocument = HydratedDocument<IPlayer>

export const PlayerModel = model<PlayerDocument>('Player', playerSchema)
