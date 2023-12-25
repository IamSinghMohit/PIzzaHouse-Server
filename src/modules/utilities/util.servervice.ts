import { UtilModel, TUtil } from "./util.model";
type options = Partial<TUtil>;

class UtilService {
    static async createOne<T>(opt: { title: string; data: T }) {
        return (await UtilModel.create(opt)) as unknown;
    }
    static async findOne(opt: options) {
        return (await UtilModel.findOne(opt)) as unknown;
    }
    static async deleteOne(opt: options) {
        return await UtilModel.deleteOne(opt);
    }
    static async updateOne<T extends Record<string, any>>(
        opt: options,
        data: T,
    ) {
        return (await UtilModel.updateOne(opt, data)) as unknown;
    }
}
export default UtilService;
