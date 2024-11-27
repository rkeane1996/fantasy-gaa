import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PointsServiceService } from '../service/points-service.service';
import { UpdatePointsDto } from '../dto/update-points.dto';
import { PlayerPerformanceDto } from '../../../src/match/dto/player-performance.dto';
import { RolesGuard } from '../../../src/auth/guards/roles.guard';
import { AuthGuard } from '../../../src/auth/guards/auth.guard';
import { Roles } from '../../../src/auth/decorators/roles.decorators';

@Controller('points-service')
@ApiTags('points-service')
export class PointsServiceController {
  constructor(private readonly pointsService: PointsServiceService) {}

  @Post('update/points')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(process.env.ADMIN_ROLE)
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
