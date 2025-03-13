import { Model } from "mongoose";
import { TeamDocument } from "../schemas/team.schema";
import { ITeam } from "../types/team.type";
import { MongoBaseRepository } from "./base.repository";

export class TeamRepository extends MongoBaseRepository<TeamDocument,ITeam> {

    constructor(readonly model: Model<TeamDocument>){
        super(model);
    }

    async createTeams(teams: ITeam[]){
        const createdTeams =[]
        for (const team of teams) {
            createdTeams.push(await this.create(team)); 
        }
        return createdTeams;
    }

    async deleteByTeamName(): Promise<boolean>{
        const doc = await this.model.deleteMany({ 'teamInfo.name': 'Automation Test team' });
        return !!doc
    }
}