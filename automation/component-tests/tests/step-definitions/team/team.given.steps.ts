import { Given } from "@cucumber/cucumber";
import { App } from "../../../src/app/app";
import { IPlayer } from "../../../src/db/mongodb/types/player.type";
import { Position, } from "../../../src/db/mongodb/types/position.type";
import { CreateTeamRequest } from "../../../src/client/team/dto/create-team.dto";
import { County } from "../../../src/db/mongodb/types/club.type";

Given('user chooses the players for the team', async function (this: App) {
    const defendersPicked = pickPlayersForTeam(this.world.players, Position.DEFENDER, 8)
    const midfieldersPicked = pickPlayersForTeam(this.world.players, Position.MIDFIELD, 3)
    const goalkeepersPicked = pickPlayersForTeam(this.world.players, Position.GOALKEEPER, 2)
    const forwardsPicked = pickPlayersForTeam(this.world.players, Position.FORWARD, 8)
    const playersChosenForTeam = defendersPicked.concat(midfieldersPicked, goalkeepersPicked, forwardsPicked)
    const team = new CreateTeamRequest()
    
    team.teamInfo = {
        jerseyColour: 'blue',
        shortsColour: 'white',
        teamName: 'Automation Test team'
    }
    team.userId = this.world.users[0]._id!.toString()
    team.players = Array(playersChosenForTeam.length).fill(null).map((_, index) => ({
        county: playersChosenForTeam[index].county,
        price: playersChosenForTeam[index].price,
        position: playersChosenForTeam[index].position,
        playerId: playersChosenForTeam[index]._id!.toString(),
        isSub: false,
        isCaptain: false,
        isViceCaptain: false
    }));
    team.budget = 100 - team.players.reduce((sum, player) => sum + player.price, 0);
    this.world.createTeamRequest = team;
    this.world.team = {
        userId: team.userId,
        teamInfo: team.teamInfo,
        players: Array(playersChosenForTeam.length).fill(null).map((_, index) => ({
            county: playersChosenForTeam[index].county,
            price: playersChosenForTeam[index].price,
            position: playersChosenForTeam[index].position,
            playerId: playersChosenForTeam[index]._id!.toString(),
            isSub: false,
            isCaptain: false,
            isViceCaptain: false
        })),
        budget: team.budget,
        totalPoints: 0,
        transfers: {
            cost: 4,
            limit: 4,
            made: 0,
            freeTransfers: 0
        }
    }
})



Given('user forgets to add {string}', async function (this: App, property: string) {
    this.world.createTeamRequest[property] = null
})

Given('users team has {int} players', async function (this: App, numberOfPlayers: number) {
    if(numberOfPlayers < this.world.createTeamRequest.players.length){
        this.world.createTeamRequest.players = this.world.createTeamRequest.players.slice(0,numberOfPlayers)
    }else {
        const numberofPlayersToAdd = numberOfPlayers - this.world.createTeamRequest.players.length
        for(let i=0; i<=numberOfPlayers; i++) {
            this.world.createTeamRequest.players.push({
                playerId: Math.floor(Math.random() * 20).toString(),
                position: Position.DEFENDER,
                county: County.Antrim,
                price: 0,
                isCaptain: false,
                isViceCaptain: false,
                isSub: false
            })
        } 
    }
})




function pickPlayersForTeam(allPlayers: IPlayer[], position: Position, numberOfPlayers: number) {
    const playersChosen = allPlayers
        .filter(player => player.position === position)
        .slice(0, numberOfPlayers);
    allPlayers = allPlayers.filter(
        player => !playersChosen.includes(player)
    );
    return playersChosen
}