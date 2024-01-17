import { z, TypeOf } from "zod";
import {
    OrderPriceSchema,
    OrderProductIdSchema,
    OrderProductSectiosSchema,
} from "./main";

export const CreateOrderSchema = z
    .object({
        topings: z.array(z.string()),
        // first_name: z.string(),
        // last_name: z.string(),
        // city: z.string(),
        // state: z.string(),
        // address: z.string(),
    })
    .merge(OrderProductIdSchema)
    .merge(OrderPriceSchema)
    .merge(OrderProductSectiosSchema);

export type TCreateOrderSchema = TypeOf<typeof CreateOrderSchema>;
