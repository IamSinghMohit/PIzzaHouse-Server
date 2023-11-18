import { z } from "zod";
import { CategoryName, CategoryAttrSchema } from "./main";

export const CreateCategorySchema = z
    .object({})
    .merge(CategoryAttrSchema)
    .merge(CategoryName);

export type CreateCategorySchemaType =  z.TypeOf<typeof CreateCategorySchema>
