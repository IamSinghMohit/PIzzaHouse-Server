import TopingDto from "./topings.dto";
import { TopingsModel, TopingsType } from "./topings.model";

type FindType = "FINDONE" | "FIND";

class TopingService {

    static async findToping(opts: Partial<TopingsType>, type: FindType) {
        if (type == "FIND") {
            return await TopingsModel.find(opts).then((res) =>
                res.map((r) => new TopingDto(r))
            );
        } else {
            return await TopingsModel.findOne(opts).then((res) => {
                if (res) {
                    return new TopingDto(res);
                } else {
                    return null;
                }
            });
        }
    }

    static async creatingToping(opts: Partial<TopingsType>) {
        return new TopingDto(await TopingsModel.create(opts))
    }

    static getInstance(opts: Partial<TopingsType>) {
        return new TopingsModel(opts);
    }
}
export default TopingService;
