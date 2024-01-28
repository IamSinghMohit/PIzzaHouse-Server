import { asyncHandler } from "@/middlewares";
import TopingsCreate from "./create";
import TopingRead from "./read";
import TopingDelete from "./delete";
import TopingUpdate from "./update";

class TopingController {
    static ControllerWrapper = asyncHandler;

    static create = TopingController.ControllerWrapper(TopingsCreate.toping);
    static getWithCategory = TopingController.ControllerWrapper(
        TopingRead.TopingWithCategory,
    );
    static getAllTopings = TopingController.ControllerWrapper(
        TopingRead.AllToping
    )
    static deleteToping = TopingController.ControllerWrapper(
        TopingDelete.toping,
    );
    static getStats = TopingController.ControllerWrapper(TopingRead.stats);
    static updateToping = TopingController.ControllerWrapper(TopingUpdate.toping)
}
export default TopingController;
