import { When } from "@cucumber/cucumber";
import { App } from "../../../src/app/app";

When('a getUser request is made to the service', async function(this: App) {
    const params: Record<string, string[]> = {};
    params.userIds = this.world.users.map(user => user._id!.toString())
    this.world.getUserResponse = await this.api.userClient.getUserRequest(params, this.world.token);
});

When('a getUserByClub request is made to the service', async function(this: App) {
    const params: Record<string, string> = {};
    params.clubName = this.world.clubName;
    this.world.getUserByClubResponse = await this.api.userClient.getUserbyClubRequest(params, this.world.token);
});