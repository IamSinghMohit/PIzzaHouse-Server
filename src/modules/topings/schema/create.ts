import { z } from "zod";
import {
    TopingNameSchema,
    TopingPriceSchema,
    TopingStatusSchema,
} from "./main";

export const CreateTopingSchema = z
    .object({
        categories:z.array(z.string())
    })
    .merge(TopingNameSchema)
    .merge(TopingPriceSchema)
    .merge(TopingStatusSchema);

export type TCreateTopingSchema = z.TypeOf<typeof CreateTopingSchema>;
