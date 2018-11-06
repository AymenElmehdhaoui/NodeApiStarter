import { Model } from "mongoose";

import { IUser } from "./IUser";

// static
export interface IUserModel extends Model<IUser> {
    findByCredentials(email: string, password: string): Promise<any>;
}