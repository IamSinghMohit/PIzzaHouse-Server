import { z, TypeOf } from "zod";
import {
    TopingNameSchema,
    TopingPriceSchema,
    TopingStatusSchema,
} from "./main";

const schema = z
    .object({
        categories: z.array(z.string()),
    })
    .merge(TopingNameSchema)
    .merge(TopingPriceSchema)
    .merge(TopingStatusSchema)
    .partial();

export const UpdateTopingSchema = z
    .object({
        id: z.string().nonempty(),
    })
    .merge(schema);

export type TUpdateTopingSchema = TypeOf<typeof UpdateTopingSchema>;
