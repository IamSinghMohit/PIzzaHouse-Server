import { z, TypeOf } from "zod";
import { TopingIdSchema } from "./main";

export const DeleteTopingSchema = z.object({}).merge(TopingIdSchema);
export type TDeleteTopingSchema = TypeOf<typeof DeleteTopingSchema>;
