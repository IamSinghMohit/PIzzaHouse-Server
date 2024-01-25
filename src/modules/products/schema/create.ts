import { z, TypeOf } from "zod";
import {
    ProductDescriptionSchema,
    ProductFeaturedSchema,
    ProductNameSchema,
    ProductSectionSchema,
    ProductPriceSchema,
    ProductStatusSchema,
    ProductDefaultAttributeSchema,
} from "./main";

export const CreateProductSchema = z
    .object({
        category_id: z.string(),
    })
    .merge(ProductNameSchema)
    .merge(ProductStatusSchema)
    .merge(ProductDescriptionSchema)
    .merge(ProductSectionSchema)
    .merge(ProductFeaturedSchema)
    .merge(ProductPriceSchema)
    .merge(ProductDefaultAttributeSchema);

export type TCreateProductSchema = TypeOf<typeof CreateProductSchema>;
