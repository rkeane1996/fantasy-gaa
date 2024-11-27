import { IUser, IUserResponseType } from "../../db/mongodb/types/user.type";
import { ServiceClient } from "../base.client";

export class UserClient extends ServiceClient{
    private endpoint = `user`;

    async getUserRequest(params: Record<string, string[]>, token: string){
        
        return this._get<IUserResponseType[]>(this.endpoint, {
            params,
            headers:{
                authorization: `Bearer ${token}`
            }
        });  
    }

    async getUserbyClubRequest(params: Record<string, string>, token: string){
        const endpoint = `${this.endpoint}/club`;
        return this._get<IUserResponseType[]>(endpoint, {
            params,
            headers:{
                authorization: `Bearer ${token}`
            }
        });  
    }
}