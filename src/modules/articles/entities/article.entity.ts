import { Column, Entity, JoinColumn, ManyToOne, Check } from 'typeorm';

import { IArticle, IUser, CommonEntity } from '../../../common/types';
import { ArticleStatus } from '../../../common/enums';
import { User } from '../../../modules/users/entities/user.entity';

@Entity('articles')
// Если статус статьи = Draft то, дату публикации NULL 
// Если статус статьи = Published то, дата публикации ОБЯЗАТЕЛЬНА
@Check(`(status = '${ArticleStatus.Draft}' AND "published_at" IS NULL) OR 
        (status = '${ArticleStatus.Published}' AND "published_at" IS NOT NULL)`)
// Если статус статьи = Published то, ОБЯЗАТЕЛЬНО должно быть описание
@Check(`status != '${ArticleStatus.Published}' OR description IS NOT NULL`)
export class Article extends CommonEntity implements IArticle {
    @Column({
        type: 'varchar',
        length: 255
    })
    name: string;

    @Column({
        type: 'text',
        nullable: true, // только для draft
    })
    description?: string;

    @Column({
        enum: ArticleStatus,
        default: ArticleStatus.Draft
    })
    status: ArticleStatus;

    @Column({
        name: 'published_at',
        type: 'timestamp with time zone',
        nullable: true, // только для draft
    })
    publishedAt?: Date;

    @ManyToOne(() => User, (user) => user.id, {
        onDelete: 'CASCADE'
    })
    @JoinColumn({
        name: 'user_id',
    })
    author: IUser;
}
