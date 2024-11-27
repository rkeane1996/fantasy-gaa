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
import { EditTeamInfoDto } from '../dto/edit-team-dto';
import { AuthGuard } from '../../../src/auth/guards/auth.guard';
import { Roles } from '../../../src/auth/decorators/roles.decorators';
import { RolesGuard } from '../../../src/auth/guards/roles.guard';

@Controller('team')
@ApiTags('team')
export class TeamController {
  constructor(private readonly teamService: TeamService) {}

  @Post('/create')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(process.env.ADMIN_ROLE, process.env.USER_ROLE)
  @ApiOperation({ summary: 'Create a team' })
  @ApiResponse({
    status: 201,
    description: 'Team is created',
  })
  async createTeam(@Body() request: CreateTeamDTO): Promise<string> {
    return await this.teamService.createTeam(request);
  }

  @Put('/makePlayerTransfer')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(process.env.ADMIN_ROLE, process.env.USER_ROLE)
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
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(process.env.ADMIN_ROLE, process.env.USER_ROLE)
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
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(process.env.ADMIN_ROLE, process.env.USER_ROLE)
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
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(process.env.ADMIN_ROLE, process.env.USER_ROLE)
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
