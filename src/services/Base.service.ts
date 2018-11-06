import { Document, Model, Types } from "mongoose";
import { extend } from "lodash";
import { NextFunction, Request, Response } from "express";
import { injectable, unmanaged } from "inversify";

import { IRequest } from "../middlewares/helpers/IRequest.interface";
import { IBaseService } from "./IBase.service";

@injectable()
export class BaseService implements IBaseService {
    create = (req: IRequest, res: Response): void => {
        req.body.user = req.user;
        const toSave = new this.schema(req.body);

        this.schema.create(toSave)
            .then(
                (result: Document) => {

                    this.schema.findById(result._id)
                        .populate("user", "firstName lastName")
                        .then(
                            (result: Document) => {
                                res.send(result);
                            }
                        )
                        .catch(
                            (err: Error) => {
                                res.status(400).send({
                                    message: err
                                });
                                return;
                                // throw err;
                            }
                        );
                }
            )
            .catch(
                (err: Error) => {
                    res.status(400).send({
                        message: err
                    });
                    // throw err;
                }
            );
    };
    update = (req: IRequest, res: Response): void => {
        // For security reason
        delete req.property.user;
        delete req.body._id;

        let toUpdate = new this.schema(req.property);
        toUpdate = extend(toUpdate, req.body);

        toUpdate.save()
            .then(
                (result: Document) => res.send(result)
            )
            .catch(
                (err: Error) => {
                    res.status(400).send({
                        message: err
                    });
                    // throw err;
                }
            );
    };
    delete = (req: IRequest, res: Response): void => {
        const toDelete = new this.schema(req.property);

        this.schema.deleteOne({_id: toDelete._id})
            .then(
                (result: Document) => res.send(result)
            )
            .catch(
                (err: Error) => {
                    res.status(400).send({
                        message: err
                    });
                    // throw err;
                }
            );
    };
    getAll = (req: Request, res: Response): void => {
        this.schema.find({})
            .sort("-createdAt")
            .populate("user", "firstName lastName")
            .then(
                (result: Document[]) => res.send(result)
            )
            .catch(
                (err: Error) => {
                    res.status(400).send({
                        message: err
                    });
                    // throw err;
                }
            );
    };
    getByID = (req: IRequest, res: Response, next: NextFunction, id: string): void => {

        if (!Types.ObjectId.isValid(id)) {
            res.status(400).send({
                message: "Id " + id + " is invalid"
            });
            return;
        }

        this.schema.findById(id)
            .populate("user", "firstName lastName")
            .then(
                (result: Document) => {
                    if (result) {
                        req.property = result;
                        return next();
                    } else {
                        res.status(404).send({
                            message: "Element not found"
                        });
                        return;
                    }
                }
            )
            .catch(
                (err: Error) => {
                    res.status(400).send({
                        message: err
                    });
                    return;
                    // throw err;
                }
            );
    };
    read = (req: IRequest, res: Response): void => {
        res.send(req.property || {});
    };

    constructor(@unmanaged() public schema: Model<Document>) {
    }
}