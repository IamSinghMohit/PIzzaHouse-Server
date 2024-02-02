import { z, TypeOf } from "zod";
import { OrderProductIdSchema, OrderProductSectiosSchema } from "./main";

export const CreateOrderSchema = z
    .object({
        topings: z.array(z.string()),
        city: z.string().min(1),
        state: z.string().min(1),
        address: z.string().min(1),
        quantity: z.number().gt(0),
        user_id: z.string().min(1),
    })
    .merge(OrderProductIdSchema)
    .merge(OrderProductSectiosSchema);

export type TCreateOrderSchema = TypeOf<typeof CreateOrderSchema>;
