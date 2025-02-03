import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { PlayerService } from '../service/player.service';
import { County } from '../../../lib/common/enum/counties';
import { GAAClub } from '../../../lib/common/enum/club';
import { FindPlayerResponseDTO } from '../dto/response/get-player-response.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UpdatePlayerStatusDto } from '../dto/request/update-player-status-request.dto';
import { CreatePlayerDto } from '../dto/request/add-player-request.dto';
import { UpdatePlayerPriceDto } from '../dto/request/update-player-price-request.dto copy';
import { Roles } from '../../../src/auth/decorators/roles.decorators';
import { RolesGuard } from '../../../src/auth/guards/roles.guard';
import { AuthGuard } from '../../../src/auth/guards/auth.guard';

@Controller('players')
@ApiTags('player')
export class PlayerController {
  constructor(private readonly playerService: PlayerService) {}

  @Post('create')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(process.env.ADMIN_ROLE)
  @ApiOperation({ summary: 'Add a Player' })
  @ApiResponse({
    status: 201,
    description: 'Add player',
    type: FindPlayerResponseDTO,
  })
  async addPlayer(
    @Body() createPlayerDto: CreatePlayerDto,
  ): Promise<FindPlayerResponseDTO> {
    return await this.playerService.createPlayer(createPlayerDto);
  }

  @Put('price')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(process.env.ADMIN_ROLE)
  @ApiOperation({ summary: 'Update Players price' })
  @ApiResponse({
    status: 201,
    description: 'Update player price',
    type: FindPlayerResponseDTO,
  })
  async updatePlayerPrice(
    @Body() updatePlayerPriceDTO: UpdatePlayerPriceDto,
  ): Promise<FindPlayerResponseDTO> {
    return await this.playerService.updatePlayerPrice(updatePlayerPriceDTO);
  }

  @Put('status')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(process.env.ADMIN_ROLE)
  @ApiOperation({ summary: 'Update Players status' })
  @ApiResponse({
    status: 201,
    description: 'Update player status',
    type: FindPlayerResponseDTO,
  })
  async updatePlayerStats(
    @Body() updatePlayerStatusDto: UpdatePlayerStatusDto,
  ): Promise<FindPlayerResponseDTO> {
    return await this.playerService.updatePlayerStatus(updatePlayerStatusDto);
  }

  @Get()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(process.env.ADMIN_ROLE, process.env.USER_ROLE)
  @ApiOperation({ summary: 'Get all players' })
  @ApiResponse({
    status: 200,
    description: 'Get all players',
    type: [FindPlayerResponseDTO],
  })
  async getAllPlayers(): Promise<FindPlayerResponseDTO[]> {
    return await this.playerService.getAllPlayers();
  }

  @Get('player')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(process.env.ADMIN_ROLE, process.env.USER_ROLE)
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
    @Query('playerId') playerId: string,
  ): Promise<FindPlayerResponseDTO> {
    return await this.playerService.getPlayer(playerId);
  }

  @Get('county')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(process.env.ADMIN_ROLE, process.env.USER_ROLE)
  @ApiOperation({ summary: 'Get players from county' })
  @ApiResponse({
    status: 200,
    description: 'Get players from county',
    type: [FindPlayerResponseDTO],
  })
  async getPlayersByCounty(
    @Query('countyName') county: County,
  ): Promise<FindPlayerResponseDTO[]> {
    return await this.playerService.getPlayersFromCounty(county);
  }

  @Get('club')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(process.env.ADMIN_ROLE, process.env.USER_ROLE)
  @ApiOperation({ summary: 'Get players from club' })
  @ApiResponse({
    status: 200,
    description: 'Get players from club',
    type: [FindPlayerResponseDTO],
  })
  async getPlayersByClub(
    @Query('clubName') club: GAAClub,
  ): Promise<FindPlayerResponseDTO[]> {
    return await this.playerService.getPlayersFromClub(club);
  }
}
