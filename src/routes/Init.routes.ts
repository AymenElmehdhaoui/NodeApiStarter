import { Router } from "express";
import { inject, injectable } from "inversify";

import { UsersApi } from "./api/Users/Users.api";
import { ArticlesApi } from "./api/Articles/Articles.api";
import { AuthApi } from "./api/Auth/Auth.api";
import Options from "../config/Options";
import { IInitRoutes } from "./IInit.routes";

const {TYPES} = Options;

@injectable()
export class InitRoutes implements IInitRoutes {
    authApi: AuthApi;
    usersApi: UsersApi;
    articlesApi: ArticlesApi;
    router: Router;

    constructor(
        @inject(TYPES.AuthApi) authApi: AuthApi,
        @inject(TYPES.UsersApi) usersApi: UsersApi,
        @inject(TYPES.ArticlesApi) articlesApi: ArticlesApi,
        @inject(TYPES.router) router: Router
    ) {
        this.authApi = authApi;
        this.usersApi = usersApi;
        this.articlesApi = articlesApi;
        this.router = router;
    }

    public init() {
        this.authApi.init();
        this.usersApi.init();
        this.articlesApi.init();
    }
}