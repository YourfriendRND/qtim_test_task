import { Controller, Post, Body, HttpCode, HttpStatus, Res, Inject, Get } from '@nestjs/common';
import * as dayjs from 'dayjs';
import { CookieOptions, Response } from 'express';
import { ApiOperation, ApiBody, ApiOkResponse, ApiConflictResponse, ApiUnauthorizedResponse } from '@nestjs/swagger';

import { RegisterUserDto, LoginDTO } from './dto';
import { UserRdo } from './rdo/user.rdo';
import { AuthService } from './auth.service';
import { fillResponseDto, parseTimeToSeconds } from 'src/common/utils';
import { CommonRdo, IUserSession } from 'src/common/types';
import { ConfigType } from '@nestjs/config';
import jwtConfig from 'src/config/jwt.config';
import { JWTGuard, UserRequest } from 'src/common/decorators';
import { JwtStrategies } from 'src/common/enums';

@Controller('auth')
export class AuthController {

    constructor(
        private readonly authService: AuthService,
        @Inject(jwtConfig.KEY)
        private readonly jwt: ConfigType<typeof jwtConfig>
    ) {}

    @ApiOperation({ summary: 'Регистрация пользователя' })
    @ApiBody({
        description: 'Набор данных для регистрации',
        type: RegisterUserDto,
    })
    @ApiOkResponse({
        description: 'Пользователь успешно зарегистрирован',
        type: UserRdo,
    })
    @ApiConflictResponse({
        example: 'User with email: user@example.com already exists',
        description: 'Пользователь с таким email уже существует',
    })
    @Post('register')
    async register(@Body() dto: RegisterUserDto): Promise<UserRdo> {
        const user = await this.authService.register(dto);

        return fillResponseDto(UserRdo, user);
    }

    @ApiOperation({ summary: 'Авторизация пользователя на площадке' })
    @ApiBody({
        type: LoginDTO,
        description: 'Данные для входа в систему',
    })
    @ApiOkResponse({
        description: 'Пользователь успешно авторизован',
        type: CommonRdo,
    })
    @ApiUnauthorizedResponse({
        description: 'Некорректные данные пользователя для входа',
        example: 'Invalid password or email'
    })
    @HttpCode(HttpStatus.OK)
    @Post('/login')
    async login(
        @Body() dto: LoginDTO,
        @Res() res: Response,
    ): Promise<Response<CommonRdo>> {
        const response = await this.authService.login(dto);
      
        const accessCookieOptions: CookieOptions = {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            expires: dayjs()
                .add(parseTimeToSeconds(this.jwt.expiresIn) * 1.5, 'second')
                .toDate(),
        };
      
        const refreshTokenCookieOptions: CookieOptions = {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            expires: dayjs()
                .add(
                parseTimeToSeconds(this.jwt.refreshExpiresIn) * 1.5,
                'second',
                )
                .toDate(),
        };

        return res
            .cookie('access_token', response.accessToken, accessCookieOptions)
            .cookie(
                'refresh_token',
                response.refreshToken,
                refreshTokenCookieOptions,
            )
            .status(HttpStatus.OK)
            .send({ message: 'Login successful' });
    }

    @ApiOperation({ summary: 'Выход из системы' })
    @ApiOkResponse({
        type: CommonRdo,
        description: 'Выход выполнен успешно',
    })
    @ApiUnauthorizedResponse({
        description: 'Пользователь неавторизован',
        example: 'Unauthorized'
    })
    @JWTGuard(JwtStrategies.AccessStrategy)
    @HttpCode(HttpStatus.OK)
    @Post('/logout')
    async logout(
        @UserRequest() user: IUserSession,
        @Res() res: Response,
    ): Promise<Response<CommonRdo>> {
        const responseMessage = await this.authService.logout(user);
        return res
            .clearCookie('access_token', {
                httpOnly: true,
                secure: true,
                sameSite: 'none',
            })
            .clearCookie('refresh_token', {
                sameSite: 'none',
                httpOnly: true,
                secure: true,
            })
            .status(HttpStatus.OK)
            .send({ message: responseMessage });
    }

    @ApiOperation({
        summary: 'Обновление токена доступа',
    })
    @ApiOkResponse({
        description: 'Пара токенов успешно обновлена',
        type: CommonRdo,
    })
    @ApiUnauthorizedResponse({
        description: 'Пользователь неавторизован',
        example: 'Unauthorized'
    })
    @JWTGuard(JwtStrategies.RefreshStrategy)
    @HttpCode(HttpStatus.OK)
    @Post('/refresh')
    async refreshToken(
        @UserRequest() user: IUserSession,
        @Res() res: Response,
    ): Promise<Response<CommonRdo>> {
        const {
            accessToken,
            refreshToken
        } = await this.authService.refresh(user);

        const accessCookieOptions: CookieOptions = {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            expires: dayjs()
                .add(parseTimeToSeconds(this.jwt.expiresIn) * 1.5, 'second')
                .toDate(),
        };
      
        const refreshTokenCookieOptions: CookieOptions = {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            expires: dayjs()
                .add(
                parseTimeToSeconds(this.jwt.refreshExpiresIn) * 1.5,
                'second',
                )
                .toDate(),
        };

        return res
            .cookie('access_token', accessToken, accessCookieOptions)
            .cookie(
                'refresh_token',
                refreshToken,
                refreshTokenCookieOptions,
            )
            .status(HttpStatus.OK)
            .send({ message: 'Refresh tokens has been executed successfully' });
    }

    @ApiOperation({
        summary: 'Получить данные текущего пользователя'
    })
    @ApiOkResponse({
        description: 'Данные пользователя',
        type: UserRdo
    })
    @ApiUnauthorizedResponse({
        description: 'Пользователь неавторизован',
        example: 'Unauthorized'
    })
    @JWTGuard(JwtStrategies.AccessStrategy)
    @Get('/me')
    async getSessionUser(
        @UserRequest() user: IUserSession
    ): Promise<UserRdo> {
        return fillResponseDto(UserRdo, user);
    }

}