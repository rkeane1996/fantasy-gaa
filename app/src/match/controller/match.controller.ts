import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { MatchService } from '../service/match.service';
import { AdminAuthGuard } from '../../../src/auth/guards/admin-auth.guard';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateMatchDto } from '../dto/create-match.dto';
import { UpdateMatchScoreDto } from '../dto/update-match-score.dto';
import { GetMatchResponseDto } from '../dto/get-match-response.dto';
import { PlayerPerformanceDto } from '../dto/player-performance.dto';
import { UpdatePlayerPerformanceDto } from '../dto/update-player-performance.dto';
import { UserAuthGuard } from '../../../src/auth/guards/user-auth.guard';

@Controller('match')
export class MatchController {
  constructor(private readonly matchService: MatchService) {}

  @Post('create')
  @UseGuards(AdminAuthGuard)
  @ApiOperation({ summary: 'Create a match' })
  @ApiResponse({
    status: 201,
    description: 'Match is created',
  })
  async createMatch(
    @Body() createMatchDto: CreateMatchDto,
  ): Promise<GetMatchResponseDto> {
    return this.matchService.createMatch(createMatchDto);
  }

  @Put('score')
  @UseGuards(AdminAuthGuard)
  @ApiOperation({ summary: 'Update the score for a match' })
  @ApiResponse({
    status: 201,
    description: 'Update the score for a match',
    type: UpdateMatchScoreDto,
  })
  async updateMatchScore(
    @Body() updateMatchScoreDto: UpdateMatchScoreDto,
  ): Promise<GetMatchResponseDto> {
    return this.matchService.updateMatchScore(updateMatchScoreDto);
  }

  @Get()
  @UseGuards(UserAuthGuard)
  @ApiOperation({ summary: 'Get match' })
  @ApiResponse({
    status: 200,
    description: 'Get match',
  })
  async getMatch(
    @Query('matchId') matchId: string,
  ): Promise<GetMatchResponseDto> {
    return await this.matchService.getMatch(matchId);
  }

  @Get('players')
  @UseGuards(UserAuthGuard)
  @ApiOperation({ summary: 'Get players in match' })
  @ApiResponse({
    status: 200,
    description: 'Get players match',
  })
  async getMatchPlayers(
    @Query('matchId') matchId: string,
  ): Promise<PlayerPerformanceDto[]> {
    return await this.matchService.getMatchPlayers(matchId);
  }

  @Put('player/performance')
  @UseGuards(AdminAuthGuard)
  @ApiOperation({ summary: 'Update players performance in match' })
  @ApiResponse({
    status: 201,
    description: 'Update players performance',
  })
  async update(
    @Body() updatePlayerPerformanceDto: UpdatePlayerPerformanceDto,
  ): Promise<PlayerPerformanceDto> {
    return await this.matchService.updatePlayerPerformance(
      updatePlayerPerformanceDto,
    );
  }
}
