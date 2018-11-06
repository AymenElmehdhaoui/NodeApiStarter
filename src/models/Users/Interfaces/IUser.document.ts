import { Document } from "mongoose";

export interface IUserDocument extends Document {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    roles: string[];
    isConfirmed: Boolean;
    resetPasswordToken: string;
    resetPasswordExpires: Date;
    createdAt: Date;
    updatedAt: Date;
    passwordResetAt: number;
}