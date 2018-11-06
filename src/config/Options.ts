import appRoot from "app-root-path";

import AppStarter from "../App";

export default class Options {
    static get MongoDBOptions() {
        return {
            autoIndex: false, // Don't build indexes
            reconnectTries: Number.MAX_VALUE, // Never stop trying to reconnect
            reconnectInterval: 500, // Reconnect every 500ms
            poolSize: 10, // Maintain up to 10 socket connections
            // If not connected, return errors immediately rather than waiting for reconnect
            bufferMaxEntries: 0,
            connectTimeoutMS: 10000, // Give up initial connection after 10 seconds
            socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
            useNewUrlParser: true
        };
    }

    static get winstonOptions() {
        return {
            file: {
                level: process.env.LOG_LEVEL,
                filename: `${appRoot}${process.env.LOG_FILE_PATH}`,
                handleExceptions: true,
                json: true,
                maxsize: 5242880 * 100, // 500MB
                maxFiles: 5,
                colorize: false,
            },
            console: {
                level: "debug",
                handleExceptions: true,
                json: true,
                colorize: true,
            },
        };
    }

    static get smtpTransportOptions() {
        return {
            service: process.env.MAILER_SERVICE_PROVIDER,
            auth: {
                user: process.env.MAILER_EMAIL_ID,
                pass: process.env.MAILER_PASSWORD
            }
        };
    }

    static get apiLimiterOptions() {
        return {
            windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS),
            max: parseInt(process.env.RATE_LIMIT_MAX),
            delayMs: parseInt(process.env.RATE_LIMIT_DELAY_MS)
        };
    }

    static get TYPES() {
        return {
            InitRoutes: Symbol.for("InitRoutes"),
            AppStarter: Symbol.for("AppStarter"),
            router: Symbol.for("router"),
            smtpTransport: Symbol.for("smtpTransport"),

            AuthController: Symbol.for("AuthController"),
            AuthValidation: Symbol.for("AuthValidation"),
            AuthApi: Symbol.for("AuthApi"),
            AuthPolicy: Symbol.for("AuthPolicy"),

            ArticlesController: Symbol.for("ArticlesController"),
            ArticlesValidation: Symbol.for("ArticlesValidation"),
            ArticlesApi: Symbol.for("ArticlesApi"),
            ArticlesPolicy: Symbol.for("ArticlesPolicy"),

            UsersController: Symbol.for("UsersController"),
            UsersValidation: Symbol.for("UsersValidation"),
            UsersPolicy: Symbol.for("UsersPolicy"),
            UsersApi: Symbol.for("UsersApi"),
        };
    }
}