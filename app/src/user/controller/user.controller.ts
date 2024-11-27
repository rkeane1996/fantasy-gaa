import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { UserService } from '../service/user.service';
import { GetUserResponseDto } from '../dto/get-user-response.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { GAAClub } from '../../../lib/common/enum/club';
import { AuthGuard } from '../../../src/auth/guards/auth.guard';
import { Roles } from '../../../src/auth/decorators/roles.decorators';
import { RolesGuard } from '../../../src/auth/guards/roles.guard';
import { GetUserRequestDto } from '../dto/get-user-request.dto';

@Controller('user')
@ApiTags('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(process.env.ADMIN_ROLE, process.env.USER_ROLE)
  @ApiOperation({ summary: 'Get Users' })
  @ApiResponse({
    status: 200,
    description: 'Users retrieved',
    type: [GetUserResponseDto],
  })
  async getUsers(
    @Query() getUserRequestDto: GetUserRequestDto,
  ): Promise<GetUserResponseDto[]> {
    return await this.userService.getUsers(getUserRequestDto.userIds);
  }

  @Get('club')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(process.env.ADMIN_ROLE, process.env.USER_ROLE)
  @ApiOperation({ summary: 'Get Users from club' })
  @ApiResponse({
    status: 200,
    description: 'Users from club',
    type: [String],
  })
  async getUsersFromClub(@Query('clubName') club: GAAClub): Promise<string[]> {
    return await this.userService.findUsersByClub(club);
  }
}
