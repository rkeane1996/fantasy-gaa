import { When } from "@cucumber/cucumber";
import { App } from "../../../src/app/app";

When('a createTeam request is made to the service', async function(this: App) {
    const requestBody = this.world.createTeamRequest
    this.world.createTeamResponse = await this.api.teamClient.createTeam(requestBody, this.world.token)
});
