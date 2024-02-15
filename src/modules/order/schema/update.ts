import { z, TypeOf } from "zod";
import { OrderStatusEnum } from "./main";

export const OrderStatusSchema = z.object({
    status: z.enum(
        [
            OrderStatusEnum.PLACED,
            OrderStatusEnum.COMPLETED,
            OrderStatusEnum.PREPARING,
            OrderStatusEnum.OUTFORDELIVERY,
        ],
        {
            errorMap: () => ({ message: "enum is not valid" }),
        },
    ),
});
export type TOrderStatusSchema = TypeOf<typeof OrderStatusSchema>;
