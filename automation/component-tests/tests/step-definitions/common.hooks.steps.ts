import { After, Before, setWorldConstructor } from "@cucumber/cucumber";
import { Database } from "../../src/app/database";
import { App } from "../../src/app/app";

setWorldConstructor(App);

Before({ name: 'Before Hook - Open Database Connection'},async function () {
    await Database.initConnection();
})

After({ name: 'After Hook - Close Database Connection'}, async function () {
    await Database.closeConnection();
})

After({ name: 'After Hook - Delete Users Created', tags: '@CleanUser'}, async function (this: App) {
    await this.db.user.deleteById(this.world.users.map(_ => _._id!.toString()));
});




