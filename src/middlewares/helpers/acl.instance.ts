import acl from "acl";
import mongoose from "mongoose";

export class AclInstance {
    static aclInstance: any;

    static getAclInstance(): any {
        if (!this.aclInstance) {
            this.aclInstance = new acl(new acl.mongodbBackend(mongoose.connection.db, process.env.ACL_PREFIX));
        }
        return this.aclInstance;
    }
}