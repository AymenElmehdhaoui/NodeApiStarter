import mongoose from "mongoose";
import bluebird from "bluebird";

import Options from "./Options";

export class MongoConnect {
    static connect(): Promise<typeof import("mongoose")> {
        const mongoUrl = process.env.MONGODB_URI;
        (<any>mongoose).Promise = bluebird;

        const options = Options.MongoDBOptions;

        return mongoose.connect(mongoUrl, options);
    }

    static disconnect(): Promise<void> {
        return mongoose.disconnect();
    }
}