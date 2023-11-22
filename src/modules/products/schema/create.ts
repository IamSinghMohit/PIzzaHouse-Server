import { z, TypeOf } from "zod";
import {
    ProductCategorySchema,
    ProductDefaultPriceSchema,
    ProductDescriptionSchema,
    ProductFeaturedSchema,
    ProductNameSchema,
    ProductPriceAttributeSchema,
    ProductPriceSchema,
    ProductStatusSchema,
} from "./main";

export const CreateProductSchema = z
    .object({})
    .merge(ProductNameSchema)
    .merge(ProductCategorySchema)
    .merge(ProductStatusSchema)
    .merge(ProductDescriptionSchema)
    .merge(ProductPriceAttributeSchema)
    .merge(ProductFeaturedSchema)
    .merge(ProductPriceSchema)
    .merge(ProductDefaultPriceSchema)

export type CreateProductSchemaType = TypeOf<typeof CreateProductSchema>;
