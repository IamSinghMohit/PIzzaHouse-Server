import { z, TypeOf } from "zod";
export enum UserRole {
    ADMIN = "admin",
    NORMAL = "normal",
}
export const SigninSchema = z.object({
    first_name: z.string(),
    last_name: z.string(),
    email: z.string().email("Invalid email format"),
    password: z.string(),
    role: z
        .enum([UserRole.ADMIN, UserRole.NORMAL], {
            errorMap: (issue, ctx) => ({ message: "enum is not valid" }),
        })
        .optional(),
});
export const LoginSchema = z.object({
    email: z.string().email("Invalid email format"),
    password: z.string().nonempty("Password is required"),
});
export type SigninType = TypeOf<typeof SigninSchema>;
export type LoginType = TypeOf<typeof LoginSchema>;
