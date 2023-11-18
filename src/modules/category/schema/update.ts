import { z, TypeOf} from "zod";
import { v4 as uuidV4 } from "uuid";

export const UpdateCategorySchema = z.object({
    id:z.string(),
    is_name_update: z.boolean(),
    is_image_update: z.boolean(),
    is_price_attributes_update: z.boolean(),
    name: z.string().min(2).optional(),
    price_attributes: z
        .array(
            z.object({
                id: z.string(),
                attribute_title: z
                    .string()
                    .min(2)
                    .transform((data) => data.toUpperCase()),
                attributes: z.array(
                    z.object({
                        id: z.string().transform(() => uuidV4().toString()),
                        title: z
                            .string()
                            .transform((data) => data.toUpperCase()),
                    })
                ),
            })
        )
        .optional(),
});

export type UpdateCategorySchemaType = TypeOf<typeof UpdateCategorySchema>