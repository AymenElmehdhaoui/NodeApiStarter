import { IAuthController } from "../../../controllers/Auth/IAuthController";
import { IAuthValidation } from "../../../middlewares/helpers/Validator/Auth/IAuth.validator";

export interface IAuthApi {
    auth: IAuthController;
    authValidation: IAuthValidation;

    init(): void;
}