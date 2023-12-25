import { UtilEnum } from "../util.enum";
import UtilService from "../util.servervice";
import { TProductUtilityDocument } from "../util.types";

class ProductUtilityDocument {
    private product: TProductUtilityDocument;

    constructor() {
        // The constructor initializes the instance with an empty or default state.
        // The actual product data will be set using the `initialize` method.
        this.product = {
            title: '', // or other default values
            data: {
                product_count: 0,
                maximum_price: 0,
            },
        };
    }

    async Initialize():Promise<this> {
        const isExist = (await UtilService.findOne({
            title: UtilEnum.PRODUCT,
        })) as TProductUtilityDocument;
        if (!isExist) {
            const product = (await UtilService.createOne<
                TProductUtilityDocument["data"]
            >({
                title: UtilEnum.PRODUCT,
                data: {
                    product_count: 0,
                    maximum_price: 0,
                },
            })) as TProductUtilityDocument;
            this.product =  product
        } else {
            this.product = isExist
        }
        return this
    }
    IncProductCount():this{
        this.product.data.product_count += 1;
        return this
    }
    DecProductCount():this  {
        this.product.data.product_count -= 1;
        return this
    }
    ChangeMaxPrice(price: number):this  {
        this.product.data.maximum_price = price;
        return this
    }
    async saveChanges() {
        if (this.product && this.product.title) {
            await UtilService.updateOne(
                { title: UtilEnum.PRODUCT },
                { data: this.product.data },
            );
        }
    }
}
export default ProductUtilityDocument;
