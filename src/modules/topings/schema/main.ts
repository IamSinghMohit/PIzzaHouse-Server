import { z, TypeOf } from "zod";

export const TopingName = z.object({
    name:z.string()
})
export const TopingPrice = z.object({
    price:z.number()
})
export const TopingCategory = z.object({
    category:z.string()
})
