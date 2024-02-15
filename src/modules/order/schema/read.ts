import { z, TypeOf } from "zod";

export const TGetAdminOrders = z.object({
    page: z
        .string()
        .transform((data) => parseInt(data))
        .optional(),
    limit: z
        .string()
        .transform((data) => parseInt(data))
        .optional(),
});
export type TGetAdminOrders = TypeOf<typeof TGetAdminOrders>;
