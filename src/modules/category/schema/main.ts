import z from "zod";
import { v4 as uuidV4 } from "uuid";

export const CategoryName = z.object({
    name: z.string().min(2),
});
export const CategoryImage = z.object({
    image: z.string(),
});

export const CategoryAttrSchema = z.object({
    price_attributes: z.array(
        z.object({
            id: z.string(),
            attribute_title: z
                .string()
                .min(2)
                .transform((data) => data.toUpperCase()),
            attributes: z.array(
                z.object({
                    id: z.string().transform(() => uuidV4().toString()),
                    title: z.string().transform((data) => data.toUpperCase()),
                })
            ),
        })
    ),
});
