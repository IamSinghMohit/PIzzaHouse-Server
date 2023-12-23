import { z, TypeOf } from "zod";
import {
    ProductCategorySchema,
    ProductDescriptionSchema,
    ProductFeaturedSchema,
    ProductNameSchema,
    ProductSectionSchema,
    ProductPriceSchema,
    ProductStatusSchema,
    ProductDefaultAttributeSchema,
} from "./main";

export const CreateProductSchema = z
    .object({})
    .merge(ProductNameSchema)
    .merge(ProductCategorySchema)
    .merge(ProductStatusSchema)
    .merge(ProductDescriptionSchema)
    .merge(ProductSectionSchema)
    .merge(ProductFeaturedSchema)
    .merge(ProductPriceSchema)
    .merge(ProductDefaultAttributeSchema)

export type TCreateProductSchema= TypeOf<typeof CreateProductSchema>;
