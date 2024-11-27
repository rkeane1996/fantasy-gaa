import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Injectable } from '@nestjs/common/decorators/core/injectable.decorator';
import { JwtService } from '@nestjs/jwt';
import { authConstant } from '../constants/auth.constants';
import { Reflector } from '@nestjs/core';
import { UserRepository } from '../../../src/user/repository/user.repository';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private reflector: Reflector,
    private userRepository: UserRepository,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!roles) return false;

    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    const payload = await this.jwtService.verifyAsync(token, {
      secret: authConstant.secret,
    });

    request['user'] = payload.sub;
    const user = await this.userRepository.getUser(request['user']);

    if (!roles.includes(user.role)) {
      throw new ForbiddenException('Access denied. Insufficient permissions.');
    }
    return true;
  }

  private extractTokenFromHeader(request: any): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
