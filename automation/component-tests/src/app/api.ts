import { UserClient } from "../client/users/user.client";

export class Api {
    
    userClient: UserClient;

    constructor(){
        this.userClient = new UserClient()
    }


}