import { Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';


@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User) private readonly userRepository: Repository<User>,
        private readonly jwtService: JwtService,
    ) { }

    async signIn(username: string, password: string): Promise<{ refresh_token: string, access_token: string }> {
        const user = await this.userRepository.findOne({ where: { username } });
        if (!user) {
            throw new UnauthorizedException();
        }
        const isPasswordMatch = await bcrypt.compare(password, user.hashedPassword);

        if (!isPasswordMatch) {
            throw new UnauthorizedException();
        }
        const { hashedPassword, refresh_token , ...payload } = user;
        const accessToken = await this.jwtService.signAsync(payload, { expiresIn: '1h' });
        const refreshToken = await this.jwtService.signAsync(payload, { expiresIn: '7d' });
        await this.userRepository.update(user.id, { refresh_token });
        return { 
            refresh_token : refreshToken, 
            access_token : accessToken 
        };

    }

    async refreshAccessToken(payload: any): Promise<{ access_token: string }> {
        return {
            access_token: await this.jwtService.signAsync(payload, { expiresIn: '1h' })
        }

    }

    async logout(id: string): Promise<void> {
        await this.userRepository.update(id, { refresh_token: null });
    }
}
