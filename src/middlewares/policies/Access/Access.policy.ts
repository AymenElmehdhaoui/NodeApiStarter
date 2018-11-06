import { verify } from "jsonwebtoken";
import { NextFunction, Response } from "express";

import { IRequest } from "../../helpers/IRequest.interface";
import { AclInstance } from "../../helpers/acl.instance";
import { IAccessPolicy } from "./IAccess.policy";

export class AccessPolicy implements IAccessPolicy {
    isAllowed(req: IRequest, res: Response, next: NextFunction): void {

        // If an property is being processed and the current user created it then allow any manipulation
        if (req.property && req.user) {
            if (req.property.user) {
                if (req.property.user._id.toString() === req.user._id.toString()) {
                    next();
                    return;
                }
            }
        }

        const roles = req.user ? req.user.roles : ["guest"];
        const aclInstance = AclInstance.getAclInstance();
        const url = process.env.API_ROOT.concat(req.route.path);

        // Check for user roles
        aclInstance.areAnyRolesAllowed(roles, url, req.method.toLowerCase())
            .then(
                (isAllowed: Boolean) => {
                    if (isAllowed)
                        next();
                    else {
                        res.status(403).json({
                            message: "User is not authorized"
                        });
                    }
                }
            )
            .catch(
                () => {
                    res.status(500).send("Unexpected authorization error");
                    // throw err;
                }
            );
    }

    isAuthenticated(
        req: IRequest, res: Response, next: NextFunction): void {
        const token = req.header(process.env.AUTH_FLAG);

        verify(token, process.env.JWT_SECRET, function (err: Error, decoded: any) {
            if (err) {
                res.status(401).send({
                    message: err.message.toString() || "Token is not valid"
                });
                // throw err;
            } else {
                if (decoded.createdAt >= decoded.data.passwordResetAt) {
                    req.user = decoded.data;
                    next();
                } else {
                    res.status(401).send({
                        message: "Token is not valid"
                    });
                }
            }
        });
    }
}