import { ICommonEntity } from './common-entity.type';
import { PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export abstract class CommonEntity implements ICommonEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @CreateDateColumn({
        name: 'created_at',
        type: 'timestamp with time zone',
        default: () => 'CURRENT_TIMESTAMP'
    })
    createdAt: Date;

    @UpdateDateColumn({
        name: 'updated_at',
        type: 'timestamp with time zone',
        default: () => 'CURRENT_TIMESTAMP',
        onUpdate: 'CURRENT_TIMESTAMP',
    })
    updatedAt: Date;
}
