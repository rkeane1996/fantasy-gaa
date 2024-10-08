import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AdminAuthGuard } from '../../../src/auth/guards/admin-auth.guard';
import { GameweekService } from '../service/gameweek.service';
import { CreateGameweekDto } from '../dto/request/create-gameweek.dto';
import { StartStopGameweekDto } from '../dto/request/start-end-gameweek.dto';
import { UpdateMatchScoreDto } from '../dto/request/update-match-score.dto';
import { CreateMatchDto } from '../dto/request/create-match.dto';
import { GetGameweekResponseDto } from '../dto/response/get-gameweek-repsonse.dto';
import { GameweekActiveResposneDto } from '../dto/response/gameweek-active-response.dto';
import { GetMatchResponseDto } from '../dto/response/get-match-response.dto';

@Controller('gameweek')
@ApiTags('gameweek')
@UseGuards(AdminAuthGuard)
export class GameweekController {
  constructor(private readonly gameweekService: GameweekService) {}

  @Post('create')
  @ApiOperation({ summary: 'Create a gameweek' })
  @ApiResponse({
    status: 201,
    description: 'Create gameweek',
    type: CreateGameweekDto,
  })
  async createGameWeek(
    @Body() request: CreateGameweekDto,
  ): Promise<GetGameweekResponseDto> {
    return await this.gameweekService.createGameWeek(request);
  }

  @Get()
  @ApiOperation({ summary: 'Get gameweeks' })
  @ApiResponse({
    status: 200,
    description: 'Get gameweeks',
  })
  async getGameWeeks(): Promise<GetGameweekResponseDto[]> {
    return await this.gameweekService.getGameWeeks();
  }

  @Put('activation')
  @ApiOperation({ summary: 'Activate/Deactivate a Gameweek' })
  @ApiResponse({
    status: 201,
    description: 'Activate/Deactivate  a Gameweek',
    type: StartStopGameweekDto,
  })
  async startEndGameweek(
    @Body() request: StartStopGameweekDto,
  ): Promise<GameweekActiveResposneDto> {
    return await this.gameweekService.startEndGameweek(
      request.gameweekNumber,
      request.isActive,
    );
  }

  @Get('/:gameweekNumber')
  @ApiOperation({ summary: 'Get gameweek' })
  @ApiResponse({
    status: 200,
    description: 'Get gameweek',
  })
  async getGameWeek(
    @Param('gameweekNumber') gameweekNumber: number,
  ): Promise<GetGameweekResponseDto> {
    return await this.gameweekService.getGameWeek(gameweekNumber);
  }

  @Post('match/add')
  @ApiOperation({ summary: 'Add matches' })
  @ApiResponse({
    status: 201,
    description: 'Add matches',
    type: Array<CreateMatchDto>,
  })
  async addMatchToGameweek(
    @Body() request: CreateMatchDto[],
  ): Promise<GetMatchResponseDto[]> {
    return await this.gameweekService.addMatchToGameweek(request);
  }

  @Get('/match/:gameweekNumber')
  @ApiOperation({ summary: 'Get matches for a gameweek' })
  @ApiResponse({
    status: 200,
    description: 'Get matches for a gameweek',
  })
  async getGameweekMatches(@Param('gameweekNumber') gameweekNumber: number) {
    return await this.gameweekService.getGameweekMatches(gameweekNumber);
  }

  @Put('match/updateScore')
  @ApiOperation({ summary: 'Update the score for a match' })
  @ApiResponse({
    status: 201,
    description: 'Update the score for a match',
    type: UpdateMatchScoreDto,
  })
  async updateMatchScore(
    @Body() request: UpdateMatchScoreDto,
  ): Promise<GetMatchResponseDto> {
    return await this.gameweekService.updateMatchScore(
      request.matchId,
      request.homeTeamScore,
      request.awayTeamScore,
    );
  }
}
