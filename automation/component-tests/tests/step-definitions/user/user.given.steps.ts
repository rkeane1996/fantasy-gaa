import { IRole } from "../../../src/db/mongodb/types/user.type";
import { County, GAAClub } from "../../../src/db/mongodb/types/club.type";
import { DataTable, Given } from '@cucumber/cucumber';
import { App } from "../../../src/app/app";
import { generateToken } from "../../../src/utils/service-client/authorisation";
import { generateRandomEmail } from "../../../src/utils/data-utils/array-randomizer";


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

Given('users token is invalid', async function (this: App) {
    this.world.token = 'abcedefghijk'
});

Given('users token is empty', async function (this: App) {
    this.world.token = ''
});

Given('userIds are not correct type', async function (this: App) {
    this.world.users.push({
        _id: 123,
        firstName: "bgf",
        lastName: "bfd",
        email: "r@res.com",
        password: "fgthrytukytersfb",
        dateOfBirth: new Date,
        club: {
            clubName: GAAClub.BallybodenStEndas,
            county: County.Antrim
        },
        role: IRole.User
    })
});



Given('I want to get users from {string}', async function (this: App, club: string) {
    this.world.clubName = club;
});