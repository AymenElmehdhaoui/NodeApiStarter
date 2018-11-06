import { IUserDocument } from "./IUser.document";

// Methods
export interface IUser extends IUserDocument {
    toJSON(): any;

    generateAuthToken(user: IUser): Promise<any>;

}