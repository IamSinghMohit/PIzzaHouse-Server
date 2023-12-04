import { z } from "zod";
import { TopingCategory} from "./main";

export const GetTopingWithCategorySchema = z.object({}).merge(TopingCategory)

export type TGetTopingWithCategorySchema  = z.TypeOf<typeof GetTopingWithCategorySchema >;
