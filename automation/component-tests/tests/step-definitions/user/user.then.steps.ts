import { Then } from "@cucumber/cucumber";
import { App } from "../../../src/app/app";
const assert = require('node:assert');

Then('a users details is returned', async function(this: App) {
    this.world.users.forEach(user => {
        const match = this.world.getUserResponse!.data.find(response => response.userId === user._id?.toString());
        assert.notStrictEqual(match, undefined, `User ${user._id} was not returned`);
    })
});

Then('only users that play with {string} are returned', async function(this: App, club: string) {
    this.world.getUserResponse!.data.forEach(response => 
        assert.strictEqual(response.club.clubName, club))
});


