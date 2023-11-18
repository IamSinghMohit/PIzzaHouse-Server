import { z, TypeOf } from "zod";
import {
    ProductCategoryId,
    ProductDescription,
    ProductName,
    ProductPriceAttribute,
    ProductStatus,
} from "./main";

export const CreateProductSchema = z
    .object({})
    .merge(ProductName)
    .merge(ProductCategoryId)
    .merge(ProductPriceAttribute)
    .merge(ProductStatus)
    .merge(ProductDescription);

export type CreateProductSchemaType = TypeOf<typeof CreateProductSchema>;
