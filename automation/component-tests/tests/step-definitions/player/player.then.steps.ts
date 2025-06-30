import { Then } from "@cucumber/cucumber";
import { App } from "../../../src/app/app";
const assert = require('assert');

Then('player is created', async function(this: App) {
    const actual = this.world.createPlayerResponse.data;
    const expected = this.world.createPlayerRequest;
    assert.equal(actual.playerName, expected.playerName);
    assert.equal(actual.club, expected.club);
    assert.equal(actual.county, expected.county);
    assert.equal(actual.price, expected.price);
    assert.equal(actual.position, expected.position);
    assert.equal(actual.profilePictureUrl, expected.profilePictureUrl);
    assert.equal(actual.status, expected.status);
    assert.equal(actual.totalPoints, 0)
});

Then('players are retrieve', async function(this: App) {
    const actual = this.world.getPlayerResponse;
    assert.equal(actual.data.length, this.world.playerIds.length)
    actual.data.forEach(obj => {
        assert(obj != null)
        assert(this.world.playerIds.includes(obj!.id))
    })
});

Then('no players are returned', async function(this: App) {
    const actual = this.world.getPlayerResponse;
    assert.equal(actual.data[0], null)
});

Then('non existing player and player are returned', async function(this: App) {
    const actual = this.world.getPlayerResponse;
    assert.equal(actual.data.length, this.world.playerIds.length);
    assert(actual.data.includes(null));
    const player = actual.data.find(obj => {
        if(obj != null){
            this.world.playerIds.includes(obj!.id);
            return obj;
        }
    })
    assert(player)
});

Then('player price is updated', async function(this: App) {
    const responseData = this.world.updatePlayerPriceResponse.data
    assert.equal(responseData?.price, this.world.newPrice)
});

Then('player status is updated', async function(this: App) {
    const responseData = this.world.updatePlayerStatusResponse.data
    assert.equal(responseData?.status, this.world.newStatus)
});


