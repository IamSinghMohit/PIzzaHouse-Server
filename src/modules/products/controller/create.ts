import { Request, Response, NextFunction } from "express";
import { TCreateProductSchema } from "../schema/create";
import ProductService from "../service/product.service";
import { ErrorResponse } from "@/utils";
import { ImageService, ResponseService } from "@/services";
import CategoryService from "@/modules/category/service/category.service";
import AdminProductDto from "../dto/product/admin";
import ProductPriceSectionService from "../service/productPriceSection";
import ProductDefaultPriceAttributeService from "../service/productDefaultAttribute.service";
import ProductUtilityDocument from "@/modules/utilities/utilities/product";

class ProductCreate {
    static async createProduct(
        req: Request<{}, {}, TCreateProductSchema>,
        res: Response,
        next: NextFunction,
    ) {
        const {
            name,
            sections,
            category,
            description,
            status,
            featured,
            default_attributes,
            price,
        } = req.body;
        if (!req.file) return next(new ErrorResponse("image is required", 422));
        console.log(JSON.stringify(req.body));
        const isExist = await ProductService.find({ name }, "FINDONE");
        if (isExist) {
            return next(new ErrorResponse("product already exist", 403));
        }
        const isCategoryExists = await CategoryService.find(
            { name: { $regex: new RegExp(category, "i") } },
            "FINDONE",
        );
        if (!isCategoryExists)
            return next(new ErrorResponse("category not  found", 404));

        const product = ProductService.getInstance({
            name,
            description,
            status,
        });
        const AttributeArray: string[] = [];
        const processedImage = await ImageService.compressImageToBuffer(req);
        const folder = `${process.env.CLOUDINARY_PRODUCT_FOLDER}`;

        const result = await ImageService.uploadImageWithBuffer(
            folder,
            processedImage,
        ).catch((error) => next(new ErrorResponse(error.message, error.code)));

        if (result && result.url) {
            product.image = result.url;
        }
        // saving product price attributes in the database
        sections.forEach(({ name, attributes }) => {
            const patt = ProductPriceSectionService.getInstance({
                product_id: product._id.toString(),
                category: category,
                name,
                attributes: attributes,
            });
            AttributeArray.push(patt._id.toString());
            patt.save();
        });
        // creating product_default_price document
        const productDefaultPrice =
            await ProductDefaultPriceAttributeService.create({
                product_id: product._id.toString(),
                category: category,
                attribute: default_attributes,
            });
        // savving the product with other releated fields
        productDefaultPrice.save();
        product.sections = AttributeArray;
        product.category = category;
        product.featured = featured;
        product.price = price;
        product.default_attribute = productDefaultPrice._id;
        
        const ProductResult = await product.save()

        // saving product information in utility class 
        const productUtility = new ProductUtilityDocument()
        await productUtility.Initialize()
        productUtility.IncProductCount().saveChanges()

        ResponseService.sendResponse(
            res,
            202,
            true,
            new AdminProductDto(ProductResult),
        );
    }
}
export default ProductCreate;
