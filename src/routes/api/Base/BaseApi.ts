import { RequestHandlerParams } from "express-serve-static-core";
import { Router } from "express";
import { inject, injectable, unmanaged } from "inversify";

import { AccessPolicy } from "../../../middlewares/policies/Access/Access.policy";
import Options from "../../../config/Options";
import { IBaseApi } from "./IBaseApi";

const {TYPES} = Options;

@injectable()
export abstract class BaseApi extends AccessPolicy implements IBaseApi {
    authDoubleCheck: RequestHandlerParams[];

    protected constructor(
        @inject(TYPES.router) public router: Router,
        @unmanaged() public url: string,
        @unmanaged() public selectorId: string,
    ) {
        super();
        this.authDoubleCheck = [
            this.isAuthenticated,
            this.isAllowed
        ];
    }

    abstract init(): void;
}
