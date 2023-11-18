import { z, TypeOf } from "zod";

export enum ProductStatusEnum {
    DRAFT = "Draft",
    PUBLISHED = "Published",
}
// --->
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
// ---> product attributes schema 

export const ProductStatus = z.object({
    status: z.enum([ProductStatusEnum.DRAFT, ProductStatusEnum.PUBLISHED], {
        errorMap: (issue, ctx) => ({ message: "enum is not valid" }),
    }),
});
export const ProductName = z.object({
    name: z.string(),
});
export const ProductCategory = z.object({
    category: z.string(),
});

export const ProductDescription = z.object({
    description: z.string(),
});
export const ProductCategoryId = z.object({
    categoryId: z.string(),
});
export const ProductPriceAttribute = z.object({
    price_attributes: z.array(ProductAttributeSchema),
});


export type ProductAttributeSchemaType = TypeOf<typeof ProductAttributeSchema>;
