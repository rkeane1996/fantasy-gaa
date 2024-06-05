import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { PlayerService } from '../service/player.service';
import { PlayerDTO } from '../dto/request/add-player-request.dto';
import { County } from 'lib/common/enum/counties';
import { Club } from 'lib/common/enum/club';
import { AddPointsDTO } from 'lib/common/dto/request/add-points.dto';
import { GetPointsResponseDto } from '../../../lib/common/dto/response/get-points-response.dto';
import { FindPlayerResponseDTO } from '../dto/response/get-player-response.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreatePlayerResponseDto } from '../dto/response/create-player-response.dto';
import { AdminAuthGuard } from 'src/auth/guards/admin-auth.guard';
import { UserAuthGuard } from 'src/auth/guards/user-auth.guard';

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
    @Param('club') club: Club,
  ): Promise<FindPlayerResponseDTO[]> {
    return await this.playerService.getPlayersFromClub(club);
  }

  @Post('addPoints')
  @UseGuards(AdminAuthGuard)
  @ApiOperation({ summary: 'Add points to player' })
  @ApiResponse({
    status: 201,
    description: 'Points added to player',
    type: GetPointsResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Player not found',
  })
  async addPlayerPoints(
    @Body() request: AddPointsDTO,
  ): Promise<GetPointsResponseDto> {
    return await this.playerService.addPoints(request);
  }

  @Get('points/:id')
  @UseGuards(UserAuthGuard)
  @ApiOperation({ summary: 'Get points for player' })
  @ApiResponse({
    status: 200,
    description: 'Point for player',
    type: GetPointsResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Player not found',
  })
  async getPlayerPoints(
    @Param('id') playerId: string,
  ): Promise<GetPointsResponseDto> {
    return await this.playerService.getPlayerPoints(playerId);
  }
}
