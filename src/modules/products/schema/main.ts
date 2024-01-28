import { z, TypeOf } from "zod";
import { StatusEnum } from "@/modules/schema";

const ProductAttributeSchema = z.array(
    z.object({
        id: z.string().min(1),
        name: z.string().min(1),
        value: z.number(),
    }),
);

export const ProductSectionSchema = z.object({
    sections: z.array(
        z.object({
            name: z.string().min(1),
            attributes: ProductAttributeSchema,
        }),
    ),
});

export const ProductStatusSchema = z.object({
    status: z.enum([StatusEnum.DRAFT, StatusEnum.PUBLISHED], {
        errorMap: () => ({ message: "enum is not valid" }),
    }),
});
export const ProductNameSchema = z.object({
    name: z.string().min(1),
});
export const ProductCategorySchema = z.object({
    category: z.string().min(1),
});
export const ProductDescriptionSchema = z.object({
    description: z.string().min(1).max(30),
});
export const ProductFeaturedSchema = z.object({
    featured: z.string().transform((str) => str.toLowerCase() === "true"),
});
export const ProductPriceSchema = z.object({
    price: z.string().transform((data) => parseInt(data)),
});
export const ProductDefaultAttributeSchema = z.object({
    default_attributes: z.array(
        z.object({
            id: z.string().min(1),
            section: z.string().min(1),
            name: z.string().min(1),
        }),
    ),
});
export const ProductIdSchema = z.object({
    id: z.string().min(1),
});

export type TProductAttributeSchema = TypeOf<typeof ProductAttributeSchema>;
export type TProductDefaultAttributeSchema = TypeOf<
    typeof ProductDefaultAttributeSchema
>;
