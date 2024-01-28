import { z, TypeOf } from "zod";
import {
    TopingNameSchema,
    TopingPriceSchema,
    TopingStatusSchema,
} from "./main";

const schema = z
    .object({})
    .merge(TopingNameSchema)
    .merge(TopingPriceSchema)
    .merge(TopingStatusSchema)
    .partial();

export const UpdateTopingSchema = z
    .object({
        id: z.string().min(2),
    })
    .merge(schema);

export type TUpdateTopingSchema = TypeOf<typeof UpdateTopingSchema>;
