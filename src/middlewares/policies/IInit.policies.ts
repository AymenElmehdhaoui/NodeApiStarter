import { IAuthPolicy } from "./Auth/IAuth.policy";
import { IUsersPolicy } from "./Users/IUsers.policy";
import { IArticlesPolicy } from "./Articles/IArticles.policy";

export interface IInitPolicies  {
    authPolicy: IAuthPolicy;
    usersPolicy: IUsersPolicy;
    articlesPolicy: IArticlesPolicy;

    init(): void;
}