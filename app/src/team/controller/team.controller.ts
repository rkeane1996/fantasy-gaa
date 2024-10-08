import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CreateTeamDTO } from '../dto/create-team.dto';
import { TeamService } from '../service/team.service';
import { TeamTransferDTO } from '../dto/team-transfer.dto';
import { GetTeamResponseDto } from '../dto/get-team-dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserAuthGuard } from '../../auth/guards/user-auth.guard';
import { EditTeamInfoDto } from '../dto/edit-team-dto';

@Controller('team')
@ApiTags('team')
export class TeamController {
  constructor(private readonly teamService: TeamService) {}

  @Post('/create')
  @UseGuards(UserAuthGuard)
  @ApiOperation({ summary: 'Create a team' })
  @ApiResponse({
    status: 201,
    description: 'Team is created',
  })
  async createTeam(@Body() request: CreateTeamDTO): Promise<string> {
    return await this.teamService.createTeam(request);
  }

  @Put('/makePlayerTransfer')
  @UseGuards(UserAuthGuard)
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

  @Get('/user')
  @UseGuards(UserAuthGuard)
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
  async getUsersTeam(
    @Query('userId') userId: string,
  ): Promise<GetTeamResponseDto> {
    return await this.teamService.getTeamByUserId(userId);
  }

  @Get()
  @UseGuards(UserAuthGuard)
  @ApiOperation({ summary: 'Get a team' })
  @ApiResponse({
    status: 201,
    description: 'Get Team',
    type: GetTeamResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Team not found',
  })
  async getTeam(@Query('teamId') teamId: string): Promise<GetTeamResponseDto> {
    return await this.teamService.getTeamByTeamId(teamId);
  }

  @Put('update')
  @UseGuards(UserAuthGuard)
  @ApiOperation({ summary: 'Update a teams info' })
  @ApiResponse({
    status: 201,
    description: 'Update Team info',
    type: GetTeamResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Team not found',
  })
  async updateTeam(
    @Body() editTeamInfoDto: EditTeamInfoDto,
  ): Promise<GetTeamResponseDto> {
    return await this.teamService.updateTeamInfo(editTeamInfoDto);
  }
}
