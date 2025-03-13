import { County, GAAClub } from "../../../src/db/mongodb/types/club.type";
import { Given } from '@cucumber/cucumber';
import { App } from "../../../src/app/app";
import { IRole } from "../../../src/db/mongodb/types/role.type";

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