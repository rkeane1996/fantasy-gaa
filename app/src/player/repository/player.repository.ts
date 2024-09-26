import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Player } from '../schema/player.schema';
import { PlayerDTO } from '../dto/request/add-player-request.dto';
import { County } from 'lib/common/enum/counties';
import { UpdatePlayerStatsDto } from '../dto/request/update-stats-request.dto';
import { UpdatePlayerInfoDTO } from '../dto/request/update-player-request.dto';
import 'dotenv/config';

export class PlayerRepository {
  constructor(
    @InjectModel(Player.name, process.env.FANTASY_GAA_DB_CONNECTION_NAME)
    private readonly playerModel: Model<Player>,
  ) {}

  async createPlayer(entity: PlayerDTO): Promise<Player> {
    return await this.playerModel.create({ ...entity });
  }

  async updatePlayerInfo(entity: UpdatePlayerInfoDTO) {
    return await this.playerModel.findOneAndUpdate(
      { _id: entity.playerId },
      {
        $set: {
          playerName: entity.playerName,
          county: entity.county,
          club: entity.club,
          position: entity.position,
          availability: entity.availability,
        },
      },
      { new: true },
    );
  }

  async updatePrice(userId: string, newPrice: number) {
    return await this.playerModel.findOneAndUpdate(
      { _id: userId },
      {
        $set: {
          price: newPrice,
        },
      },
      { new: true },
    );
  }

  async updateStats(updateStatDto: UpdatePlayerStatsDto) {
    return await this.playerModel.findOneAndUpdate(
      { _id: updateStatDto.playerId },
      {
        $inc: {
          'stats.goals': updateStatDto.goals,
          'stats.points': updateStatDto.points,
          'stats.yellowCards': updateStatDto.yellowCards,
          'stats.redCards': updateStatDto.redCards,
        },
      },
      { new: true },
    );
  }

  async updatePoints(
    playerId: string,
    gameweekNumber: number,
    gameweekPoints: number,
  ) {
    return await this.playerModel.findOneAndUpdate(
      { id: playerId },
      {
        $inc: { totalPoints: gameweekPoints },
        $push: {
          gameweekPoints: {
            gameweek: gameweekNumber,
            points: gameweekPoints,
          },
        },
      },
      { new: true },
    );
  }

  async findAllPlayers(): Promise<Player[]> {
    return await this.playerModel.find().lean();
  }

  async findPlayer(playerId: string): Promise<Player> {
    return await this.playerModel.findOne({ _id: playerId }).lean();
  }

  async findPlayersByCounty(county: County): Promise<Player[]> {
    return await this.playerModel.find({ county: county }).lean();
  }

  async findPlayersByClub(club: string): Promise<Player[]> {
    return await this.playerModel.find({ 'club.clubName': club }).lean();
  }
}
