import Mail = require("nodemailer/lib/mailer");
import { Request, Response } from "express";
import { IRequest } from "../../middlewares/helpers/IRequest.interface";

export interface IAuthController {
    smtpTransport: Mail;

    forgot(req: Request, res: Response): void;

    signup(req: Request, res: Response): void;

    signin(req: Request, res: Response): void;

    reset(req: IRequest, res: Response): void;

    confirmation(req: Request, res: Response): void;

    confirmationEmail(req: Request, res: Response): void;
}