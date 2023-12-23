import BaseProductDto from "./base";
import { TProduct } from "../../models/product.model";

class AdminProductDto extends BaseProductDto {
    status;
    created_at;
    updated_at;
    featured;

    constructor(product: TProduct) {
        super(product);
        this.status = product.status;
        this.created_at = product.createdAt;
        this.updated_at = product.updatedAt;
        this.featured = product.featured;
    }
}

export default AdminProductDto 