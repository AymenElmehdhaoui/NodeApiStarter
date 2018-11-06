import { NextFunction, Request, Response } from "express";

export interface IArticlesValidation {
    validateArticleID(req: Request, res: Response, next: NextFunction): void;

    validateArticle(req: Request, res: Response, next: NextFunction): void;
}