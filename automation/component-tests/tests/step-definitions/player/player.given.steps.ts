import { Given } from "@cucumber/cucumber";
import { App } from "../../../src/app/app";
import { CreatePlayerRequest } from "../../../src/client/player/dto/create-player.dto";
import { County, GAAClub } from "../../../src/db/mongodb/types/club.type";
import { Position, Status } from "../../../src/db/mongodb/types/position.type";
import { IPlayer } from "../../../src/db/mongodb/types/player.type";
import { UpdatePlayerPriceDto } from "../../../src/client/player/dto/update-player-price.dto";
import { UpdatePlayerStatusDto } from "../../../src/client/player/dto/update-player-status.dto";
import { getRandomEnumValue } from "../../../src/utils/data-utils/enum-randomizer";


Given('a player to create', async function (this: App) {
    const createPlayerRequest = new CreatePlayerRequest();
    createPlayerRequest.playerName = 'Automation Player Name';
    createPlayerRequest.profilePictureUrl = 'www.profilepic.ie';
    createPlayerRequest.club = GAAClub.Carnmore;
    createPlayerRequest.county = County.Galway;
    createPlayerRequest.position = Position.DEFENDER;
    createPlayerRequest.status = Status.AVAILABLE;
    createPlayerRequest.price = 5.0;
    this.world.createPlayerRequest = createPlayerRequest;
})

Given('request is not valid', async function (this: App) {
    this.world.createPlayerRequest.playerName = 123;
    this.world.createPlayerRequest.profilePictureUrl = null;
    this.world.createPlayerRequest.club = 'Random Club';
    this.world.createPlayerRequest.county = 'Random County';
    this.world.createPlayerRequest.position = 123;
    this.world.createPlayerRequest.price = '2';
    this.world.createPlayerRequest.status = 'Availability';
})

Given('that player does not exist', async function (this: App) {
      this.world.players[0]._id = this.world.players[0]._id?.toString().substring(0,20)+'1234'
});

Given('the price for a player is changed to {float}', async function (this: App, price: number) {
    const updatePlayerPriceDto = new UpdatePlayerPriceDto();
    this.world.newPrice = price;
    updatePlayerPriceDto.playerId = this.world.players[0]._id!.toString();
    updatePlayerPriceDto.price = this.world.newPrice
    this.world.updatePlayerPriceRequest = updatePlayerPriceDto;
});

Given('the status for a player is changed', async function (this: App) {
    const updatePlayerStatusDto = new UpdatePlayerStatusDto();
    updatePlayerStatusDto.playerId = this.world.players[0]._id!.toString();
    updatePlayerStatusDto.status = this.world.newStatus;
    this.world.updatePlayerStatusRequest = updatePlayerStatusDto;
}); 

Given('the status for a player is changed to invalid value', async function (this: App) {
    const updatePlayerStatusDto = new UpdatePlayerStatusDto();
    updatePlayerStatusDto.playerId = this.world.players[0]._id!.toString();
    updatePlayerStatusDto.status = 'INVALID';
    this.world.updatePlayerStatusRequest = updatePlayerStatusDto;
}); 



