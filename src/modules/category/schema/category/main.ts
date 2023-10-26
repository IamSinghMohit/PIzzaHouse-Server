import z from "zod";
export const CategoryName = z.object({
    name: z
        .string()
        .min(2)
        .transform((data) => data.toLocaleLowerCase()),
})
export const CategoryImage = z.object({
    image:z.string()
})
