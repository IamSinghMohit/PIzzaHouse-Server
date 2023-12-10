import { ProductModel, TProduct } from "../models/product.model";

type opts = Partial<TProduct>;
type FindType = "FINDONE" | "FIND";

class ProductService {
    static async find(
        opts: Partial<Record<keyof TProduct, any>>,
        type: FindType
    ) {
        if (type == "FIND") {
            return await ProductModel.find(opts);
        } else {
            return await ProductModel.findOne(opts);
        }
    }

    static async UpdateMany(condition: opts, updatedData: any): Promise<any> {
        await ProductModel.updateMany(condition, updatedData, {
            new: true,
        });
    }

    static async createProdut(opts: opts) {
        return await ProductModel.create(opts);
    }

    static getInstance(opts: opts) {
        return new ProductModel(opts);
    }
    static async count() {
        return await ProductModel.estimatedDocumentCount();
    }
    static async delete(opts: opts) {
        return await ProductModel.deleteOne(opts);
    }

    static async getFormatedProducts(
        productLimit: number,
        categoryLimit: number
    ) {
        return await ProductModel.aggregate([
            {
                $match: {
                    featured: true,
                },
            },
            {
                $group: {
                    _id: "$category",
                    products: {
                        $push: {
                            id: "$_id",
                            name: "$name",
                            category: "$category",
                            description: "$description",
                            price: "$price",
                            image: "$image",
                            price_attributes: "$price_attributes",
                            default_prices: "$default_prices",
                        },
                    },
                },
            },
            {
                $addFields: {
                    id: "$_id",
                    category: "$_id",
                },
            },
            {
                $project: {
                    _id: 0,
                    id: 1,
                    category: 1,
                    products: { $slice: ["$products", productLimit] },
                },
            },
            {
                $limit: categoryLimit,
            },
        ]);
    }
}
export default ProductService;
