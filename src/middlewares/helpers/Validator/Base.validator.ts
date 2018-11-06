import { NextFunction, Request, Response } from "express";
import { isEmpty } from "lodash";
import { Types } from "mongoose";
import { injectable, unmanaged } from "inversify";

@injectable()
export class BaseValidation {
    selector: string;

    constructor(@unmanaged() selector: string) {
        this.selector = selector;
    }

    protected validateID(req: Request, res: Response, next: NextFunction) {
        const id = req.params[this.selector];
        if (isEmpty(id)) {
            res.status(400).send({
                message: "id must not be empty"
            });
            return;
        } else if (Types.ObjectId.isValid(id)) {
            next();
        } else {
            res.status(400).send({
                message: id + " is not valid Id"
            });
            return;
        }
    }
}
