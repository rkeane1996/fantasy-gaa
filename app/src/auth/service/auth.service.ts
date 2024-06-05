import { HttpException, HttpStatus, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserDTO } from 'src/user/dto/user.dto';
import { UserService } from 'src/user/service/user.service';
import { authConstant } from '../constants/auth.constants';

@Injectable()
export class AuthService {

    constructor(
        private userService: UserService,
        private jwtService: JwtService) { }

    async signUp(user: UserDTO): Promise<{ accesstoken: string }> {
        const doesUserExist = await this.userService.getUserbyEmail(user.email);
        if (doesUserExist) {
            throw new HttpException(`User already exists with that email: ${user.email}`, HttpStatus.BAD_REQUEST);
        }
        const newUser = await this.userService.createUser(user);
        delete newUser.password;
        let payload: any = { email: newUser.email, sub: newUser.userId };
        return {
            accesstoken: await this.jwtService.signAsync(payload),
        };
    }

    async signIn(username: string, password: string): Promise<{ accesstoken: string }> {
        const user = await this.userService.getUserbyEmail(username);
        if (!user) {
            throw new NotFoundException(`User not found by username: ${username}`);
          }

        if (!await bcrypt.compare(password, user.password)) {
            throw new UnauthorizedException('Password is incorrect');
        }
        delete user.password;
        let payload: any = { email: user.email, sub: user.userId };
       
        return {
            accesstoken: await this.jwtService.signAsync(payload),
        };
    }
}
