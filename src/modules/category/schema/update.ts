import { z, TypeOf } from "zod";
import {
    CategoryIdSchema,
    CategoryNameSchema,
    CategoryPriceSectionSchema,
} from "./main";

export const UpdateCategorySchema = z
    .object({
        is_name_updated: z.boolean(),
        is_image_updated: z.boolean(),
        is_sections_updated: z.boolean(),
    })
    .merge(CategoryIdSchema)
    .merge(CategoryNameSchema)
    .merge(CategoryPriceSectionSchema);

export type UpdateCategorySchemaType = TypeOf<typeof UpdateCategorySchema>;

