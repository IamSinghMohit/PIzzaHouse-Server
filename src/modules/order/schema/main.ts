import { z, TypeOf } from "zod";

export enum OrderStatusEnum {
    PLACED = "placed",
    CONFIRMED = "confirmed",
    PERPARING = "preparing",
    OUTFORDELIVERY = "out-for-delivery",
    COMPLETE = "complete",
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

export const OrderProductSectiosSchema = z.object({
    product_sections: z.array(
        z.object({
            name: z.string(),
            attribute: z.string(),
            value: z.number(),
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

export type TOrderTopingSchema = TypeOf<typeof OrderTopingSchema>;
