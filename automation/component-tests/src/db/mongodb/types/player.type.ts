import mongoose, { ObjectId } from "mongoose";
import { GAAClub, County } from "./club.type";
import { Position, Status } from "./position.type";

export interface IPlayer {
    playerName: string,
    profilePictureUrl: string,
    position: Position,
    club: GAAClub,
    county: County,
    status: Status,
    price: number,
    totalPoints: number,
    _id?: mongoose.Types.ObjectId | string;
    dateCreated: Date
}