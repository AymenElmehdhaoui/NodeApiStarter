import { AclInstance } from "../../helpers/acl.instance";
import { injectable, unmanaged } from "inversify";
import { IBasePolicy } from "./IBase.policy";

@injectable()
export class BasePolicy implements IBasePolicy {
    aclInstance: any;
    url: string;
    selector: string;

    protected constructor(@unmanaged() url: string, @unmanaged() selector: string) {
        this.aclInstance = AclInstance.getAclInstance();
        this.url = process.env.API_ROOT.concat(url);
        this.selector = selector;
    }
}