import { z } from "zod";
import {
    TopingCategorySchema,
    TopingNameSchema,
    TopingPriceSchema,
    TopingStatusSchema,
} from "./main";

export const CreateTopingSchema = z
    .object({
        category_id: z.string().min(2),
    })
    .merge(TopingNameSchema)
    .merge(TopingPriceSchema)
    .merge(TopingStatusSchema);

export type TCreateTopingSchema = z.TypeOf<typeof CreateTopingSchema>;
