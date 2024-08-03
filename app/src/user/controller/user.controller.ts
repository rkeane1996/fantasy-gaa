import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { UserService } from '../service/user.service';
import { GetUserResponseDto } from '../dto/get-user-response.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserAuthGuard } from '../../auth/guards/user-auth.guard';
import { GAAClub } from '../../../lib/common/enum/club';

@Controller('user')
@ApiTags('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @UseGuards(UserAuthGuard)
  @ApiOperation({ summary: 'Get Users' })
  @ApiResponse({
    status: 200,
    description: 'Users retrieved',
    type: [GetUserResponseDto],
  })
  async getUsers(): Promise<GetUserResponseDto[]> {
    return await this.userService.getUsers();
  }

  @Get(':id')
  @UseGuards(UserAuthGuard)
  @ApiOperation({ summary: 'Get User' })
  @ApiResponse({
    status: 200,
    description: 'User retrieved',
    type: GetUserResponseDto,
  })
  async getUser(@Param('id') id: string): Promise<GetUserResponseDto> {
    return await this.userService.getUser(id);
  }

  @Get('club/:clubName')
  @UseGuards(UserAuthGuard)
  @ApiOperation({ summary: 'Get Users from club' })
  @ApiResponse({
    status: 200,
    description: 'Users from club',
    type: [String],
  })
  async getUsersFromClub(@Param('clubName') club: GAAClub): Promise<string[]> {
    return await this.userService.findUsersByClub(club);
  }
}
