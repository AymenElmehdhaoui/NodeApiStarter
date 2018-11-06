import { IRequest } from "../../helpers/IRequest.interface";
import { NextFunction, Response } from "express";

export interface IAccessPolicy {
    isAllowed(req: IRequest, res: Response, next: NextFunction): void;
    isAuthenticated(req: IRequest, res: Response, next: NextFunction): void;
}