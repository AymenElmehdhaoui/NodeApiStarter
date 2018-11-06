import { injectable } from "inversify";

import { BaseService } from "../../services/Base.service";
import { IArticlesController } from "./IArticles.controller";
import { Article } from "../../models/Articles/Article";

@injectable()
export class ArticlesController extends BaseService implements IArticlesController {
    constructor() {
        super(Article);
    }
}
