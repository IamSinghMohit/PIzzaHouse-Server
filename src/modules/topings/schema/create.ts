import { z } from "zod";
import {
    TopingCategorySchema,
    TopingNameSchema,
    TopingPriceSchema,
    TopingStatusSchema,
} from "./main";

export const CreateTopingSchema = z
    .object({
        category_id: z.string(),
    })
    .merge(TopingNameSchema)
    .merge(TopingPriceSchema)
    .merge(TopingCategorySchema)
    .merge(TopingStatusSchema);

export type TCreateTopingSchema = z.TypeOf<typeof CreateTopingSchema>;
