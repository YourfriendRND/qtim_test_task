import { Injectable, Inject } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-custom';
import { ConfigType } from '@nestjs/config';

import { JwtStrategies } from 'src/common/enums';
import jwtConfig from 'src/config/jwt.config';
import { UserService } from 'src/modules/users/user.service';
import { SessionService } from 'src/modules/sessions/session.service';
import { extractJwtFromCookie } from 'src/common/utils';
import { IUserSession, TokenPayload } from 'src/common/types';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class OptionalJwtStrategy extends PassportStrategy(Strategy, JwtStrategies.OptionalAccess) {
    constructor(
        @Inject(jwtConfig.KEY)
        private readonly jwt: ConfigType<typeof jwtConfig>,
        private readonly userService: UserService,
        private readonly sessionService: SessionService,
        private readonly jwtService: JwtService,
    ) {
        super()
    }

    async validate(req: Request): Promise<Partial<IUserSession>> {
        
        const token = extractJwtFromCookie('access_token')(req);

        if (!token) {
            return {
                id: null,
            };
        }

        // Верифицируем токен вручную
        const payload = this.jwtService.verify<TokenPayload>(token, {
            secret: this.jwt.secret,
        });

        try {
            if (!payload) {
                return null;
            }

            const user = await this.userService.findById(payload.sub);
    
            if (!user) {
                return null;
            }
    
            const session = await this.sessionService.findActiveById(payload.sessionId);

            if (!session) {
                return null;
            }

            return {
                ...user,
                sessionId: session.id,
            };
    
        } catch {
            return null;
        } 
    }
}
