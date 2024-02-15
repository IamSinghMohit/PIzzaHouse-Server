import { z, TypeOf } from "zod";

export enum StatusEnum {
    DRAFT = "Draft",
    PUBLISHED = "Published",
}
export const ValidateParamsId = z.object({
    id: z.string(),
});
export type TValidateParamsId = TypeOf<typeof ValidateParamsId>;
