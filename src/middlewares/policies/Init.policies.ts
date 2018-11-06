import { inject, injectable } from "inversify";

import Options from "../../config/Options";
import { IAuthPolicy } from "./Auth/IAuth.policy";
import { IUsersPolicy } from "./Users/IUsers.policy";
import { IArticlesPolicy } from "./Articles/IArticles.policy";
import { IInitPolicies } from "./IInit.policies";

const {TYPES} = Options;

@injectable()
export class InitPolicies implements IInitPolicies {

    constructor(
        @inject(TYPES.AuthPolicy) public authPolicy: IAuthPolicy,
        @inject(TYPES.UsersPolicy) public usersPolicy: IUsersPolicy,
        @inject(TYPES.ArticlesPolicy) public articlesPolicy: IArticlesPolicy,
    ) {

    }

    public init(): void {
        this.authPolicy.invokeRolesPolicies();
        this.usersPolicy.invokeRolesPolicies();
        this.articlesPolicy.invokeRolesPolicies();
    }
}