import { z, TypeOf } from "zod";
import { TopingCategorySchema, TopingNameSchema } from "./main";
import { StatusEnum } from "@/modules/schema";

export const GetTopingWithCategorySchema = z
    .object({})
    .merge(TopingCategorySchema);

export const GetAllTopingsSchema = z.object({
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
});

export type TGetTopingWithCategorySchema = z.TypeOf<
    typeof GetTopingWithCategorySchema
>;
export type TGetAllTopingsSchema = TypeOf<typeof GetAllTopingsSchema>;
