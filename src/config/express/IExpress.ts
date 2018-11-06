import { Application } from "express";

export interface IExpress {
    app: Application;

    initEnvConfig(): void;

    checkEnvVariables(): void;

    connectMongoDB(): void;

    initMiddleware(): void;

    initHelmetHeaders(): void;

    bindContainer(): void;

    initApiRoutes(): void;

    callback(): void;

    getMyAppInstance(): Application;
}
