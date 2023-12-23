import TopingDto from "./topings.dto";
import { TopingsModel, TopingsType } from "./topings.model";

type FindType = "FINDONE" | "FIND";

class TopingService {
    static async findToping<
        T extends FindType,
        Treturn = T extends "FINDONE" ? TopingDto | null : TopingDto[] | null
    >(obj: Partial<Record<keyof TopingsType, any>>, type: T): Promise<Treturn> {
        if (type == "FIND") {
            return (await TopingsModel.find(obj).then((res) =>
                res.map((r) => new TopingDto(r))
            )) as any;
        } else {
            return (await TopingsModel.findOne(obj).then((res) => {
                if (res) {
                    return new TopingDto(res);
                } else {
                    return null;
                }
            })) as any;
        }
    }

    static async creatingToping(opts: Partial<TopingsType>) {
        return new TopingDto(await TopingsModel.create(opts));
    }

    static getInstance(opts: Partial<TopingsType>) {
        return new TopingsModel(opts);
    }

}
export default TopingService;
