import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PointsService } from '../service/points.service';
import { AddPlayerGameweekPoints } from '../dto/request/add-player-gameweek-points.dto';
import { AddTeamGameweekPoints } from '../dto/request/add-team-gameweek-points.dto';
import { GetGameweekPointsResponse } from '../dto/response/get-gameweek-points.dto';
import { GetTeamGameweekPoints } from '../dto/request/get-team-gameweek-points.dto';
import { GetPlayerGameweekPoints } from '../dto/request/get-player-gameweek-points.dto';
import { AddPointTypes } from '../dto/request/add-point-type.dto';
import { Points } from '../schema/points.schema';
import { AdminAuthGuard } from '../../auth/guards/admin-auth.guard';

@Controller('points')
@ApiTags('points')
export class PointsController {
  constructor(readonly pointService: PointsService) {}

  @Post('/add-player-points')
  @UseGuards(AdminAuthGuard)
  @ApiOperation({ summary: 'Add a Player Points' })
  @ApiResponse({
    status: 201,
    description: 'Add player points',
    type: AddPlayerGameweekPoints,
  })
  async addPlayerPoints(
    @Body() requestdto: AddPlayerGameweekPoints,
  ): Promise<void> {
    return await this.pointService.addPlayerPoints(requestdto);
  }

  @Post('/add-gameweek-team-points')
  @UseGuards(AdminAuthGuard)
  @ApiOperation({ summary: 'Add a team Points' })
  @ApiResponse({
    status: 201,
    description: 'Add team points',
    type: AddTeamGameweekPoints,
  })
  async addTeamPoints(
    @Body() requestdto: AddTeamGameweekPoints,
  ): Promise<void> {
    return await this.pointService.lockGameWeekTeam(requestdto);
  }

  @Get('/team-points')
  @UseGuards(AdminAuthGuard)
  @ApiOperation({ summary: 'Get a team Points' })
  @ApiResponse({
    status: 200,
    description: 'Get team points over gameweeks',
    type: AddTeamGameweekPoints,
  })
  async getTeamPoints(
    @Body() requestdto: GetTeamGameweekPoints,
  ): Promise<GetGameweekPointsResponse> {
    return await this.pointService.getTeamPoints(requestdto);
  }

  @Get('/player-points')
  @UseGuards(AdminAuthGuard)
  @ApiOperation({ summary: 'Get a player Points' })
  @ApiResponse({
    status: 200,
    description: 'Get player points over gameweeks',
    type: AddTeamGameweekPoints,
  })
  async getPlayerPoints(
    @Body() requestdto: GetPlayerGameweekPoints,
  ): Promise<GetGameweekPointsResponse> {
    return await this.pointService.getPlayerPoints(requestdto);
  }

  @Post('/add-new-point-type')
  @UseGuards(AdminAuthGuard)
  @ApiOperation({ summary: 'Add new Point type' })
  @ApiResponse({
    status: 201,
    description: 'Add a new point type to be assigned to players',
    type: AddPointTypes,
  })
  async addPointType(@Body() requestdto: AddPointTypes) {
    await this.pointService.addPointTypes(requestdto);
  }

  @Get('/get-point-type')
  @UseGuards(AdminAuthGuard)
  @ApiOperation({ summary: 'Add new Point type' })
  @ApiResponse({
    status: 200,
    description: 'Add a new point type to be assigned to players',
  })
  async getPointTypes(): Promise<Points[]> {
    return await this.pointService.getPointTypes();
  }
}
