import {
    Injectable,
    Inject,
    UnauthorizedException,
    NotFoundException,
} from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigType } from '@nestjs/config';

import { JwtStrategies } from 'src/common/enums';
import jwtConfig from 'src/config/jwt.config';
import { IUserSession, TokenPayload } from 'src/common/types';
import { UserService } from 'src/modules/users/user.service';
import { extractJwtFromCookie } from 'src/common/utils';
import { SessionService } from 'src/modules/sessions/session.service';

@Injectable()
export class JwtAccessStrategy extends PassportStrategy(
    Strategy,
    JwtStrategies.AccessStrategy
) {
    constructor(
        @Inject(jwtConfig.KEY)
        private readonly jwt: ConfigType<typeof jwtConfig>,
        private readonly userService: UserService,
        private readonly sessionService: SessionService,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([
                extractJwtFromCookie('access_token')
            ]),
            ignoreExpiration: false,
            secretOrKey: jwt.secret,
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