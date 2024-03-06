import { z, TypeOf } from "zod";
import { ProductIdSchema } from "./main";
import { StatusEnum } from "@/modules/schema";

export const GetProductsSchema = z.object({
    name: z.string().optional(),
    page: z
        .string()
        .transform((data) => parseInt(data))
        .optional(),
    limit: z
        .string()
        .transform((data) => parseInt(data))
        .optional(),
    min: z
        .string()
        .refine((value) => !isNaN(parseInt(value)), {
            message: "min must be a valid number",
        })
        .transform((value) => parseInt(value))
        .optional(),
    max: z
        .string()
        .refine((value) => !isNaN(parseInt(value)), {
            message: "max must be a valid number",
        })
        .transform((value) => parseInt(value))
        .optional(),
    category: z.string().optional(),
    status: z
        .enum([StatusEnum.DRAFT, StatusEnum.PUBLISHED], {
            errorMap: (issue, ctx) => ({ message: "enum is not valid" }),
        })
        .optional(),
    featured: z.string().transform((data) => data === "true"),
});
export type TGetProductsSchema = TypeOf<typeof GetProductsSchema>;

export const GetFormatedProductsSchema = z.object({
    categoryLimit: z.number().optional(),
    productLimit: z.number().optional(),
});
export type TGetFromatedProductsSchema = TypeOf<
    typeof GetFormatedProductsSchema
>;

export const GetProductSchema = z.object({}).merge(ProductIdSchema);
export type TGetProductSchema = TypeOf<typeof GetProductSchema>;

export const GetProductPriceSectionSchema = ProductIdSchema;
export type TGetProductPriceSectionSchema = TypeOf<
    typeof GetProductPriceSectionSchema
>;

export const GetCursorPaginatedProducts = z.object({
    name: z.string().optional(),
    limit: z
        .string()
        .transform((data) => parseInt(data))
        .optional(),
    min: z
        .string()
        .refine((value) => !isNaN(parseInt(value)), {
            message: "min must be a valid number",
        })
        .transform((value) => parseInt(value))
        .optional(),
    max: z
        .string()
        .refine((value) => !isNaN(parseInt(value)), {
            message: "max must be a valid number",
        })
        .transform((value) => parseInt(value))
        .optional(),
    category: z.string().optional(),
    cursor: z.string().optional(),
});
export const GetMinimalInfoSchema = z.object({
    id: z.string().optional(),
});
export type TGetMinimalInfoSchema = TypeOf<typeof GetMinimalInfoSchema>;

export type TGetCursorPaginatedProducts = TypeOf<
    typeof GetCursorPaginatedProducts
>;
