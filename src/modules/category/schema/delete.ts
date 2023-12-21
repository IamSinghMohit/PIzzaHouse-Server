import {z} from "zod"

export const DeleteCategorySchema = z.object({
    id: z.string(),
});

export type TDeleteCategorySchema = z.TypeOf<typeof DeleteCategorySchema>;
