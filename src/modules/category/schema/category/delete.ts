import {z} from "zod"

export const deleteCategorySchema = z.object({
    image: z.string(),
    id: z.string(),
});

export type DeleteCategorySchemaType = z.TypeOf<typeof deleteCategorySchema>;
