import { z, TypeOf } from "zod";

export enum ProductStatusEnum {
    DRAFT = "Draft",
    PUBLISHED = "Published",
}

const ProductAttributeSchema = z.array(
    z.object({
        id: z.string(),
        name: z.string(),
        value: z.number(),
    })
);

export const ProductSectionSchema = z.object({
    sections: z.array(
        z.object({
            name: z.string(),
            attributes: ProductAttributeSchema,
        })
    ),
});

export const ProductStatusSchema = z.object({
    status: z.enum([ProductStatusEnum.DRAFT, ProductStatusEnum.PUBLISHED], {
        errorMap: () => ({ message: "enum is not valid" }),
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
export const ProductFeaturedSchema = z.object({
    featured: z.boolean(),
});
export const ProductPriceSchema = z.object({
    price: z.string().transform((data) => parseInt(data)),
});
export const ProductDefaultAttributeSchema = z.object({
    default_attributes: z.array(
        z.object({
            id: z.string(),
            section: z.string(),
            name: z.string(),
        })
    ),
});
export const ProductId = z.object({
    id: z.string(),
});

export type TProductAttributeSchema = TypeOf<typeof ProductAttributeSchema>;
export type TProductDefaultAttributeSchema = TypeOf<
    typeof ProductDefaultAttributeSchema
>;
