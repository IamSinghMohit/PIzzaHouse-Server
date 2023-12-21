import { UtilModel, TUtil } from "./utility.model";
type options = Partial<TUtil>;

class UtilService {
    static async createOne(opt: options) {
        return (await UtilModel.create(opt)) as any;
    }
    static async findOne(opt: options) {
        return (await UtilModel.findOne(opt)) as any;
    }
    static async deleteOne(opt: options) {
        return await UtilModel.deleteOne(opt);
    }
}
export default UtilService;
