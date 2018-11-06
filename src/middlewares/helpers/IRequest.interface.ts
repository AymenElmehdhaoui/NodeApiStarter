import { Request } from "express";

import { IUser } from "../../models/Users/Interfaces/IUser";

export interface IRequest extends Request {
    user: IUser;
    property: any;
    token: string;
}