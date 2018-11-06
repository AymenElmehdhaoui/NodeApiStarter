import { Response } from "express-serve-static-core";
import { injectable } from "inversify";

import { User } from "../../models/Users/User";
import { BaseService } from "../../services/Base.service";
import { IRequest } from "../../middlewares/helpers/IRequest.interface";
import { IUsersController } from "./IUsers.controller";
import { NextFunction } from "express";

@injectable()
export class UsersController extends BaseService implements IUsersController {
    constructor() {
        super(User);
    }

    updateMe = (req: IRequest, res: Response): void => {
        // For security raisin
        delete req.body._id;
        delete req.body.roles;
        delete req.body.password;
        delete req.body.email;
        delete req.body.isConfirmed;
        delete req.body.resetPasswordToken;
        delete req.body.resetPasswordExpires;
        delete req.body.passwordResetAt;

        User.findByIdAndUpdate(req.user._id, req.body).then(
            (result: any) => res.send(result)
        )
            .catch(
                (err: Error) => {
                    res.status(400).send({
                        message: err
                    });
                    // throw err;
                }
            );
        // req.property = req.body;
        // next();
    };
    deleteMe = (req: IRequest, res: Response, next: NextFunction): void => {
        req.property = req.user;
        next();
    };
    updateUser = (req: IRequest, res: Response): void => {
        // For security raisin
        delete req.body._id;
        delete req.body.password;
        delete req.body.email;
        delete req.body.isConfirmed;
        delete req.body.resetPasswordToken;
        delete req.body.resetPasswordExpires;
        delete req.body.passwordResetAt;

        User.findByIdAndUpdate(req.property._id, req.body).then(
            (result: any) => res.send(result)
        )
            .catch(
                (err: Error) => {
                    res.status(400).send({
                        message: err
                    });
                    // throw err;
                }
            );
        // req.property = req.body;
        // next();
    };

    getMe(req: IRequest, res: Response): void {
        res.send(req.user);
    }
}