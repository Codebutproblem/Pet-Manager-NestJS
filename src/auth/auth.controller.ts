import { Body, Controller, Delete, Get, Post, Request, UseGuards } from '@nestjs/common';
import { SignInDto } from './dto/signin.dto';
import { AuthService } from './auth.service';
import { RefreshGuard } from './guard/refresh.guard';
import { AuthGuard } from './guard/auth.guard';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('login')
    async signIn(@Body() signInDto: SignInDto): Promise<{access_token: string, refresh_token: string }> {
        const { access_token, refresh_token } = await this.authService.signIn(signInDto.username, signInDto.password);
        return {
            access_token,
            refresh_token,
        }
    }

    @UseGuards(RefreshGuard)
    @Get('refresh')
    async refreshAccessToken(@Request() request : Request): Promise<{ access_token: string }> {
        const user = request['user'];
        return await this.authService.refreshAccessToken(user);
    }

    @UseGuards(AuthGuard)
    @Delete('logout')
    async logout(@Request() request : Request): Promise<{ message: string }> {
        const user = request['user'];
        await this.authService.logout(user.id);
        return {
            message: 'Logout Success'
        }
    }
}
