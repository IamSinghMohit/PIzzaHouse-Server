import { asyncHandler } from "@/middlewares";
import ProductCreate from "./create";
import ProductRead from "./read";
import ProductDelete from "./delete";

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
    static deleteProduct = ProductController.ControllerWrapper(
        ProductDelete.delete
    );
    static getFromatedProducts = ProductController.ControllerWrapper(
        ProductRead.getFromatedProducts
    );
    static getProduct = ProductController.ControllerWrapper(
        ProductRead.getProduct
    );
}
export default ProductController;
