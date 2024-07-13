import { CanActivate, ExecutionContext, ForbiddenException, Global, HttpException, Injectable, UnauthorizedException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthGuard implements CanActivate {

	constructor(
		private jwtService: JwtService,
		private configService: ConfigService
	) { }

	async canActivate( context: ExecutionContext): Promise<boolean> {
		const request = context.switchToHttp().getRequest<Request>();
		const access_token = this.extractTokenFromHeader(request);
		if (!access_token) {
			throw new HttpException('Authentication failed', 401);
		}
		try {
			const payload = await this.jwtService.verify(access_token, { secret: this.configService.get<string>('JWT_SECRET') });
			const { iat, exp, ...user } = payload;
			request['user'] = user;
		} catch (error) {
			throw new ForbiddenException();
		}
		return true;
	}

	private extractTokenFromHeader(request: Request): string | undefined {
		const [type, token] = request.headers.authorization?.split(' ') ?? [];
		return type === 'Bearer' ? token : undefined;
	}
}
