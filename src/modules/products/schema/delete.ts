import { z, TypeOf } from "zod";
import { ProductId } from "./main";

export const DeleteProduct = ProductId ;

export type DeleteProductType = TypeOf<typeof DeleteProduct>;
