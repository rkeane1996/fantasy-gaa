import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { CreateTeamDTO } from '../dto/create-team.dto';
import { TeamService } from '../service/team.service';
import { TeamTransferDTO } from '../dto/team-transfer.dto';
import { AddPointsDTO } from 'lib/common/dto/request/add-points.dto';
import { GetTeamResponseDto } from '../dto/get-team-dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { GetPointsResponseDto } from 'lib/common/dto/response/get-points-response.dto';

@Controller('team')
@ApiTags('team')
export class TeamController {
  constructor(private readonly teamService: TeamService) {}

  @Post('/add')
  @ApiOperation({ summary: 'Create a team' })
  @ApiResponse({
    status: 201,
    description: 'Team is created',
  })
  async addPlayer(@Body() requestdto: CreateTeamDTO): Promise<HttpStatus> {
    return await this.teamService.createTeam(requestdto);
  }

  @Put('/transfer')
  @ApiOperation({ summary: 'Make transfers for a team' })
  @ApiResponse({
    status: 201,
    description: 'Transfers made',
    type: GetTeamResponseDto,
  })
  @ApiResponse({
    status: 400,
    description:
      'Bad Request. Too many players from 1 county/More players in than out/Player not on team',
  })
  async makeTransfer(
    @Body() request: TeamTransferDTO,
  ): Promise<GetTeamResponseDto> {
    return await this.teamService.transferPlayers(request);
  }

  @Get(':userId')
  @ApiOperation({ summary: 'Get a users team' })
  @ApiResponse({
    status: 201,
    description: 'Users Team',
    type: GetTeamResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Team not found',
  })
  async getUsersTeam(@Param('id') userId: string): Promise<GetTeamResponseDto> {
    return await this.teamService.getTeamByUserId(userId);
  }

  @Post('addPoints')
  @ApiOperation({ summary: 'Add points to team' })
  @ApiResponse({
    status: 201,
    description: 'Points added to team',
    type: GetPointsResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Team not found',
  })
  async addTeamPoints(
    @Body() request: AddPointsDTO,
  ): Promise<GetPointsResponseDto> {
    return await this.teamService.addPoints(request);
  }

  @Get('points/:id')
  @ApiOperation({ summary: 'Get points for team' })
  @ApiResponse({
    status: 200,
    description: 'Points for Team',
    type: GetPointsResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Team not found',
  })
  async getTeamPoints(
    @Param('id') teamId: string,
  ): Promise<GetPointsResponseDto> {
    return await this.teamService.getTeamPoints(teamId);
  }
}
