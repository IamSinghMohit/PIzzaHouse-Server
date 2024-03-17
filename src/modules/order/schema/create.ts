import { z, TypeOf } from "zod";

export const CreateOrderSchema = z.object({
    products: z
        .array(
            z.object({
                name: z.string().nonempty('name is required'),
                image: z.string().nonempty('image is required'),
                price: z.number().gt(0),
                quantity: z.number().gt(0),
                description: z.string().nonempty('description is required'),
                topings: z.array(
                    z.object({
                        name: z.string().nonempty('name is required'),
                        image: z.string().nonempty('image is required'),
                        price: z.number().gt(0),
                    }),
                ),
            }),
        )
        .max(10),
});

export type TCreateOrderSchema = TypeOf<typeof CreateOrderSchema>;
