import { NextFunction, Request, Response } from "express";
import { isEmail } from "validator";
import { isEmpty, isEqual, pick } from "lodash";
import { injectable } from "inversify";

import { IRequest } from "../../IRequest.interface";
import { User } from "../../../../models/Users/User";
import { BaseValidation } from "../Base.validator";
import { IAuthValidation } from "./IAuth.validator";

@injectable()
export class AuthValidation extends BaseValidation implements IAuthValidation {
    validateUserID = (req: Request, res: Response, next: NextFunction) => {
        this.validateID(req, res, next);
    };

    constructor() {
        super("userId");
    }

    public validateAddUser(req: Request, res: Response, next: NextFunction): void {
        const body = pick(req.body, ["firstName", "lastName", "email", "password", "passwordConfirmation"]);

        if (isEmpty(body.firstName)) {
            res.status(400).send({
                message: "firstName is required"
            });
        } else if (isEmpty(body.lastName)) {
            res.status(400).send({
                message: "lastName is required"
            });
        } else if (!isEqual(body.password, body.passwordConfirmation)) {
            res.status(400).send({
                message: "password and passwordConfirmation are not isEqual"
            });
        } else if (isEmpty(body.password)) {
            res.status(400).send({
                message: "Passwords is required"
            });
        } else if (isEmpty(body.email)) {
            res.status(400).send({
                message: "Email is required"
            });
        } else if (!isEmail(body.email)) {
            res.status(400).send({
                message: "Email is not valid"
            });
        } else {
            next();
        }
    }

    public validateSignin(req: Request, res: Response, next: NextFunction): void {
        const body = pick(req.body, ["email", "password"]);

        if ((isEmpty(body.email) || isEmpty(body.password))) {
            res.status(400).send({
                message: "Passwords must not be empty"
            });
        } else if (!isEmail(body.email)) {
            res.status(400).send({
                message: "Email is not valid"
            });
        } else {
            next();
        }
    }

    public validateForgot(req: Request, res: Response, next: NextFunction): void {
        const email = pick(req.body, ["email"]).email;

        if (!isEmail(email)) {
            res.status(400).send({
                message: "Email is not valid"
            });
        } else {
            next();
        }
    }

    public validateResetToken(req: IRequest, res: Response, next: NextFunction): void {
        const body = pick(req.body, ["newPassword", "verifyPassword"]);

        if (isEmpty(req.params.resetPasswordToken)) {
            res.status(400).send({
                message: "Reset password token must not be empty"
            });
        } else if (isEmpty(body.newPassword) || isEmpty(body.verifyPassword)) {
            res.status(400).send({
                message: "Password and confirmation most not be empty"
            });
        } else if (!isEqual(body.newPassword, body.verifyPassword)) {
            res.status(400).send({
                message: "Passwords do not match"
            });
        }

        User.findOne({
            resetPasswordToken: req.params.resetPasswordToken,
            resetPasswordExpires: {
                $gt: Date.now()
            }
        }).then((user) => {
            if (!user) {
                return res.status(400).send({
                    message: "Password reset token is invalid or has expired."
                });
            }
            req.property = user;

            return next();
        });
    }

}
