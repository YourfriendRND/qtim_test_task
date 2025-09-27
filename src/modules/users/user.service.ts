import { Injectable, Logger, Inject } from '@nestjs/common';
import { Repository } from 'typeorm'
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';

import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { IUser } from 'src/common/types';
import { RegisterUserDto } from '../auth/dto/register.dto';
import { ConfigType } from '@nestjs/config';
import commonConfig from 'src/config/common.config';

@Injectable()
export class UserService {
    private readonly logger = new Logger(UserService.name);

    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        @Inject(commonConfig.KEY)
        private readonly appConfig: ConfigType<typeof commonConfig>

    ) {}

    private hashPassword(password: string): string {
        const saltToken = this.appConfig.passwordSalt;
    
        const hmac = crypto.createHmac('sha256', saltToken);
        hmac.update(password);
        const pepperedPassword = hmac.digest('hex');
    
        const salt = bcrypt.genSaltSync(8);
        return bcrypt.hashSync(pepperedPassword, salt);
    }
 
    async create(dto: RegisterUserDto): Promise<IUser> {
        const { password } = dto;
        const user = this.userRepository.create({
            ...dto,
            password: this.hashPassword(password),
        });

        const createdUser = await this.userRepository.save(user);

        this.logger.log(`User created: ${createdUser.email}`);

        return createdUser;
    }

    async update() {}

    async findByEmail(email: string): Promise<IUser> {
        return this.userRepository.findOne({ where: { email } });
    }

    comparePassword(inputPassword: string, hashedPassword: string): boolean {
        const saltToken = this.appConfig.passwordSalt;
    
        const hmac = crypto.createHmac('sha256', saltToken);
        hmac.update(inputPassword);
        const hashedInput = hmac.digest('hex');
    
        return bcrypt.compareSync(hashedInput, hashedPassword);
    }

    async findById(id: string): Promise<IUser> {
        return this.userRepository.findOne({ 
            where: {
                id,
            },
            select: [
                'id',
                'name',
                'email',
                'updatedAt'
            ]
         })
    }
}
