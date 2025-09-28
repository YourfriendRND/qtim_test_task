import { JwtService } from '@nestjs/jwt'
import { Module } from '@nestjs/common';

import { UserModule } from '../users/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtAccessStrategy } from './strategies/jwt-access.strategy';
import { SessionModule } from '../sessions/session.module';
import { JwtRefreshStrategy } from './strategies/jwt-refresh.strategy';
import { OptionalJwtStrategy } from './strategies/optional-jwt-access.strategy';


@Module({
    imports: [UserModule, SessionModule],
    controllers: [AuthController],
    providers: [
        AuthService, 
        JwtService, 
        JwtAccessStrategy,
        JwtRefreshStrategy,
        OptionalJwtStrategy,
    ],
    exports: [AuthService],
})
export class AuthModule {}