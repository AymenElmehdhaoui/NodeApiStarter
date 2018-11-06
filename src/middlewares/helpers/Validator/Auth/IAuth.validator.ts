import { NextFunction, Request, Response } from "express";
import { IRequest } from "../../IRequest.interface";

export interface IAuthValidation {
    validateAddUser(req: Request, res: Response, next: NextFunction): void;

    validateSignin(req: Request, res: Response, next: NextFunction): void;

    validateForgot(req: Request, res: Response, next: NextFunction): void;

    validateResetToken(req: IRequest, res: Response, next: NextFunction): void;

    validateUserID(req: Request, res: Response, next: NextFunction): void;
}