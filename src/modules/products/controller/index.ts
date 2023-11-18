import { asyncHandler } from "@/middlewares";
import ProductCreate from "./create";

class ProductController {
    private static ControllerWrapper = asyncHandler;
    static createProduct = ProductController.ControllerWrapper(
        ProductCreate.createProduct
    );
}
export default ProductController;
