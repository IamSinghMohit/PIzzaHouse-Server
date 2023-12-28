import { z, TypeOf } from "zod";
import { ProductIdSchema } from "./main";

export const DeleteProduct = ProductIdSchema  ;

export type DeleteProductType = TypeOf<typeof DeleteProduct>;
