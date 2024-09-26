import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserDTO } from '../../user/dto/user.dto';
import { UserService } from '../../user/service/user.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async signUp(user: UserDTO): Promise<{ accesstoken: string }> {
    const doesUserExist = await this.userService.getUserbyEmail(user.email);
    if (doesUserExist) {
      throw new HttpException(
        `User already exists with that email: ${user.email}`,
        HttpStatus.BAD_REQUEST,
      );
    }
    const newUser = await this.userService.createUser(user);
    delete newUser.password;
    const payload: any = { email: newUser.email, sub: newUser.id };
    return {
      accesstoken: await this.jwtService.signAsync(payload),
    };
  }

  async signIn(
    username: string,
    password: string,
  ): Promise<{ accesstoken: string }> {
    const user = await this.userService.getUserbyEmail(username);
    if (!user) {
      throw new NotFoundException(`User not found by username: ${username}`);
    }

    if (!(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Password is incorrect');
    }
    delete user.password;
    const payload: any = { email: user.email, sub: user._id };

    return {
      accesstoken: await this.jwtService.signAsync(payload),
    };
  }
}
