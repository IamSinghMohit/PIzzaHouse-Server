import { z } from "zod";
import { CategoryNameSchema, CategoryPriceSectionSchema } from "./main";

export const CreateCategorySchema = z
    .object({})
    .merge(CategoryPriceSectionSchema)
    .merge(CategoryNameSchema);

export type TCreateCategorySchema = z.TypeOf<typeof CreateCategorySchema>;
