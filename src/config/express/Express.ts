import dotenv from "dotenv";
import bodyParser from "body-parser";
import methodOverride from "method-override";
import helmet from "helmet";
import compression from "compression";
import winston from "winston";
import rateLimit from "express-rate-limit";
import express, { Router } from "express";
import chalk from "chalk";
import http from "http";
import fs from "fs";
import path from "path";
import https from "https";
import terminus from "@godaddy/terminus";
import morgan from "morgan";
import errorHandler from "errorhandler";
import { injectable, unmanaged } from "inversify";

import { MongoConnect } from "../Mongoose";
import { InitRoutes } from "../../routes/Init.routes";
import { InitPolicies } from "../../middlewares/policies/Init.policies";
import Options from "../Options";
import { AclInstance } from "../../middlewares/helpers/acl.instance";
import { DIContainerClass } from "../../middlewares/DIContainer";
import { IExpress } from "./IExpress";
import { IInitRoutes } from "../../routes/IInit.routes";
import { IInitPolicies } from "../../middlewares/policies/IInit.policies";

@injectable()
export default class InitExpress implements IExpress {
    constructor(
        @unmanaged() public app: express.Application
    ) {
    }

    initEnvConfig(): void {
        const result = dotenv.config();
        if (result.error) {
            throw result.error;
        }
    }

    bindContainer() {
        DIContainerClass.init();
    }

    checkEnvVariables(): void {
        const alert = "Set env variable";
        if (!process.env.NODE_ENV)
            console.log(chalk.red(alert, "NODE_ENV"));
        if (!process.env.API_ROOT)
            console.log(chalk.red(alert, "API_ROOT"));
        if (process.env.SECURE === "true") {
            if (!process.env.PRIVATE_KEY)
                console.log(chalk.red(alert, "PRIVATE_KEY"));
            if (!process.env.CERTIFICATE)
                console.log(chalk.red(alert, "CERTIFICATE"));
            if (!process.env.HTTPS_PORT)
                console.log(chalk.red(alert, "HTTPS_PORT"));
            if (!process.env.HTTPS_HOST)
                console.log(chalk.red(alert, "HTTPS_HOST"));
        } else {
            if (!process.env.PORT)
                console.log(chalk.red(alert, "PORT"));
            if (!process.env.HOST)
                console.log(chalk.red(alert, "HOST"));
        }
        if (!process.env.JWT_SECRET)
            console.log(chalk.red(alert, "JWT_SECRET"));
        if (!process.env.AUTH_FLAG)
            console.log(chalk.red(alert, "AUTH_FLAG"));
        if (process.env.USE_RATE_LIMIT === "true") {
            if (!process.env.RATE_LIMIT_WINDOW_MS)
                console.log(chalk.red(alert, "RATE_LIMIT_WINDOW_MS"));
            if (!process.env.RATE_LIMIT_MAX)
                console.log(chalk.red(alert, "RATE_LIMIT_MAX"));
            if (!process.env.RATE_LIMIT_DELAY_MS)
                console.log(chalk.red(alert, "RATE_LIMIT_DELAY_MS"));
        }
    }

    connectMongoDB(): void {
        MongoConnect.connect().then(
            () => {
                const dIContainer = DIContainerClass.DIContainer;
                dIContainer.resolve<IInitPolicies>(InitPolicies).init();
            },
        ).catch((err: Error) => {
            console.log(chalk.red("MongoDB connection error. Please make sure MongoDB is running. " + err));
            process.exit(0);
        });
    }

    initMiddleware(): void {
        if (process.env.NODE_ENV === "production") {
            const options = Options.winstonOptions;

            // Winston config
            const logger = winston.createLogger({
                transports: [
                    new winston.transports.File(options.file),
                    new winston.transports.Console(options.console)
                ],
                exitOnError: false, // do not exit on handled exceptions
            });

            class LoggerStream {
                write(message: string) {
                    logger.info(message);
                }
            }

            this.app.use(morgan("combined", {"stream": new LoggerStream()}));
        } else {
            this.app.use(errorHandler());
        }


        // Request body parsing middleware should be above methodOverride
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({extended: true}));

        this.app.use(methodOverride());

        // compresses requests
        this.app.use(compression());

        if (process.env.USE_RATE_LIMIT === "true") {
            // only if you're behind a reverse proxy (Heroku, Bluemix, AWS if you use an ELB, custom Nginx setup, etc)
            // this.app.enable("trust proxy");

            const apiLimiter = new rateLimit(
                Options.apiLimiterOptions
            );

            // only apply to requests that begin with api route version
            this.app.use(process.env.API_ROOT, apiLimiter);
        }
    }

    initHelmetHeaders(): void {
        // Use helmet to secure Express headers
        const SIX_MONTHS = 15778476000;
        this.app.use(helmet.frameguard());
        this.app.use(helmet.xssFilter());
        this.app.use(helmet.noSniff());
        this.app.use(helmet.ieNoOpen());
        this.app.use(helmet.hsts({
            maxAge: SIX_MONTHS,
            includeSubdomains: true,
            force: true
        }));
        this.app.disable("x-powered-by");
    }

    initApiRoutes(): void {
        const dIContainer = DIContainerClass.DIContainer;
        const router = express.Router();
        DIContainerClass.pushConstant<Router>(router, DIContainerClass.TYPES.router);
        dIContainer.resolve<IInitRoutes>(InitRoutes).init();
        this.app.use(process.env.API_ROOT, router);
    }

    callback(): void {
        const configsListen: any[] = [];
        const configCreateServer: any[] = [this.app];
        let protocol: any = http;

        if (process.env.secure === "true") {
            configsListen.push(parseInt(process.env.HTTPS_PORT), process.env.HTTPS_HOST);
            const options = {
                key: fs.readFileSync(path.resolve(process.env.PRIVATE_KEY)),
                cert: fs.readFileSync(path.resolve(process.env.CERTIFICATE))
            };
            configCreateServer.unshift(options);
            protocol = https;
        } else {
            configsListen.push(parseInt(process.env.PORT), process.env.HOST);
        }

        // Start the app by listening on <port> at <host>
        const server = protocol.createServer(...configCreateServer);

        // Graceful shutdown
        if (process.env.USE_GRACEFUL === "true") {
            const onSignal = () => {
                AclInstance.aclInstance = undefined;
                return MongoConnect.disconnect().then(
                    () => {
                        process.exit(0);
                    }
                );
            };
            const options = {
                timeout: 1000,
                signal: "SIGINT",
                onSignal: onSignal
            };
            terminus.createTerminus(server, options);
        }

        configsListen.push(InitCallBack);

        server.listen(...configsListen);

        function InitCallBack() {
            const env = process.env.NODE_ENV;
            const port = server.address().port;
            const address = server.address().address;
            let protocol = "http";
            if (process.env.secure === "true")
                protocol = "https";

            console.log(chalk.green("******"));
            console.log(chalk.green(" Environment: ", env));
            console.log(chalk.green(" Port       : ", port));
            console.log(chalk.green(" Server     : ", address));
            console.log(chalk.green(" Protocol   : ", protocol));
            console.log(chalk.green(" API        : ", protocol + "://" + address + ":" + port + process.env.API_ROOT));
            console.log(chalk.green("******"));
        }
    }

    getMyAppInstance(): express.Application {
        return this.app;
    }
}



