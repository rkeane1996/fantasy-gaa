import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from '../service/auth.service';
import { LoginDTO } from '../dto/login.dto';
import { UserDTO } from 'src/user/dto/user.dto';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Post('/signUp')
    async signUp(@Body() signUpDto: UserDTO) {
        return await this.authService.signUp(signUpDto);
    }

    @Post('/login')
    async signIn(@Body() signInDto: LoginDTO) {
        return await this.authService.signIn(signInDto.username, signInDto.password);
    }
}
