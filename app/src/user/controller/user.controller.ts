import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { UserService } from '../service/user.service';
import { UserDTO } from '../dto/user.dto';
import { GetUserResponseDto } from '../dto/get-user-response.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@Controller('user')
@ApiTags('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/add')
  @ApiOperation({ summary: 'Create User' })
  @ApiResponse({
    status: 201,
    description: 'User created',
  })
  async addUser(@Body() requestdto: UserDTO) {
    return await this.userService.createUser(requestdto);
  }

  @Delete('delete/:id')
  @ApiOperation({ summary: 'Delete User' })
  @ApiResponse({
    status: 202,
    description: 'User deleted',
  })
  async deleteUser(@Param('id') id: string) {
    await this.userService.deleteUser(id);
  }

  @Get()
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
  @ApiOperation({ summary: 'Get Users from club' })
  @ApiResponse({
    status: 200,
    description: 'Users from club',
    type: [String],
  })
  async getUsersFromClub(@Param('clubName') club: string): Promise<string[]> {
    return await this.userService.findUsersByClub(club);
  }
}
