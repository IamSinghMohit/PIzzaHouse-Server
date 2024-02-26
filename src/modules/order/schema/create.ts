import { z, TypeOf } from "zod";

export const CreateOrderSchema = z.object({
    products: z
        .array(
            z.object({
                name: z.string().nonempty(),
                image: z.string().nonempty(),
                price: z.number().gt(0),
                quantity: z.number().gt(0),
                description: z.string(),
                topings: z.array(
                    z.object({
                        name: z.string(),
                        image: z.string(),
                        price: z.number(),
                    }),
                ),
            }),
        )
        .max(10),
});

export type TCreateOrderSchema = TypeOf<typeof CreateOrderSchema>;
