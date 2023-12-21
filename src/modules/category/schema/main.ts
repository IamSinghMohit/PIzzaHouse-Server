import z from "zod";
import { v4 as uuidV4 } from "uuid";

export const CategoryNameSchema = z.object({
    name: z.string().min(2),
});
export const CategoryImageSchema = z.object({
    image: z.string(),
});
export const CategoryIdSchema = z.object({
    id: z.string(),
});

export const CategoryPriceSectionSchema = z.object({
    sections: z.array(
        z.object({
            id: z.string(),
            title: z
                .string()
                .min(2)
                .transform((data) => data.toUpperCase()),
            attributes: z.array(
                z.object({
                    id: z.string().transform(() => uuidV4().toString()),
                    name: z.string().transform((data) => data.toUpperCase()),
                })
            ),
        })
    ),
});
