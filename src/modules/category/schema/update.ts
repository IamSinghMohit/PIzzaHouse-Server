import { z, TypeOf } from "zod";

export const UpdateCategorySchema = z.object({
    id: z.string(),
});

export type TUpdateCategorySchema = TypeOf<typeof UpdateCategorySchema>;
