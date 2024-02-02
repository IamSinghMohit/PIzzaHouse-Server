import { z, TypeOf } from "zod";

export enum OrderStatusEnum {
    PLACED = "placed",
    CONFIRMED = "confirmed",
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

export const OrderProductSectiosSchema = z.object({
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

export type TOrderTopingSchema = TypeOf<typeof OrderTopingSchema>;

export type TOrderObject = {
    price: number;
    status: string;
    user_full_name: string;
    address: string;
    image: string;
    user_id:string;
    quantity: number;
    city: string;
    state: string;
    product_name: string;
    toping: {
        price: number;
        name: string;
        image: string;
    }[]
    product_sections: {
        name: string;
        attribute: string;
        value: number;
    }[];
};
