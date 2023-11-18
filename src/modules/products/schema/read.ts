import {z} from "zod"

const GetCategorySchema = z.object({
    category:z.string(),
})