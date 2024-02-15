import { z, TypeOf } from "zod";

export enum OrderStatusEnum {
    PLACED = "placed",
    PREPARING = "preparing",
    OUTFORDELIVERY = "out for delivery",
    COMPLETED = "completed",
}

export const OrderPriceSchema = z.object({
    price: z.number(),
});

export const OrderProductIdSchema = z.object({
    product_id: z.string(),
});

export const OrderProductNameSchema = z.object({
    product_name: z.string(),
});

export const OrderProductSectionsSchema = z.object({
    product_sections: z.array(
        z.object({
            name: z.string().min(1),
            attribute: z.string().min(1),
            value: z.number().gt(0),
        }),
    ),
});

export const OrderTopingSchema = z.object({
    topings: z.array(
        z.object({
            price: z.number(),
            name: z.string(),
            image: z.string(),
        }),
    ),
});

export const OrderParamIdSchema = z.object({
    id: z.string(),
});

export type TOrderParamIdSchema = TypeOf<typeof OrderParamIdSchema>;
