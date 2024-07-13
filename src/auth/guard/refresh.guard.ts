import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { Request } from "express";
@Injectable()
export class RefreshGuard implements CanActivate{
    constructor(
        private readonly jwtService: JwtService, 
        private readonly configService: ConfigService
    ) {}
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const refresh_token = this.extractTokenFromHeader(request);
        if (!refresh_token) {
            return false;
        }

        try {
            const payload = await this.jwtService.verify(refresh_token, { secret: this.configService.get<string>('JWT_SECRET') });
            const { iat, exp, ...user } = payload;
            request['user'] = user;
        } catch (error) {
            throw new UnauthorizedException();
        }
        return true;
    }
    private extractTokenFromHeader(request: Request): string | undefined {
		const [type, token] = request.headers.authorization?.split(' ') ?? [];
		return type === 'Bearer' ? token : undefined;
	}
}