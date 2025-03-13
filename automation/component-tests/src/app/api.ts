import { PlayerClient } from "../client/player/player.client";
import { TeamClient } from "../client/team/team.client";
import { UserClient } from "../client/users/user.client";

export class Api {
    
    userClient: UserClient;
    teamClient: TeamClient;
    playerClient: PlayerClient;

    constructor(){
        this.userClient = new UserClient()
        this.playerClient = new PlayerClient();
        this.teamClient = new TeamClient();
    }


}