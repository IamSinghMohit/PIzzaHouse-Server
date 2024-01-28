import { z } from "zod";

export const searchCategorySchema = z.object({
    name: z.string(),
    limit: z.string().transform((data) => parseInt(data)),
    cursor: z.string().optional(),
});

export const getCategoriesSchema = z.object({
    name:z.string(),
    page: z.string().transform((data) => parseInt(data)).optional(),
    limit: z.string().transform((data) => parseInt(data)).optional(),
});

export const GetSectionsSchema = z.object({
    id: z.string(),
});

export type TSearchCategorySchema = z.TypeOf<typeof searchCategorySchema>;
export type TGetCategoriesSchema = z.TypeOf<typeof getCategoriesSchema>;
export type TGetCategorySectionsShchema = z.TypeOf<typeof GetSectionsSchema>;
