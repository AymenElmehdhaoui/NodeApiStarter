import { BasePolicy } from "../Base/Base.policy";
import { IUsersPolicy } from "./IUsers.policy";
import { injectable } from "inversify";
import { ADMIN, USER, USERNOTCONFIRMED } from "../../../config/roles.config";

@injectable()
export class UsersPolicy extends BasePolicy implements IUsersPolicy {
    constructor() {
        super("/users", "userId");
    }

    public invokeRolesPolicies() {
        this.aclInstance.allow(
            [
                {
                    roles: [ADMIN],
                    allows: [
                        {resources: this.url, permissions: ["get", "post"]},
                        {
                            resources: this.url.concat("/:").concat(this.selector),
                            permissions: ["get", "patch", "delete"]
                        }
                    ]
                },
                {
                    roles: [ADMIN, USER, USERNOTCONFIRMED],
                    allows: [
                        {resources: this.url.concat("/me"), permissions: ["get", "patch", "delete"]},
                    ]
                }
            ]
        );
    }
}
