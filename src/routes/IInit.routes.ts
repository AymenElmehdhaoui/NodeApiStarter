import { Router } from "express";

import { AuthApi } from "./api/Auth/Auth.api";
import { UsersApi } from "./api/Users/Users.api";
import { ArticlesApi } from "./api/Articles/Articles.api";

export interface IInitRoutes {
    authApi: AuthApi;
    usersApi: UsersApi;
    articlesApi: ArticlesApi;
    router: Router;

    init(): void;
}