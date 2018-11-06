import { Router } from "express";
import { inject, injectable } from "inversify";

import { BaseApi } from "../Base/BaseApi";
import Options from "../../../config/Options";
import { IAuthController } from "../../../controllers/Auth/IAuthController";
import { IAuthValidation } from "../../../middlewares/helpers/Validator/Auth/IAuth.validator";
import { IAuthApi } from "./IAuth.api";

const {TYPES} = Options;

@injectable()
export class AuthApi extends BaseApi implements IAuthApi {
    auth: IAuthController;
    authValidation: IAuthValidation;

    constructor(
        @inject(TYPES.AuthController) authController: IAuthController,
        @inject(TYPES.AuthValidation) authValidation: IAuthValidation,
        @inject(TYPES.router) router: Router
    ) {
        super(
            router,
            "/auth",
            "userId"
        );
        this.auth = authController;
        this.authValidation = authValidation;
    }

    public init(): void {
        this.router.route(this.url.concat("/signup"))
            .post(this.authValidation.validateAddUser, this.auth.signup);
        this.router.route(this.url.concat("/signin"))
            .post(this.authValidation.validateSignin, this.auth.signin);

        this.router.route(this.url.concat("/forgot"))
            .post(this.authValidation.validateForgot, this.auth.forgot);

        this.router.route(this.url.concat("/password/reset/:resetPasswordToken"))
            .patch(this.authValidation.validateResetToken, this.auth.reset);

        this.router.route(this.url.concat("/confirmation"))
            .post(...this.authDoubleCheck, this.auth.confirmationEmail);
        this.router.route(this.url.concat("/confirmation/:userId"))
            .patch(this.authValidation.validateUserID, ...this.authDoubleCheck, this.auth.confirmation);
    }
}
