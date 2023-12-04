import { z, TypeOf } from "zod";
import { ProductId, ProductStatusEnum } from "./main";

export const GetProductsSchema = z.object({
    name: z.string().optional(),
    min: z.number(),
    max: z.number(),
    category: z.string().optional(),
    status: z
        .enum([ProductStatusEnum.DRAFT, ProductStatusEnum.PUBLISHED], {
            errorMap: (issue, ctx) => ({ message: "enum is not valid" }),
        })
        .optional(),
    featured: z.boolean().optional(),
});

export const GetFormatedProductsSchema = z.object({
    categoryLimit: z.number().optional(),
    productLimit: z.number().optional(),
});
export const GetProduct = z.object({}).merge(ProductId);

export const GetProductAttributes = ProductId;

export type GetProductsSchemaType = TypeOf<typeof GetProductsSchema>;
export type GetProductAttributesType = TypeOf<typeof GetProductAttributes>;
export type GetFormatedProductsSchemaType = TypeOf<
    typeof GetFormatedProductsSchema
>;
export type GetProductType = TypeOf<typeof GetProduct>;
