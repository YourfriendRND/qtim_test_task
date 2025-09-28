import { ArticleStatus } from '../enums';
import { ICommonEntity } from './common-entity.type';
import { IUser } from './user.type';

export interface IArticle extends ICommonEntity {
    name: string;
    description?: string;
    publishedAt?: Date;
    status: ArticleStatus;
    author: IUser;
}