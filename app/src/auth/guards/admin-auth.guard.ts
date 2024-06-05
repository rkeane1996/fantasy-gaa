import { CanActivate, ExecutionContext, UnauthorizedException } from "@nestjs/common";
import { Injectable } from "@nestjs/common/decorators/core/injectable.decorator";
import { JwtService } from "@nestjs/jwt";
import { authConstant } from "../constants/auth.constants";
import { Role } from "../constants/roles";
import { UserService } from "src/user/service/user.service";

@Injectable()
export class AdminAuthGuard implements CanActivate {

    constructor(private jwtService: JwtService,
      private userService: UserService) {
    }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const token = this.extractTokenFromHeader(request);

        if (!token) {
          throw new UnauthorizedException();
        }
        try {
          const payload = await this.jwtService.verifyAsync(
            token,
            {
              secret: authConstant.secret
            }
          );
        
          // 💡 We're assigning the payload to the request object here
          // so that we can access it in our route handlers
          request['user'] = payload;
        } catch(e) {
          throw new UnauthorizedException();
        }
        return await this.userService.getUserRole(request['user'].sub, Role.Admin)
      }
    
      private extractTokenFromHeader(request: any): string | undefined {
        const [type, token] = request.headers.authorization?.split(' ') ?? [];
        return type === 'Bearer' ? token : undefined;
      }   
}
