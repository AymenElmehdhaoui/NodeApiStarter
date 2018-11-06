import { IUsersController } from "../../../controllers/Users/IUsers.controller";
import { IUsersValidation } from "../../../middlewares/helpers/Validator/Users/IUsers.validator";

export interface IUsersApi {
    users: IUsersController;
    usersValidation: IUsersValidation;

    init(): void;
}