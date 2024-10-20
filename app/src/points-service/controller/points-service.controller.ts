import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AdminAuthGuard } from '../../../src/auth/guards/admin-auth.guard';
import { PointsServiceService } from '../service/points-service.service';
import { UpdatePointsDto } from '../dto/update-points.dto';
import { PlayerPerformanceDto } from '../../../src/match/dto/player-performance.dto';

@Controller('points-service')
@ApiTags('points-service')
export class PointsServiceController {
  constructor(private readonly pointsService: PointsServiceService) {}

  @Post('update/points')
  @UseGuards(AdminAuthGuard)
  @ApiOperation({ summary: 'Update points for player and team' })
  @ApiResponse({
    status: 201,
    description: 'Update points for player and team',
  })
  async updatePoints(
    @Body() updatePointsDto: UpdatePointsDto,
  ): Promise<PlayerPerformanceDto> {
    return this.pointsService.updatePoints(updatePointsDto);
  }
}
