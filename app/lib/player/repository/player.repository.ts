import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Player, PlayerDocument } from '../schema/player.schema';
import { County } from '../../../lib/common/enum/counties';
import 'dotenv/config';
import { CreatePlayerDto } from '../../../src/player/dto/request/add-player-request.dto';
import { Status } from '../constants/status.enum';

export class PlayerRepository {
  constructor(
    @InjectModel(Player.name, process.env.FANTASY_GAA_DB_CONNECTION_NAME)
    private readonly playerModel: Model<PlayerDocument>,
  ) {}

  async createPlayer(entity: CreatePlayerDto): Promise<Player> {
    const newPlayer = new this.playerModel(entity);
    await newPlayer.save();
    return newPlayer.toJSON();
  }

  async findPlayer(playerId: string): Promise<Player> {
    return (await this.playerModel.findOne({ _id: playerId })).toJSON();
  }

  async findAllPlayers(): Promise<Player[]> {
    const players = await this.playerModel.find();
    return players.map((player) => player.toJSON());
  }

  async findPlayersByCounty(county: County): Promise<Player[]> {
    const players = await this.playerModel.find({ county: county });
    return players.map((player) => player.toJSON());
  }

  async findPlayersByClub(club: string): Promise<Player[]> {
    const players = await this.playerModel.find({ club: club });
    return players.map((player) => player.toJSON());
  }

  async updatePlayerPrice(playerId: string, newPrice: number) {
    return (
      await this.playerModel.findOneAndUpdate(
        { _id: playerId },
        {
          $set: {
            price: newPrice,
          },
        },
        { new: true },
      )
    ).toJSON();
  }

  async updatePlayerStatus(playerId: string, newStatus: Status) {
    return (
      await this.playerModel.findOneAndUpdate(
        { _id: playerId },
        {
          $set: {
            status: newStatus,
          },
        },
        { new: true },
      )
    ).toJSON();
  }

  async addTotalPoints(playerId: string, points: number) {
    return (
      await this.playerModel.findByIdAndUpdate(
        playerId,
        {
          $inc: { totalPoints: points },
        },
        { new: true },
      )
    ).toJSON();
  }
}
