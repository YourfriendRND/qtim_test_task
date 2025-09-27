import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThan, LessThanOrEqual } from 'typeorm';
import * as dayjs from 'dayjs';
import { Cron, CronExpression } from '@nestjs/schedule';

import { Session } from './entities/session.entity';
import { ISession, IUser } from 'src/common/types';
import { ConfigType } from '@nestjs/config';
import jwtConfig from 'src/config/jwt.config';
import { parseTimeToSeconds } from 'src/common/utils';

@Injectable()
export class SessionService {
    private readonly logger = new Logger(SessionService.name);
    
    constructor(
        @InjectRepository(Session)
        private readonly sessionRepository: Repository<Session>,

        @Inject(jwtConfig.KEY)
        private readonly jwt: ConfigType<typeof jwtConfig>,


    ) {}

    async createSession(user: IUser): Promise<ISession> {
        this.logger.log(`Start create session for user: ${user.id}`);
        return this.sessionRepository.save({
            expiredAt: dayjs().add(parseTimeToSeconds(this.jwt.refreshExpiresIn), 'seconds').toDate(),
            user,
        })
    }

    async findActiveById(id: string): Promise<ISession> {
        const session = await this.sessionRepository.findOne({
            where: {
                id,
                expiredAt: MoreThan(dayjs().toDate())
            }
        });

        if (!session) {
            throw new NotFoundException(`Session with id: ${id} not found`);
        }

        return session;
    }

    @Cron(CronExpression.EVERY_30_MINUTES)
    async removeAllExpired(): Promise<void> {
        const sessions = await this.sessionRepository.find({
            where: {
                expiredAt: LessThanOrEqual(dayjs().toDate())
            }
        });
        
        if (sessions.length) {
            await this.sessionRepository.remove(sessions);
            this.logger.log('All expired sessions has been removed');
        } else {
            this.logger.warn('Expired sessions not found');
        }
    }

    async removeById(id: string): Promise<void> {
        const session = await this.sessionRepository.findOne({
            where: {
                id
            }
        });

        if (!session) {
            throw new NotFoundException(`Session with id: ${id} not found`);
        }

        await this.sessionRepository.remove(session);

        this.logger.warn(`Session with id: ${id} has been removed`);
    }

}