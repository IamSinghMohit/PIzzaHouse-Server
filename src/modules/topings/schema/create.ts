import { z } from "zod";
import { TopingCategorySchema, TopingNameSchema, TopingPriceSchema, TopingStatusSchema } from "./main";

export const CreateTopingSchema = z
    .object({})
    .merge(TopingNameSchema)
    .merge(TopingPriceSchema)
    .merge(TopingCategorySchema)
    .merge(TopingStatusSchema)

export type CreateTopingSchemaType = z.TypeOf<typeof CreateTopingSchema>;
