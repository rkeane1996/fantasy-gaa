import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Player, PlayerDocument } from '../schema/player.schema';
import { PlayerDTO } from '../dto/request/add-player-request.dto';
import { County } from 'lib/common/enum/counties';
import { IPlayer } from '../interface/player.interface';

export class PlayerRepository {
  constructor(
    @InjectModel(Player.name, process.env.FANTASY_GAA_DB_CONNECTION_NAME)
    private readonly playerModel: Model<PlayerDocument>,
  ) {}

  async createPlayer(entity: PlayerDTO): Promise<IPlayer> {
    return await this.playerModel.create({ ...entity });
  }

  async findAllPlayers(): Promise<IPlayer[]> {
    return await this.playerModel.find().lean();
  }

  async findPlayer(playerId: string): Promise<IPlayer> {
    return await this.playerModel.findOne({ playerId }).lean();
  }

  async findPlayersByCounty(county: County): Promise<IPlayer[]> {
    return await this.playerModel.find({ 'club.county': county }).lean();
  }

  async findPlayersByClub(club: string): Promise<IPlayer[]> {
    return await this.playerModel.find({ 'club.clubName': club }).lean();
  }
}
