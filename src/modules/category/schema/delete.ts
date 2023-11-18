import {z} from "zod"

export const deleteCategorySchema = z.object({
    id: z.string(),
});

export type DeleteCategorySchemaType = z.TypeOf<typeof deleteCategorySchema>;
