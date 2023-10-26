import { z, TypeOf } from "zod";
import { ProductAttrSchema } from "./productAttr.schema";

export enum ProductStatusEnum {
    DRAFT = "draft",
    PUBLISHED = "published",
}

export const productSchema = z.object({
    name: z.string(),
    category: z.string(),
    price: z.number(),
    description: z.string(),
    status: z.enum([ProductStatusEnum.DRAFT, ProductStatusEnum.PUBLISHED], {
        errorMap: (issue, ctx) => ({ message: "enum is not valid" }),
    }),
});

export const ProductSchemaWithAttr = productSchema.extend({
    price_attributes: z.array(ProductAttrSchema)
});

export interface ProductSchemaType extends TypeOf<typeof productSchema> {}
export interface ProductSchemaWithAttrType
    extends TypeOf<typeof ProductSchemaWithAttr> {}
