import { Model, ObjectId } from "mongoose";
import { UserDocument } from "../schemas/user.schema";
import { IUser } from "../types/user.type";
import { MongoBaseRepository } from "./base.repository";

export class UserRepository extends MongoBaseRepository<UserDocument,IUser> {

    constructor(readonly model: Model<UserDocument>){
        super(model);
    }


    async createUsers(users: IUser[]){
        const createdUser =[]
        for (const user of users) {
            createdUser.push(await this.create(user)); 
        }
        return createdUser;
    }

    async updateUsers(users: IUser[]){
        for (const user of users) {
            const id = user._id as unknown as ObjectId
            await this.update(id, user); 
        }
    }

}