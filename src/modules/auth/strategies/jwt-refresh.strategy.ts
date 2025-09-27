import { Inject, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtStrategies } from 'src/common/enums';

import jwtConfig from 'src/config/jwt.config';
import { SessionService } from 'src/modules/sessions/session.service';
import { UserService } from 'src/modules/users/user.service';
import { extractJwtFromCookie } from 'src/common/utils';
import { IUserSession, TokenPayload } from 'src/common/types';

export class JwtRefreshStrategy extends PassportStrategy(
    Strategy,
    JwtStrategies.RefreshStrategy
) {
    constructor(
        @Inject(jwtConfig.KEY)
        private readonly jwt: ConfigType<typeof jwtConfig>,
        private readonly sessionService: SessionService,
        private readonly userService: UserService,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([
                extractJwtFromCookie('refresh_token')
            ]),
            ignoreExpiration: false,
            secretOrKey: jwt.refreshSecret,
        })
    }

    async validate({ sub: id, sessionId }: TokenPayload): Promise<IUserSession> {
        try {

            const user = await this.userService.findById(id);
    
            if (!user) {
                throw new UnauthorizedException('Unauthorized');
            }
    
            const session = await this.sessionService.findActiveById(sessionId);

            return {
                ...user,
                sessionId: session.id,
            };
    
        } catch (err) {
            if (err instanceof NotFoundException) {
                throw new UnauthorizedException('Unauthorized');
            }

            throw err;
        }
    }

}