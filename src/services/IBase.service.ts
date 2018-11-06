import { NextFunction, Request, Response } from "express";
import { Document, Model } from "mongoose";

import { IRequest } from "../middlewares/helpers/IRequest.interface";

export interface IBaseService {
    schema: Model<Document>;

    create(req: IRequest, res: Response): void;

    update(req: IRequest, res: Response): void;

    delete(req: IRequest, res: Response): void;

    getAll(req: Request, res: Response): void;

    getByID(req: IRequest, res: Response, next: NextFunction, id: string): void;

    read(req: IRequest, res: Response): void;
}