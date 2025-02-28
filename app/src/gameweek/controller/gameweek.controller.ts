import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { GameweekService } from '../service/gameweek.service';
import { CreateGameweekDto } from '../dto/request/create-gameweek.dto';
import { ActivateDeactivateGameweekDto } from '../dto/request/start-end-gameweek.dto';
import { GetGameweekResponseDto } from '../dto/response/get-gameweek-repsonse.dto';
import { AddMatchesToGameweekDto } from '../dto/request/add-matches-to-gameweek.dto';
import { AddTeamsToGameweekDto } from '../dto/request/add-teams-to-gameweek.dto';
import { GameweekTeam } from '../../../lib/gameweek/schema/gameweek.team.schema';
import { Match } from '../../../lib/match/schema/match.schema';
import { Roles } from '../../../src/auth/decorators/roles.decorators';
import { RolesGuard } from '../../../src/auth/guards/roles.guard';
import { AuthGuard } from '../../../src/auth/guards/auth.guard';

@Controller('gameweek')
@ApiTags('gameweek')
export class GameweekController {
  constructor(private readonly gameweekService: GameweekService) {}

  @Post('create')
  @ApiOperation({ summary: 'Create a gameweek' })
  @ApiResponse({
    status: 201,
    description: 'Create gameweek',
    type: GetGameweekResponseDto,
  })
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(process.env.ADMIN_ROLE)
  async createGameWeek(
    @Body() createGameweekDto: CreateGameweekDto,
  ): Promise<GetGameweekResponseDto> {
    return await this.gameweekService.createGameWeek(createGameweekDto);
  }

  @Post('matches/add')
  @ApiOperation({ summary: 'Add Matches To Gameweek' })
  @ApiResponse({
    status: 201,
    description: 'Add Matches To Gameweek',
    type: GetGameweekResponseDto,
  })
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(process.env.ADMIN_ROLE)
  async addMatchesToGameweek(
    @Body() addMatchesToGameweekDto: AddMatchesToGameweekDto,
  ): Promise<GetGameweekResponseDto> {
    return await this.gameweekService.addMatchesToGameweek(
      addMatchesToGameweekDto,
    );
  }

  @Post('teams/add')
  @ApiOperation({ summary: 'Lock teams for gameweek' })
  @ApiResponse({
    status: 201,
    description: 'Lock teams for gameweek',
    type: GetGameweekResponseDto,
  })
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(process.env.ADMIN_ROLE)
  async addTeamsToGameweek(
    @Body() addTeamsToGameweekDto: AddTeamsToGameweekDto,
  ): Promise<GetGameweekResponseDto> {
    return await this.gameweekService.lockTeamsForGameweek(
      addTeamsToGameweekDto,
    );
  }

  @Get()
  @ApiOperation({ summary: 'Get gameweek' })
  @ApiResponse({
    status: 200,
    description: 'Get gameweek',
  })
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(process.env.ADMIN_ROLE, process.env.USER_ROLE)
  async getGameWeek(
    @Query('gameweekNumber') gameweekNumber: number,
  ): Promise<GetGameweekResponseDto> {
    return await this.gameweekService.getGameWeek(gameweekNumber);
  }

  @Get('matches')
  @ApiOperation({ summary: 'Get gameweek matches' })
  @ApiResponse({
    status: 200,
    description: 'Get gameweek matches',
  })
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(process.env.ADMIN_ROLE, process.env.USER_ROLE)
  async getGameWeekMatches(
    @Query('gameweekNumber') gameweekNumber: number,
  ): Promise<Match[]> {
    return await this.gameweekService.getGameWeekMatches(gameweekNumber);
  }

  @Get('teams')
  @ApiOperation({ summary: 'Get gameweek teams' })
  @ApiResponse({
    status: 200,
    description: 'Get gameweek teams',
  })
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(process.env.ADMIN_ROLE, process.env.USER_ROLE)
  async getGameWeekTeams(
    @Query('gameweekNumber') gameweekNumber: number,
  ): Promise<GameweekTeam[]> {
    return await this.gameweekService.getGameWeekTeams(gameweekNumber);
  }

  @Get('team')
  @ApiOperation({ summary: 'Get gameweek team' })
  @ApiResponse({
    status: 200,
    description: 'Get gameweek team',
  })
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(process.env.ADMIN_ROLE, process.env.USER_ROLE)
  async getGameWeekTeam(
    @Query('gameweekNumber') gameweekNumber: number,
    @Query('teamId') teamId: string,
  ): Promise<GameweekTeam> {
    return await this.gameweekService.getGameWeekTeam(gameweekNumber, teamId);
  }

  @Put('activation')
  @ApiOperation({ summary: 'Activate/Deactivate a Gameweek' })
  @ApiResponse({
    status: 201,
    description: 'Activate/Deactivate  a Gameweek',
  })
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(process.env.ADMIN_ROLE)
  async startEndGameweek(
    @Body() activateDeactivateGameweekDto: ActivateDeactivateGameweekDto,
  ) {
    const updatedGameweek =
      await this.gameweekService.activateDeactivateGameweek(
        activateDeactivateGameweekDto.gameweekNumber,
        activateDeactivateGameweekDto.isActive,
      );
    return {
      message: `Gameweek ${updatedGameweek.gameweekNumber} is now ${updatedGameweek.isActive ? 'active' : 'inactive'}`,
      gameweek: updatedGameweek,
    };
  }
}
