import { Then } from "@cucumber/cucumber";
import { App } from "../../../src/app/app";
const assert = require('assert');

Then('a team is created', async function(this: App){
    const createTeamResponse = this.world.createTeamResponse.data;
    const team = await this.db.team.findById(createTeamResponse.id);
    assert(team != null);
})