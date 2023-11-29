import { z, TypeOf } from "zod";

export enum ProductStatusEnum {
    DRAFT = "Draft",
    PUBLISHED = "Published",
}

const ProductSubAttributeSchema = z.array(
    z.object({
        title: z.string(),
        value: z.number(),
    })
);
export const ProductAttributeSchema = z.object({
    attribute_title: z.string(),
    attributes: ProductSubAttributeSchema,
});

export const ProductStatusSchema = z.object({
    status: z.enum([ProductStatusEnum.DRAFT, ProductStatusEnum.PUBLISHED], {
        errorMap: (issue, ctx) => ({ message: "enum is not valid" }),
    }),
});
export const ProductNameSchema = z.object({
    name: z.string(),
});
export const ProductCategorySchema = z.object({
    category: z.string(),
});
export const ProductDescriptionSchema = z.object({
    description: z.string(),
});
export const ProductPriceAttributeSchema = z.object({
    price_attributes: z.array(ProductAttributeSchema),
});
export const ProductFeaturedSchema = z.object({
    featured: z.boolean(),
});
export const ProductPriceSchema = z.object({
    price: z.string().transform((data) => parseInt(data)),
});
export const ProductDefaultPriceSchema = z.object({
    default_prices : z.record(z.string()),
});
export const Id = z.object({
    id:z.string(),
})

export type ProductSubAttributeSchemaType = TypeOf<
    typeof ProductSubAttributeSchema
>;
