import { ICommonEntity } from './common-entity.type';
import { IUser } from './user.type';

export interface ISession extends ICommonEntity {
    expiredAt: Date,
    user: IUser,
}
