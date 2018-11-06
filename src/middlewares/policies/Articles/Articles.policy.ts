import { BasePolicy } from "../Base/Base.policy";
import { IArticlesPolicy } from "./IArticles.policy";

export class ArticlesPolicy extends BasePolicy implements IArticlesPolicy {
    constructor() {
        super("/articles", "articleId");
    }

    public invokeRolesPolicies(): void {

        this.aclInstance.allow([{
                roles: ["admin"],
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
                    roles: ["user"],
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
                    roles: ["guest"],
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