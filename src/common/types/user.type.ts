import { ICommonEntity } from './common-entity.type';

export interface IUser extends ICommonEntity {
    name: string;
    password: string;
    email: string;
}

export interface IUserSession extends IUser {
    sessionId: string;
}
