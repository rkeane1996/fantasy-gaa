import { DataTable, Given, Then } from '@cucumber/cucumber';
import { App } from '../../src/app/app';
import { assertApiResponse } from '../../src/utils/service-client/api-assertions';
import { generateToken } from '../../src/utils/service-client/authorisation';
import { generateRandomEmail } from '../../src/utils/data-utils/array-randomizer';
import { County, GAAClub } from '../../src/db/mongodb/types/club.type';
import { IRole } from '../../src/db/mongodb/types/role.type';
import { IPlayer } from '../../src/db/mongodb/types/player.type';
import { Position, Status } from '../../src/db/mongodb/types/position.type';
import { getRandomEnumValue } from '../../src/utils/data-utils/enum-randomizer';

Given('the application has authorized and authenticated users', async function (this: App, dataTable: DataTable) {
    const items = dataTable.hashes();
    const users = items.map((_) => {
        return {
            firstName: _.firstName,
            lastName: "Automation",
            email: generateRandomEmail(),
            password: "fefdrf",
            dateOfBirth: new Date('10/09/1990'),
            club: {
                clubName: GAAClub[_.club],
                county: County.Galway
            },
            role: IRole[_.role]
        }
    })

    this.world.users = await this.db.user.createUsers(users);

    const currentDate = new Date();
    const newDatePlusHour = new Date(currentDate.getTime() + 1 * 60 * 60 * 1000);
    this.world.token = generateToken({
        sub: this.world.users[0]._id!.toString(),
        iat: currentDate.getTime(),
        exp: newDatePlusHour.getTime()
    })
});

Given('the application has {int} players', async function (this: App, numberOfPlayers: number) {
    const positionValues = Object.values(Position);
    const countyValues = Object.values(County);
    const players: IPlayer[] = new Array(numberOfPlayers).fill(null).map((_, index) => ({
                playerName: `Player ${index + 1}`,
                profilePictureUrl: 'www.picture.com',
                position: positionValues[index % positionValues.length],
                club: getRandomEnumValue(GAAClub),
                county: countyValues[index % countyValues.length],
                status: Status.AVAILABLE,
                price: 1.5,
                totalPoints: 0,
                dateCreated: new Date()
              }));
      this.world.players = await this.db.player.createPlayers(players);
});

Given('users token is invalid', async function (this: App) {
  this.world.token = 'abcedefghijk'
});

Given('users token is empty', async function (this: App) {
  this.world.token = ''
});


Then(
  'the {string} request should succeed with a status of {string}',
  function (this: App, res: string, statusString: string) {
    const response = this.world.fromPhrase(res, 'Response');
    assertApiResponse(response, statusString);
  }
);

Then(
  'the {string} request should fail with a status of {string}',
  function (this: App, res: string, statusString: string) {
    const response = this.world.fromPhrase(res, 'Response');
    assertApiResponse(response, statusString);
  }
);