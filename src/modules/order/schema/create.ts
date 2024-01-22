import { z, TypeOf } from "zod";
import {
    OrderProductIdSchema,
    OrderProductSectiosSchema,
} from "./main";

export const CreateOrderSchema = z
    .object({
        topings: z.array(z.string()),
        city: z.string(),
        state: z.string(),
        address: z.string(),
        quantity: z.number(),
        user_id: z.string(),
        product_price: z.number(),
    })
    .merge(OrderProductIdSchema)
    .merge(OrderProductSectiosSchema);

export type TCreateOrderSchema = TypeOf<typeof CreateOrderSchema>;
