import { Api } from "./api";
import { Database } from "./database";
import { World as CustomWorld } from "./world";
import { World, IWorldOptions } from '@cucumber/cucumber';
import 'dotenv/config';

export class App extends World {
    world: CustomWorld;
    api: Api;
    db: Database;
    constructor(options: IWorldOptions) {
        super(options);
        this.world = new CustomWorld();
        this.api = new Api();
        this.db = new Database();
      }
}

