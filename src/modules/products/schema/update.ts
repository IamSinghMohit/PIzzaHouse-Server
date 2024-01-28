import { z, TypeOf } from "zod";
import {
    ProductDefaultAttributeSchema,
    ProductDescriptionSchema,
    ProductFeaturedSchema,
    ProductNameSchema,
    ProductPriceSchema,
    ProductSectionSchema,
    ProductStatusSchema,
} from "./main";

const restFieldsAsOptionalSchema = z
    .object({
    })
    .merge(ProductNameSchema)
    .merge(ProductStatusSchema)
    .merge(ProductDescriptionSchema)
    .merge(ProductPriceSchema)
    .merge(ProductDefaultAttributeSchema)
    .merge(ProductSectionSchema)
    .merge(ProductFeaturedSchema)
    .partial();

export const UpdateProductSchema = z
    .object({ id: z.string() })
    .merge(restFieldsAsOptionalSchema);

export type TUpdateProductSchema = TypeOf<typeof UpdateProductSchema>;
