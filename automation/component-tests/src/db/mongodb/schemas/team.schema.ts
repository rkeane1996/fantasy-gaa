import { HydratedDocument, model, Schema } from "mongoose";
import { County } from "../types/club.type";
import { ITeam } from "../types/team.type";

const teamInfoSchema = new Schema(
    {
        teamName: String,
        jerseyColour: String,
        shortsColour: String,
    }
)

const teamTransferSchema = new Schema(
    {
        cost: Number,
        limit: Number,
        made: Number,
        freeTransfers: Number,
    }
)

const teamPlayerSchema = new Schema(
    {
        playerId: String,
        position: String,
        county: String,
        price: Number,
        isCaptain: Boolean,
        isViceCaptain: Boolean,
        isSub: Boolean,
    }
)

const teamSchema = new Schema(
    {
        userId: String,
        teamInfo: teamInfoSchema,
        players: Array<typeof teamPlayerSchema>,
        budget: Number,
        totalPoints: Number,
        transfers: teamTransferSchema,
      }
)

export type TeamDocument = HydratedDocument<ITeam>

export const TeamModel = model<TeamDocument>('Team', teamSchema)


