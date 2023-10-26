import { z } from "zod";

const attributeTitle = z.object({
    attribute_title: z.string(),
});
const categoryId = z.object({
    categoryId: z.string(),
});

const attributes = z.object({
    attributes: z.array(
        z.object({
            id: z.string(),
            title: z.string(),
        })
    ),
});
