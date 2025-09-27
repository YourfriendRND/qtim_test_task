import { Entity, Column, OneToMany } from 'typeorm';

import { IUser } from '../../../common/types';
import { CommonEntity } from '../../../common/types/common-entity';
import { Session } from 'src/modules/sessions/entities/session.entity';

@Entity('users')
export class User extends CommonEntity implements IUser {
    @Column({
        type: 'varchar',
    })
    name: string;

    @Column({
        type: 'varchar'
    })
    password: string;

    @Column({
        type: 'varchar'
    })
    email: string;

}
