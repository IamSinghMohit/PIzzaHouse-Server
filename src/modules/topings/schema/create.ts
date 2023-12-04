import { z } from "zod";
import { TopingCategory, TopingName, TopingPrice } from "./main";

export const CreateTopingSchema = z
    .object({})
    .merge(TopingName)
    .merge(TopingPrice)
    .merge(TopingCategory);

export type CreateTopingSchemaType = z.TypeOf<typeof CreateTopingSchema>;
