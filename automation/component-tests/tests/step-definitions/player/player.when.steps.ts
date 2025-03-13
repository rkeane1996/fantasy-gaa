import { When } from "@cucumber/cucumber";
import { App } from "../../../src/app/app";

When('a createPlayer request is made to the service', async function(this: App) {
    this.world.createPlayerResponse = await this.api.playerClient.createPlayer(this.world.createPlayerRequest, this.world.token);
});

When('a getPlayer request is made to the service to retrieve {int} players', async function(this: App, numberOfPlayers: number) {
    const players = this.world.players.slice(0,numberOfPlayers) || ['123'];
    const params: Record<string, string[]> = {};
    params.playerIds = players.map(player => player._id!.toString())
    this.world.playerIds = params.playerIds
    this.world.getPlayerResponse = await this.api.playerClient.getPlayer(params, this.world.token);
});

When('a updatePlayerPrice request is made to the service', async function(this: App) {
    const request = this.world.updatePlayerPriceRequest;
    this.world.updatePlayerPriceResponse = await this.api.playerClient.updatePlayerPrice(request, this.world.token);
});

When('a updatePlayerStatus request is made to the service', async function(this: App) {
    const request = this.world.updatePlayerStatusRequest;
    this.world.updatePlayerStatusResponse = await this.api.playerClient.updatePlayerStatus(request, this.world.token);
});

