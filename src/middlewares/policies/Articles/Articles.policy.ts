import { BasePolicy } from "../Base/Base.policy";
import { IArticlesPolicy } from "./IArticles.policy";
import { ADMIN, GUEST, USER } from "../../../config/roles.config";

export class ArticlesPolicy extends BasePolicy implements IArticlesPolicy {
    constructor() {
        super("/articles", "articleId");
    }

    public invokeRolesPolicies(): void {

        this.aclInstance.allow([{
                roles: [ADMIN],
                allows: [
                    {
                        resources: this.url,
                        permissions: ["get", "post"]
                    },
                    {
                        resources: this.url.concat("/:").concat(this.selector),
                        permissions: ["get", "put", "delete"]
                    }
                ]
            },
                {
                    roles: [USER],
                    allows: [
                        {
                            resources: this.url,
                            permissions: ["get", "post"]
                        },
                        {
                            resources: this.url.concat("/:").concat(this.selector),
                            permissions: ["get"]
                        }
                    ]
                },
                {
                    roles: [GUEST],
                    allows: [
                        {
                            resources: this.url,
                            permissions: ["get"]
                        },
                        {
                            resources: this.url.concat("/:").concat(this.selector),
                            permissions: ["get"]
                        }
                    ]
                }
            ]
        );
    }
}
