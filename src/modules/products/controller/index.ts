import { asyncHandler } from "@/middlewares";
import ProductCreate from "./create";
import ProductRead from "./read";
import ProductDelete from "./delete";
import ProductUpdate from "./update";

class ProductController {
    private static ControllerWrapper = asyncHandler;

    static createProduct = ProductController.ControllerWrapper(
        ProductCreate.createProduct,
    );
    static getProducts = ProductController.ControllerWrapper(
        ProductRead.products,
    );
    static getProductPriceSection = ProductController.ControllerWrapper(
        ProductRead.productPriceSection,
    );
    static deleteProduct = ProductController.ControllerWrapper(
        ProductDelete.delete,
    );
    static getFromatedProducts = ProductController.ControllerWrapper(
        ProductRead.fromatedProducts,
    );
    static getProduct = ProductController.ControllerWrapper(
        ProductRead.product,
    );
    static updateProduct = ProductController.ControllerWrapper(
        ProductUpdate.update,
    );
    static getProductStats = ProductController.ControllerWrapper(
        ProductRead.stats,
    );
}
export default ProductController;
