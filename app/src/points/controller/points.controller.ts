import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PointsService } from '../service/points.service';
import { AdminAuthGuard } from '../../auth/guards/admin-auth.guard';
import { AddPoints } from '../dto/add-gameweek-points.dto';
import { AddGameweekPointsResponseDto } from '../dto/add-gameweek-points.response.dto';

@Controller('points')
@ApiTags('points')
export class PointsController {
  constructor(readonly pointService: PointsService) {}

  @Post('/add')
  @UseGuards(AdminAuthGuard)
  @ApiOperation({ summary: 'Add a Points to player and team' })
  @ApiResponse({
    status: 201,
    description: 'Add points to player and teams',
    type: AddPoints,
  })
  async addPlayerPoints(
    @Body() request: AddPoints,
  ): Promise<AddGameweekPointsResponseDto> {
    return await this.pointService.addPoints(request);
  }
}
