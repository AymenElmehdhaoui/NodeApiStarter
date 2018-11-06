import { NextFunction, Request, Response } from "express";
import { isEmpty, pick } from "lodash";

import { BaseValidation } from "../Base.validator";
import { IArticlesValidation } from "./IArticles.validator";

export class ArticlesValidation extends BaseValidation implements IArticlesValidation {
    validateArticleID = (req: Request, res: Response, next: NextFunction): void => {
        this.validateID(req, res, next);
    };
    validateArticle = (req: Request, res: Response, next: NextFunction): void => {
        const body = pick(req.body, ["title"]);

        if (isEmpty(body.title)) {
            res.status(400).send({
                message: "title is required"
            });
        } else {
            next();
        }
    };

    constructor() {
        super("articleId");
    }
}
