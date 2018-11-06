import { BasePolicy } from "../Base/Base.policy";
import { IUsersPolicy } from "./IUsers.policy";
import { injectable } from "inversify";

@injectable()
export class UsersPolicy extends BasePolicy implements IUsersPolicy {
    constructor() {
        super("/users", "userId");
    }

    public invokeRolesPolicies() {
        this.aclInstance.allow(
            [
                {
                    roles: ["admin"],
                    allows: [
                        {resources: this.url, permissions: ["get", "post"]},
                        {
                            resources: this.url.concat("/:").concat(this.selector),
                            permissions: ["get", "patch", "delete"]
                        }
                    ]
                },
                {
                    roles: ["admin", "user", "userNotConfirmed"],
                    allows: [
                        {resources: this.url.concat("/me"), permissions: ["get", "patch", "delete"]},
                    ]
                }
            ]
        );
    }
}