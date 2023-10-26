import {z} from "zod"

export const searchCategorySchema = z.object({
    name: z.string()
})
export type SearchCategorySchemaType  = z.TypeOf<typeof searchCategorySchema >