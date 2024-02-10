import { z, TypeOf } from "zod";

export const CreateOrderSchema = z.object({
    products: z.array(
        z.object({
            name: z.string().min(1),
            image: z.string().min(1),
            price: z.number().gt(0),
            quantity: z.number().gt(0),
        }),
    ).max(10),
    city: z.string().min(1),
    state: z.string().min(1),
    address: z.string().min(1),
});

export type TCreateOrderSchema = TypeOf<typeof CreateOrderSchema>;
