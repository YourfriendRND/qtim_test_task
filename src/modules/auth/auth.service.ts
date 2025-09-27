import { 
    Injectable, 
    Logger, 
    ConflictException, 
    NotFoundException, 
    UnauthorizedException, 
    Inject 
} from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

import { IUser, IUserSession, TokenPair, TokenPayload } from 'src/common/types';
import { RegisterUserDto } from './dto/register.dto';
import { UserService } from '../users/user.service';
import { LoginDTO } from './dto';
import jwtConfig from 'src/config/jwt.config';
import { SessionService } from '../sessions/session.service';

@Injectable()
export class AuthService {
    private readonly logger = new Logger(AuthService.name);

    constructor (
        private readonly userService: UserService,
        @Inject(jwtConfig.KEY)
        private readonly jwt: ConfigType<typeof jwtConfig>,
        private readonly jwtService: JwtService,
        private readonly sessionService: SessionService,
    ) {}

    private createAccessToken(payload: TokenPayload): string {
        return this.jwtService.sign(payload, {
          secret: this.jwt.secret,
          expiresIn: this.jwt.expiresIn,
        });
      }
    
    private createRefreshToken(payload: TokenPayload): string {
        return this.jwtService.sign(payload, {
          secret: this.jwt.refreshSecret,
          expiresIn: this.jwt.refreshExpiresIn,
        });
    }

    async register(dto: RegisterUserDto): Promise<IUser> {
        this.logger.log(`Register user: ${dto.email}`);
        const { email } = dto;
    
        const user = await this.userService.findByEmail(email);
    
        if (user) {
          throw new ConflictException(`User with email: ${email} already exists`);
        }
    
        return this.userService.create(dto);
    }

    async login(dto: LoginDTO): Promise<TokenPair> {
        const { email } = dto;

        const user = await this.userService.findByEmail(email);

        if (!user) {
        throw new NotFoundException(`User with email: ${email} not found`);
        }

        const isPasswordValid = this.userService.comparePassword(
            dto.password,
            user.password,
        );

        if (!isPasswordValid) {
            throw new UnauthorizedException('Invalid password');
        }

        const session = await this.sessionService.createSession(user);

        const payload = {
            sub: user.id,
            sessionId: session.id,
        }

        const accessToken = this.createAccessToken(payload);
        const refreshToken = this.createRefreshToken(payload);

        return {
            accessToken,
            refreshToken,
        };
    }

    async logout(user: IUserSession): Promise<string> {
        const { sessionId } = user;

        await this.sessionService.removeById(sessionId);

        return 'Logout successfuly'; 
    }

    async refresh(user: IUserSession): Promise<TokenPair> {
        await this.sessionService.removeById(user.sessionId);

        const session = await this.sessionService.createSession(user);

        const payload = {
            sub: user.id,
            sessionId: session.id,
        }

        const accessToken = this.createAccessToken(payload);
        const refreshToken = this.createRefreshToken(payload);

        return {
            accessToken,
            refreshToken,
        };
    }
}