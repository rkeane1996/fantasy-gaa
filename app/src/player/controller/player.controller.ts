import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { PlayerService } from '../service/player.service';
import { PlayerDTO } from '../dto/request/add-player-request.dto';
import { County } from '../../../lib/common/enum/counties';
import { GAAClub } from '../../../lib/common/enum/club';
import { FindPlayerResponseDTO } from '../dto/response/get-player-response.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreatePlayerResponseDto } from '../dto/response/create-player-response.dto';
import { AdminAuthGuard } from '../../auth/guards/admin-auth.guard';
import { UserAuthGuard } from '../../auth/guards/user-auth.guard';
import { UpdatePlayerInfoDTO } from '../dto/request/update-player-request.dto';
import { UpdatePlayerPriceDTO } from '../dto/request/update-player-price-request.dto';
import { UpdatePlayerStatsDto } from '../dto/request/update-stats-request.dto';

@Controller('players')
@ApiTags('player')
export class PlayerController {
  constructor(private readonly playerService: PlayerService) {}

  @Post('/add')
  @UseGuards(AdminAuthGuard)
  @ApiOperation({ summary: 'Add a Player' })
  @ApiResponse({
    status: 201,
    description: 'Add player',
    type: CreatePlayerResponseDto,
  })
  async addPlayer(
    @Body() requestdto: PlayerDTO,
  ): Promise<CreatePlayerResponseDto> {
    return await this.playerService.addPlayer(requestdto);
  }

  @Put('/update/playerInfo')
  @UseGuards(AdminAuthGuard)
  @ApiOperation({ summary: 'Update Players information' })
  @ApiResponse({
    status: 201,
    description: 'Update player information',
    type: FindPlayerResponseDTO,
  })
  async updatePlayerInfo(
    @Body() requestdto: UpdatePlayerInfoDTO,
  ): Promise<FindPlayerResponseDTO> {
    return await this.playerService.updatePlayerInfo(requestdto);
  }

  @Put('/update/price')
  @UseGuards(AdminAuthGuard)
  @ApiOperation({ summary: 'Update Players price' })
  @ApiResponse({
    status: 201,
    description: 'Update player price',
    type: FindPlayerResponseDTO,
  })
  async updatePlayerPrice(
    @Body() requestdto: UpdatePlayerPriceDTO,
  ): Promise<FindPlayerResponseDTO> {
    return await this.playerService.updatePlayerPrice(
      requestdto.playerId,
      requestdto.price,
    );
  }

  @Put('/update/statistics')
  @UseGuards(AdminAuthGuard)
  @ApiOperation({ summary: 'Update Players statistics' })
  @ApiResponse({
    status: 201,
    description: 'Update player statistics',
    type: FindPlayerResponseDTO,
  })
  async updatePlayerStats(
    @Body() requestdto: UpdatePlayerStatsDto,
  ): Promise<FindPlayerResponseDTO> {
    return await this.playerService.updatePlayerStatistics(requestdto);
  }

  @Get()
  @UseGuards(UserAuthGuard)
  @ApiOperation({ summary: 'Get all players' })
  @ApiResponse({
    status: 200,
    description: 'Get all players',
    type: [FindPlayerResponseDTO],
  })
  async getAllPlayers(): Promise<FindPlayerResponseDTO[]> {
    return await this.playerService.findAllPlayers();
  }

  @Get(':id')
  @UseGuards(UserAuthGuard)
  @ApiOperation({ summary: 'Get player' })
  @ApiResponse({
    status: 200,
    description: 'Get player',
    type: FindPlayerResponseDTO,
  })
  @ApiResponse({
    status: 404,
    description: 'Player not found',
  })
  async getPlayer(
    @Param('id') playerId: string,
  ): Promise<FindPlayerResponseDTO> {
    return await this.playerService.getPlayer(playerId);
  }

  @Get('county/:county')
  @UseGuards(UserAuthGuard)
  @ApiOperation({ summary: 'Get players from county' })
  @ApiResponse({
    status: 200,
    description: 'Get players from county',
    type: [FindPlayerResponseDTO],
  })
  async getPlayersByCounty(
    @Param('county') county: County,
  ): Promise<FindPlayerResponseDTO[]> {
    return await this.playerService.getPlayersFromCounty(county);
  }

  @Get('club/:club')
  @UseGuards(UserAuthGuard)
  @ApiOperation({ summary: 'Get players from club' })
  @ApiResponse({
    status: 200,
    description: 'Get players from club',
    type: [FindPlayerResponseDTO],
  })
  async getPlayersByClub(
    @Param('club') club: GAAClub,
  ): Promise<FindPlayerResponseDTO[]> {
    return await this.playerService.getPlayersFromClub(club);
  }
}
