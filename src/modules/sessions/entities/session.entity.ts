import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';

import { CommonEntity } from '../../../common/types/common-entity';
import { ISession, IUser } from '../../../common/types';
import { User } from '../../../modules/users/entities/user.entity';

@Entity('sessions')
export class Session extends CommonEntity implements ISession {
    
    @Column({
        name: 'expired_at',
        type: 'timestamp with time zone'
    })
    expiredAt: Date;

    @ManyToOne(() => User, (user) => user.id, {
        onDelete: 'CASCADE',
    })
    @JoinColumn({
        name: 'user_id'
    })
    user: IUser;

}

