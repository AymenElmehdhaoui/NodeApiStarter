import { Container } from "inversify";

import { createTransport } from "nodemailer";
import { AuthController } from "../controllers/Auth/Auth.controller";
import { AuthApi } from "../routes/api/Auth/Auth.api";
import { UsersApi } from "../routes/api/Users/Users.api";
import { ArticlesApi } from "../routes/api/Articles/Articles.api";
import { UsersController } from "../controllers/Users/Users.controller";
import { ArticlesController } from "../controllers/Articles/Articles.controller";
import Options from "../config/Options";
import { IAuthController } from "../controllers/Auth/IAuthController";
import { IAuthValidation } from "./helpers/Validator/Auth/IAuth.validator";
import { IArticlesController } from "../controllers/Articles/IArticles.controller";
import { IArticlesApi } from "../routes/api/Articles/IArticles.api";
import { IUsersController } from "../controllers/Users/IUsers.controller";
import { IAuthApi } from "../routes/api/Auth/IAuth.api";
import { IUsersApi } from "../routes/api/Users/IUsers.api";
import { AuthValidation } from "./helpers/Validator/Auth/Auth.validator";
import { IArticlesValidation } from "./helpers/Validator/Articles/IArticles.validator";
import { ArticlesValidation } from "./helpers/Validator/Articles/Articles.validator";
import { IUsersValidation } from "./helpers/Validator/Users/IUsers.validator";
import { UsersValidation } from "./helpers/Validator/Users/Users.validator";
import Mail = require("nodemailer/lib/mailer");

import { IArticlesPolicy } from "./policies/Articles/IArticles.policy";
import { ArticlesPolicy } from "./policies/Articles/Articles.policy";
import { AuthPolicy } from "./policies/Auth/Auth.policy";
import { IAuthPolicy } from "./policies/Auth/IAuth.policy";
import { UsersPolicy } from "./policies/Users/Users.policy";
import { IUsersPolicy } from "./policies/Users/IUsers.policy";

export class DIContainerClass {
    static DIContainer: Container;
    static TYPES = Options.TYPES;

    static init(): Container {
        if (!this.DIContainer)
            this.DIContainer = new Container();
        this.DIContainer.bind<Mail>(this.TYPES.smtpTransport).toConstantValue(
            createTransport(
                Options.smtpTransportOptions
            )
        );
        this.DIContainer.bind<IAuthController>(this.TYPES.AuthController).to(AuthController);
        this.DIContainer.bind<IAuthValidation>(this.TYPES.AuthValidation).to(AuthValidation);
        this.DIContainer.bind<IAuthApi>(this.TYPES.AuthApi).to(AuthApi);
        this.DIContainer.bind<IAuthPolicy>(this.TYPES.AuthPolicy).to(AuthPolicy);

        this.DIContainer.bind<IArticlesController>(this.TYPES.ArticlesController).to(ArticlesController);
        this.DIContainer.bind<IArticlesValidation>(this.TYPES.ArticlesValidation).to(ArticlesValidation);
        this.DIContainer.bind<IArticlesApi>(this.TYPES.ArticlesApi).to(ArticlesApi);
        this.DIContainer.bind<IArticlesPolicy>(this.TYPES.ArticlesPolicy).to(ArticlesPolicy);

        this.DIContainer.bind<IUsersController>(this.TYPES.UsersController).to(UsersController);
        this.DIContainer.bind<IUsersValidation>(this.TYPES.UsersValidation).to(UsersValidation);
        this.DIContainer.bind<IUsersApi>(this.TYPES.UsersApi).to(UsersApi);
        this.DIContainer.bind<IUsersPolicy>(this.TYPES.UsersPolicy).to(UsersPolicy);

        return this.DIContainer;
    }

    static pushBind<T>(value: any, selector: symbol): T {
        if (!this.DIContainer)
            this.DIContainer = new Container();

        this.DIContainer.bind<T>(selector).to(value);
        return this.DIContainer.resolve(value);
    }

    static pushConstant<T>(value: T, selector: symbol) {
        this.DIContainer.bind<T>(selector).toConstantValue(value);
    }
}