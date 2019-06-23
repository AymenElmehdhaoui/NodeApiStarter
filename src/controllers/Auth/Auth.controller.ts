import { resolve } from "path";
import { pick } from "lodash";
import { randomBytes } from "crypto";
import { Request, Response } from "express";
import { inject, injectable } from "inversify";

import EmailTemplates from "swig-email-templates";
import { User } from "../../models/Users/User";
import { IRequest } from "../../middlewares/helpers/IRequest.interface";
import { IUser } from "../../models/Users/Interfaces/IUser";
import Options from "../../config/Options";
import { IAuthController } from "./IAuthController";
import Mail = require("nodemailer/lib/mailer");
import { USER } from "../../config/roles.config";

const {TYPES} = Options;

@injectable()
export class AuthController implements IAuthController {
    constructor(
        @inject(TYPES.smtpTransport) public smtpTransport: Mail
    ) {
    }

    forgot(req: Request, res: Response): void {
        const email = pick(req.body, ["email"]).email;

        User.findOne({email})
            .then((user: IUser) => {
                if (!user) {
                    return res.status(400).send({
                        message: "user with email " + email + " not found"
                    });
                }
                const resetPasswordToken = randomBytes(20).toString("hex");
                user.resetPasswordToken = resetPasswordToken;
                user.resetPasswordExpires = new Date(Date.now() + 3600000); // 1 hour

                user.save().then(() => {
                    const templates = new EmailTemplates();
                    const templatePath = resolve("dist/templates/reset-password-email.server.view.html");

                    const variableInTemplate = {
                        name: user.firstName + " " + user.lastName,
                        url: process.env.CLIENT_SIDE_URL + "/auth/password/validate/" + resetPasswordToken
                    };

                    templates.render(templatePath, variableInTemplate, (err: Error, html: string, text: string) => {
                        if (err) {
                            res.status(400).send({
                                message: "cannot read email template"
                            });
                            // throw err;
                        }
                        const mailOptions = {
                            to: user.email as string,
                            from: process.env.MAILER_FROM,
                            subject: "Password Reset",
                            html: html,
                            text: text
                        };

                        this.sendMail(mailOptions, res);
                    });
                });
            })
            .catch(() => {
                res.status(400).send({
                    message: "user with email " + email + " not found"
                });
                // throw err;
            });
    }

    signup(req: Request, res: Response): void {
        const body = pick(req.body, ["firstName", "lastName", "email", "password"]);
        const user = new User(body);

        user.save().then(() => {
            return user.generateAuthToken(user);
        }).then((token: string) => {
            res.send({token, user: user.toJSON()});
        }).catch((err: Error) => {
            res.status(400).send({
                message: err
            });
            // throw err;
        });
    }

    signin(req: Request, res: Response): void {
        const body = pick(req.body, ["email", "password"]);

        User.findByCredentials(body.email, body.password)
            .then((user: IUser) => {
                user.generateAuthToken(user).then((token: string) => {
                    res.send({token, user: user.toJSON()});
                });
            })
            .catch(() => {
                res.status(400).send({
                    message: "user with email and password not found"
                });
                // throw err;
            });
    }

    reset(req: IRequest, res: Response): void {
        const body = pick(req.body, ["newPassword", "verifyPassword"]);

        const user = new User(req.property);
        user.password = body.newPassword;
        user.passwordResetAt = Date.now();
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        user.save()
            .then(() => {
                user.generateAuthToken(user)
                    .then((token: string) => {
                        let errorToSend = undefined;

                        try {
                            // send template to email
                            const templates = new EmailTemplates();
                            const templatePath = resolve("dist/templates/reset-password-confirm-email.server.view.html");

                            const variableInTemplate = {
                                name: user.firstName + " " + user.lastName
                            };

                            templates.render(templatePath, variableInTemplate, (err: Error, html: string, text: string) => {
                                if (err)
                                    errorToSend = err;
                                else {
                                    const mailOptions = {
                                        to: user.email as string,
                                        from: process.env.MAILER_FROM,
                                        subject: "Your password has been changed",
                                        html: html,
                                        text: text
                                    };

                                    this.smtpTransport.sendMail(mailOptions, (err: Error) => {
                                        if (err)
                                            errorToSend = err;
                                    });
                                }
                            });
                        } catch (exception) {
                            console.log(exception);
                        }
                        finally {
                            const toSend: any = {
                                user: user.toJSON(),
                                token: token
                            };
                            if (errorToSend)
                                toSend.error = errorToSend;
                            res.send(toSend);
                        }
                    });
            }).catch((err: Error) => {
            if (err) {
                res.status(400).send({
                    message: err
                });
                // throw err;
            }
        });
    }

    confirmation(req: Request, res: Response): void {
        const {userID} = req.params;

        User.findById(userID)
            .then((user: IUser) => {
                if (!user.isConfirmed) {
                    user.roles = [USER];
                    user.isConfirmed = true;
                    user.save()
                        .then(() => {
                            res.status(200).send({
                                message: "Your account is confirmed"
                            });
                        });
                } else {
                    res.status(200).send({
                        message: "Your account is already confirmed"
                    });
                }

            })
            .catch(() => {
                res.status(400).send({
                    message: "user not found"
                });
                // throw err;
            });
    }

    confirmationEmail(req: Request, res: Response): void {
        const user = (req as any).user;
        const templates = new EmailTemplates();
        const templatePath = resolve("dist/templates/confirm-email-account.server.view.html");

        const variableInTemplate = {
            name: user.firstName + " " + user.lastName,
            url: process.env.CLIENT_SIDE_URL + "/auth/confirmation/" + user._id
        };

        templates.render(templatePath, variableInTemplate, (err: Error, html: string, text: string) => {
            if (err) {
                res.status(400).send({
                    message: "cannot read email template"
                });
                // throw err;
            } else {
                const mailOptions = {
                    to: user.email,
                    from: process.env.MAILER_FROM,
                    subject: "Please confirm your email",
                    html: html,
                    text: text
                };

                this.sendMail(mailOptions, res);
            }
        });
    }

    private sendMail(mailOptions: any, res: Response) {
        this.smtpTransport.sendMail(mailOptions, (err: Error) => {
            if (!err) {
                res.send({
                    message: "An email has been sent to the provided email with further instructions."
                });
            } else {
                res.status(400).send({
                    message: "Failure sending email"
                });
                // throw err;
            }
        });
    }
}
