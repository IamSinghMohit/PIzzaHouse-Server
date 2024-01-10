import { asyncHandler } from "@/middlewares";
import ProductCreate from "./create";
import ProductRead from "./read";
import ProductDelete from "./delete";
import ProductUpdate from "./update";

class ProductController {
    private static wrapper = asyncHandler;

    static createProduct = this.wrapper(ProductCreate.createProduct);
    static getProducts = this.wrapper(ProductRead.products);
    static getProductPriceSection = this.wrapper(
        ProductRead.productPriceSection,
    );
    static deleteProduct = this.wrapper(ProductDelete.delete);
    static getFromatedProducts = this.wrapper(ProductRead.fromatedProducts);
    static getProduct = this.wrapper(ProductRead.product);
    static updateProduct = this.wrapper(ProductUpdate.update);
    static getProductStats = this.wrapper(ProductRead.stats);
}
export default ProductController;
