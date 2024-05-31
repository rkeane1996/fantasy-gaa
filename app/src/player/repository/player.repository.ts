import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Player, PlayerDocument } from '../schema/player.schema';
import { PlayerDTO } from '../dto/request/add-player-request.dto';
import { County } from 'lib/common/enum/counties';
import { AddPointsDTO } from 'lib/common/dto/request/add-points.dto';

export class PlayerRepository {
  constructor(
    @InjectModel(Player.name)
    private readonly playerModel: Model<PlayerDocument>,
  ) {}

  async createPlayer(entity: PlayerDTO) {
    return await this.playerModel.create({ ...entity });
  }

  async addPoints(entity: AddPointsDTO) {
    return this.playerModel.updateOne(
      { playerId: entity.id },
      {
        $push: { gameweekPoints: entity.points },
        $inc: { totalPoints: entity.points.gameweekPoints },
      },
    );
  }

  async findAllPlayers() {
    return await this.playerModel.find();
  }

  async findPlayer(playerId: string) {
    return await this.playerModel.findOne({ playerId });
  }

  async findPlayersByCounty(county: County) {
    return await this.playerModel.find({ county });
  }

  async findPlayersByClub(club: string) {
    return await this.playerModel.find({ 'club.clubName': club });
  }
}
