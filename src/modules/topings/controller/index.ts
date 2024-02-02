import { asyncHandler } from "@/middlewares";
import TopingsCreate from "./create";
import TopingRead from "./read";
import TopingDelete from "./delete";
import TopingUpdate from "./update";

class TopingController {
    private static wrapper = asyncHandler;

    static create = this.wrapper(TopingsCreate.toping);
    static getWithCategory = this.wrapper(TopingRead.TopingWithCategory);
    static getAllTopings = this.wrapper(TopingRead.AllToping);
    static deleteToping = this.wrapper(TopingDelete.toping);
    static getStats = this.wrapper(TopingRead.stats);
    static updateToping = this.wrapper(TopingUpdate.toping);
}
export default TopingController;
