import { StatusEnum } from "@/modules/schema";
import { z, TypeOf } from "zod";

export const TopingNameSchema = z.object({
    name: z.string().min(2),
});
export const TopingPriceSchema = z.object({
    price: z.number(),
});
export const TopingCategorySchema = z.object({
    category: z.string().min(2),
});
export const TopingStatusSchema = z.object({
    status: z.enum([StatusEnum.DRAFT, StatusEnum.PUBLISHED], {
        errorMap: () => ({ message: "enum is not valid" }),
    }),
});
export const TopingIdSchema = z.object({
    id:z.string()
})
