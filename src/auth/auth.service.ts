import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';


@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User) private readonly userRepository : Repository<User>,
        private readonly jwtService: JwtService,
    ) {}

    async signIn(username: string, password: string) : Promise<{refresh_token: string ,access_token:string}> {
        const user = await this.userRepository.findOne({ where: { username } });
        
        if (!user) {
            throw new UnauthorizedException();
        }
        const isPasswordMatch = await bcrypt.compare(password, user.hashedPassword);

        if(!isPasswordMatch){
            throw new UnauthorizedException();
        }
        const { hashedPassword, ...payload } = user;
        const access_token = await this.jwtService.signAsync(payload, {expiresIn: '1h'});
        const refresh_token = await this.jwtService.signAsync(payload, {expiresIn: '7d'});
        return {refresh_token, access_token};
        
    }

    async refreshAccessToken(user : any) : Promise<{access_token: string}>{
        const {iat, exp, ...payload} = user;
        return {
            access_token: await this.jwtService.signAsync(payload, {expiresIn: '1h'})
        }

    }
}
