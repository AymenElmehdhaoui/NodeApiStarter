import { Document, Schema } from "mongoose";

export interface IArticleDocument extends Document {
    title: string;
    content: string;
    createdAt: Date;
    updatedAt: Date;
    user: Schema.Types.ObjectId;
}