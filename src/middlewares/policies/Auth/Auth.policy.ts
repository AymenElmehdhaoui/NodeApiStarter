import { injectable } from "inversify";

import { BasePolicy } from "../Base/Base.policy";
import { IAuthPolicy } from "./IAuth.policy";

@injectable()
export class AuthPolicy extends BasePolicy implements IAuthPolicy {
    constructor() {
        super("/auth", "userId");
    }

    public invokeRolesPolicies(): void {
        this.aclInstance.allow(
            [
                {
                    roles: ["userNotConfirmed"],
                    allows: [
                        {
                            resources: this.url.concat("/confirmation"),
                            permissions: ["post"]
                        },
                        {
                            resources: this.url.concat("/confirmation/:").concat(this.selector),
                            permissions: ["patch"]
                        }
                    ]
                }
            ]
        );
    }
}