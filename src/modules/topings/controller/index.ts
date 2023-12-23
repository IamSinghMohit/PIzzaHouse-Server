import { asyncHandler } from "@/middlewares";
import TopingsCreate from "./create";
import TopingRead from "./read";

class TopingsController {
    static ControllerWrapper = asyncHandler;
    static create = TopingsController.ControllerWrapper(
        TopingsCreate.createTopings
    );
    static getWithCategory = TopingsController.ControllerWrapper(
        TopingRead.getTopingWithCategory
    );
}
export default TopingsController;
