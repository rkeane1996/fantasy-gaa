import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { JoinLeagueDto } from '../dto/request/join-league.dto';
import { CreateLeagueDto } from '../dto/request/create-league.dto';
import { LeagueService } from '../service/league.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { GetLeagueResponseDto } from '../dto/response/get-league-reponse.dto';
import { Team } from 'lib/team/schema/team.schema';
import { AuthGuard } from '../../../src/auth/guards/auth.guard';
import { Roles } from '../../../src/auth/decorators/roles.decorators';
import { RolesGuard } from '../../../src/auth/guards/roles.guard';

@Controller('league')
@ApiTags('league')
export class LeagueController {
  constructor(private readonly leagueService: LeagueService) {}

  @Post('create')
  @ApiOperation({ summary: 'Create a league' })
  @ApiResponse({
    status: 201,
    description: 'League is created',
    type: GetLeagueResponseDto,
  })
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(process.env.ADMIN_ROLE, process.env.USER_ROLE)
  async createLeague(
    @Body() request: CreateLeagueDto,
  ): Promise<GetLeagueResponseDto> {
    return await this.leagueService.createLeague(request);
  }

  @Post('join')
  @ApiOperation({ summary: 'Join a league' })
  @ApiResponse({
    status: 201,
    description: 'Team joined league',
  })
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(process.env.ADMIN_ROLE, process.env.USER_ROLE)
  async joinLeague(@Body() request: JoinLeagueDto) {
    return await this.leagueService.joinLeague(request);
  }

  @Get('/')
  @ApiOperation({ summary: 'Get specific league' })
  @ApiResponse({
    status: 200,
    type: GetLeagueResponseDto,
  })
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(process.env.ADMIN_ROLE, process.env.USER_ROLE)
  async getLeague(
    @Query('leagueId') leagueId: string,
  ): Promise<GetLeagueResponseDto> {
    return await this.leagueService.getLeague(leagueId);
  }

  @Get('teams')
  @ApiOperation({ summary: 'Gets team id that are in a specific league' })
  @ApiResponse({
    status: 200,
    type: [String],
  })
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(process.env.ADMIN_ROLE, process.env.USER_ROLE)
  async getTeamsInLeague(@Query('leagueId') leagueId: string): Promise<Team[]> {
    return await this.leagueService.getTeamsInLeague(leagueId);
  }
}
