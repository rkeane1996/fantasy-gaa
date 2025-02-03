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
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateMatchDto } from '../dto/create-match.dto';
import { UpdateMatchScoreDto } from '../dto/update-match-score.dto';
import { GetMatchResponseDto } from '../dto/get-match-response.dto';
import { PlayerPerformanceDto } from '../dto/player-performance.dto';
import { AuthGuard } from '../../../src/auth/guards/auth.guard';
import { Roles } from '../../../src/auth/decorators/roles.decorators';
import { RolesGuard } from '../../../src/auth/guards/roles.guard';

@Controller('match')
@ApiTags('match')
export class MatchController {
  constructor(private readonly matchService: MatchService) {}

  @Post('create')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(process.env.ADMIN_ROLE)
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
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(process.env.ADMIN_ROLE)
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
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(process.env.ADMIN_ROLE, process.env.USER_ROLE)
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
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(process.env.ADMIN_ROLE, process.env.USER_ROLE)
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
}
