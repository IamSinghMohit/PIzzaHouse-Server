import { z, TypeOf } from "zod";

const AttributeSchema = z.array(
    z.object({
        title: z.string(),
        value: z.number(),
    })
);
export const ProductAttrSchema = z.object({
    attribute_title: z.string(),
    attributes: AttributeSchema,
});

export interface AttributeSchemaType extends TypeOf<typeof AttributeSchema> {}
export interface ProductAttrSchema extends TypeOf<typeof ProductAttrSchema> {}
