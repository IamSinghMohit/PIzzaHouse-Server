import { asyncHandler } from "@/middlewares";
import ProductCreate from "./create";
import ProductRead from "./read";

class ProductController {
    private static ControllerWrapper = asyncHandler;
    static createProduct = ProductController.ControllerWrapper(
        ProductCreate.createProduct
    );
    static getProducts = ProductController.ControllerWrapper(
        ProductRead.getProducts
    );
    static getProductAttributes = ProductController.ControllerWrapper(
        ProductRead.getProductAttributes
    );
}
export default ProductController;
