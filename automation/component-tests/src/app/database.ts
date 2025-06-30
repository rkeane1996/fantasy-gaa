import mongoose from "mongoose";
import { UserRepository } from "../db/mongodb/repository/user.repository";
import { UserModel } from "../db/mongodb/schemas/user.schema";
import { TeamRepository } from "../db/mongodb/repository/team.repository";
import { PlayerRepository } from "../db/mongodb/repository/player.repository";
import { PlayerModel } from "../db/mongodb/schemas/player.schema";
import { TeamModel } from "../db/mongodb/schemas/team.schema";

export class Database {
    private static connection: mongoose.Connection | null = null;
    user: UserRepository;
    team: TeamRepository;
    player: PlayerRepository;

    constructor(){
        this.user = new UserRepository(UserModel);
        this.player = new PlayerRepository(PlayerModel);
        this.team = new TeamRepository(TeamModel);
    }

    static async initConnection(){
        const createMongoDBConnection='Creating Database Connection'
        console.log({createMongoDBConnection})
        if(Database.connection && Database.connection.readyState === 1){
            return Database.connection;
        }
        let url;
        let settings;
        if(process.env.USE_MONGO_EMULATOR){
            url = 'mongodb://localhost:27017/fantasy-gaa-db';
            settings = undefined;
        }else{
            const connection: MongoConnectionString = process.env.MONGO_CONNECTION as any;
            url = connection[process.env.MONGO_CONNECTION_KEY as keyof MongoConnectionString]
            settings = {
                auth: {
                    username: connection.username,
                    password: connection.password
                },
                dbName: 'user-db'
            }
        }

        await mongoose.connect(url, settings);

        Database.connection = mongoose.connection;
        return Database.connection;
    }

    static async closeConnection() {
        const createMongoDBConnection='Closing Database Connection'
        console.log({createMongoDBConnection})
        if(Database.connection){
            await mongoose.connection.close();
            Database.connection = null
        }
    }

}

interface MongoConnectionString {
    
        connection_string_public: string,
        connection_string_peering: string,
        connection_string_vpn: string,
        username: string,
        password: string
    
}