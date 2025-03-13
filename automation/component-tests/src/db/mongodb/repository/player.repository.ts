import { Model } from "mongoose";
import { TeamDocument } from "../schemas/team.schema";
import { MongoBaseRepository } from "./base.repository";
import { IPlayer } from "../types/player.type";
import { PlayerDocument } from "../schemas/player.schema";


export class PlayerRepository extends MongoBaseRepository<PlayerDocument,IPlayer> {

    constructor(readonly model: Model<PlayerDocument>){
        super(model);
    }

    async createPlayers(players: IPlayer[]){
            const createdPlayers =[]
            for (const player of players) {
                createdPlayers.push(await this.create(player)); 
            }
            return createdPlayers;
    }


}