import { model, Schema } from "mongoose";

import { IArticle } from "./Interfaces/IArticle";
import { IArticleModel } from "./Interfaces/IArticle.model";

/**
 * Article Schema
 */
export let ArticleSchema: Schema = new Schema({
        title: {
            type: String,
            trim: true,
            required: "Title cannot be blank"
        },
        content: {
            type: String,
            trim: true
        },
        user: {
            type: Schema.Types.ObjectId,
            ref: "User"
        }
    },
    {timestamps: true}
);

export const Article: IArticleModel = model<IArticle, IArticleModel>("Article", ArticleSchema);