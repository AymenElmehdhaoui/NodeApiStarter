/**
 * Module dependencies
 */
import { model, Schema } from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import _ from "lodash";
import uniqueValidator from "mongoose-unique-validator";

import { IUserModel } from "./Interfaces/IUser.model";
import { IUser } from "./Interfaces/IUser";
import { IUserDocument } from "./Interfaces/IUser.document";

/**
 * User Schema
 */
export let UserSchema: Schema = new Schema({
        firstName: {
            type: String,
            trim: true,
            required: "Please fill in a first name"
        },
        lastName: {
            type: String,
            trim: true,
            required: "Please fill in a last name"
        },
        email: {
            type: String,
            unique: "Two users cannot share the same email ({VALUE})",
            index: {
                unique: true,
                sparse: true // For this to work on a previously indexed field, the index must be dropped & the application restarted.
            },
            lowercase: true,
            trim: true,
            required: "Please fill in a email",
            validate: [
                (email: string) => {
                    return (validator.isEmail(email, {require_tld: false}));
                },
                "{VALUE} is not a valid email!"
            ],
        },
        password: {
            type: String,
            required: "Please fill in a password",
        },
        roles: {
            type: [{
                type: String,
                enum: ["userNotConfirmed", "user", "admin"]
            }],
            default: ["userNotConfirmed"],
            required: "Please provide at least one role"
        },
        isConfirmed: {
            type: Boolean,
            default: false
        },
        /* For reset password */
        resetPasswordToken: {
            type: String
        },
        resetPasswordExpires: {
            type: Date
        },
        passwordResetAt: {
            type: Date,
            default: Date.now()
        }
    },
    {timestamps: true}
);
UserSchema.plugin(uniqueValidator);


UserSchema.methods.toJSON = function (): any {
    const user = this;
    const userObject = user.toObject();

    return _.pick(userObject, ["_id", "email", "firstName", "lastName", "roles", "updatedAt", "createdAt", "isConfirmed", "passwordResetAt"]);
};

UserSchema.methods.generateAuthToken = function (user: IUser): Promise<string> {
    // Return new promise
    return new Promise(function (resolve: Function) {
        const token = jwt.sign({
            createdAt: new Date(),
            data: user
        }, process.env.JWT_SECRET, {expiresIn: process.env.ACCESS_TOKEN_EXPIRATION}).toString();
        resolve(token);
    });
};

UserSchema.statics.findByCredentials = function (email: string, password: string): Promise<IUserModel> {
    const User = this;

    return User.findOne({email}).then((user: IUserDocument) => {
        if (!user) {
            const err = new Error("invalid");
            return Promise.reject(err);
        }

        return new Promise((resolve, reject) => {
            // Use bcrypt.compare to compare password and user.password
            bcrypt.compare(password, user.password, (err: Error, res: boolean) => {
                if (res) {
                    resolve(user);
                } else {
                    reject(err);
                }
            });
        });
    });
};

UserSchema.pre("save", function (next) {
    const user: any = this;

    if (user.isModified("password")) {
        bcrypt.genSalt(10, (err: Error, salt: string) => {
            bcrypt.hash(user.password, salt, (err: Error, hash: string) => {
                if (err)
                    throw err;

                user.password = hash;
                next();
            });
        });
    } else {
        next();
    }
});
export const User: IUserModel = model<IUser, IUserModel>("User", UserSchema);
