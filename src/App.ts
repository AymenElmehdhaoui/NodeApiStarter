import express from "express";

import InitExpress from "./config/express/Express";
import { injectable } from "inversify";
import { IApp } from "./IApp";

@injectable()
export default class AppStarter extends InitExpress implements IApp {
    constructor() {
        const app = express();
        super(app);
    }

    public start(): express.Application {
        this.initEnvConfig();
        this.bindContainer();
        this.checkEnvVariables();
        this.connectMongoDB();
        this.initMiddleware();
        this.initHelmetHeaders();
        this.initApiRoutes();
        this.callback();
        return this.getMyAppInstance();
    }

}
