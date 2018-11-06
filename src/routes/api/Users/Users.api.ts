import { Router } from "express";
import { inject, injectable } from "inversify";

import { BaseApi } from "../Base/BaseApi";
import Options from "../../../config/Options";
import { IUsersApi } from "./IUsers.api";
import { IUsersController } from "../../../controllers/Users/IUsers.controller";
import { IUsersValidation } from "../../../middlewares/helpers/Validator/Users/IUsers.validator";

const {TYPES} = Options;

@injectable()
export class UsersApi extends BaseApi implements IUsersApi {
    users: IUsersController;
    usersValidation: IUsersValidation;


    constructor(
        @inject(TYPES.UsersController) usersController: IUsersController,
        @inject(TYPES.UsersValidation) usersValidation: IUsersValidation,
        @inject(TYPES.router) router: Router
    ) {
        super(
            router,
            "/users",
            "userId"
        );
        this.users = usersController;
        this.usersValidation = usersValidation;
    }

    public init(): void {

        this.router.route(this.url)
            .get(...this.authDoubleCheck, this.users.getAll)
            .post(this.usersValidation.validateAddUser, ...this.authDoubleCheck, this.users.create);

        this.router.route(this.url.concat("/me"))
            .get(...this.authDoubleCheck, this.users.getMe)
            .patch(...this.authDoubleCheck, this.users.updateMe)
            .delete(...this.authDoubleCheck, this.users.deleteMe, this.users.delete);

        this.router.route(this.url.concat("/:").concat(this.selectorId))
            .get(this.usersValidation.validateUserID, ...this.authDoubleCheck, this.users.read)
            .patch(this.usersValidation.validateUserID, ...this.authDoubleCheck, this.users.updateUser)
            .delete(this.usersValidation.validateUserID, ...this.authDoubleCheck, this.users.delete);

        // Finish by binding the User middleware
        this.router.param(this.selectorId, this.users.getByID);
    }
}