import { Response } from "express-serve-static-core";

import { IRequest } from "../../middlewares/helpers/IRequest.interface";
import { IBaseService } from "../../services/IBase.service";
import { NextFunction } from "express";

export interface IUsersController extends IBaseService {
    getMe(req: IRequest, res: Response): void;

    updateMe(req: IRequest, res: Response): void;

    deleteMe(req: IRequest, res: Response, next: NextFunction): void;

    updateUser(req: IRequest, res: Response): void;
}
