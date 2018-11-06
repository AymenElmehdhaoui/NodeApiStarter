import { RequestHandlerParams } from "express-serve-static-core";
import { Router } from "express";

export interface IBaseApi {
    authDoubleCheck: RequestHandlerParams[];
    router: Router;
    url: string;
    selectorId: string;

    init(): void;

}
