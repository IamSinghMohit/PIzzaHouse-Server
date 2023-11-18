import { z } from "zod";

export const searchCategorySchema = z.object({
    name: z.string(),
    limit: z.string().transform((data) => parseInt(data)),
    cursor: z.string().optional(),
});

export const getCategoriesSchema = z.object({
    page: z.string().transform((data) => parseInt(data)),
    limit: z.string().transform((data) => parseInt(data)),
});

export const getAttributeSchema = z.object({
    id: z.string(),
});

export type SearchCategorySchemaType = z.TypeOf<typeof searchCategorySchema>;
export type getCategoriesSchemaType = z.TypeOf<typeof getCategoriesSchema>;
export type GetAttributeSchemaType = z.TypeOf<typeof getAttributeSchema>;
