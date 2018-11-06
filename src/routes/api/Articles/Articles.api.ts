import { Router } from "express";
import { inject, injectable } from "inversify";

import { BaseApi } from "../Base/BaseApi";
import Options from "../../../config/Options";
import { IArticlesController } from "../../../controllers/Articles/IArticles.controller";
import { IArticlesApi } from "./IArticles.api";
import { IArticlesValidation } from "../../../middlewares/helpers/Validator/Articles/IArticles.validator";

const {TYPES} = Options;

@injectable()
export class ArticlesApi extends BaseApi implements IArticlesApi {
    constructor(
        @inject(TYPES.ArticlesController) private articles: IArticlesController,
        @inject(TYPES.ArticlesValidation) private articlesValidation: IArticlesValidation,
        @inject(TYPES.router) router: Router
    ) {

        super(
            router,
            "/articles",
            "articleId"
        );
    }

    public init(): void {

        // Articles collection routes
        this.router.route(this.url)
            .get(...this.authDoubleCheck, this.articles.getAll)
            .post(this.articlesValidation.validateArticle, ...this.authDoubleCheck, this.articles.create);

        // Single article routes
        this.router.route(this.url.concat("/:").concat(this.selectorId))
            .get(this.articlesValidation.validateArticleID, ...this.authDoubleCheck, this.articles.read)
            .put(this.articlesValidation.validateArticleID, ...this.authDoubleCheck, this.articles.update)
            .delete(this.articlesValidation.validateArticleID, ...this.authDoubleCheck, this.articles.delete);

        // Finish by binding the article middleware
        this.router.param(this.selectorId, this.articles.getByID);
    }
}