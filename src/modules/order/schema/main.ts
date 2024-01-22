import { z, TypeOf } from "zod";

export enum OrderStatusEnum {
    PLACED = "placed",
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

export type TOrderObject = {
    order: {
        price: number;
        status: string;
        user_full_name: string;
        product_name: string;
        address:string;
        image: string;
        quantity: number;
    };
    order_detail: {
        product_name: string;
        toping: {
            price: number;
            name: string;
            image: string;
        }[];
        product_sections: {
            name: string;
            attribute: string;
            value: number;
        }[];
    };
};
