import { z, TypeOf } from "zod";

export const TopingsSchema = z.object({
    name: z.string(),
    category: z.string(),
    price:z.number()
})

export type TopingsSchemaType = TypeOf<typeof TopingsSchema>