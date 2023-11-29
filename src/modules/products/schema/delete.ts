import { z, TypeOf } from "zod";
import { Id } from "./main";

export const DeleteProduct = Id;

export type DeleteProductType = TypeOf<typeof DeleteProduct>;
