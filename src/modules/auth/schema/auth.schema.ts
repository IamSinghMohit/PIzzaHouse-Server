import { z, TypeOf } from "zod";
export enum UserRole {
    ADMIN = "admin",
    NORMAL = "normal",
}
export const SigninSchema = z.object({
    first_name: z.string().optional(),
    last_name: z.string().optional(),
    email: z.string().email("Invalid email format"),
    password: z.string(),
    role: z
        .enum([UserRole.ADMIN, UserRole.NORMAL], {
            errorMap: () => ({ message: "enum is not valid" }),
        })
        .optional(),
});
export const LoginSchema = z.object({
    email: z.string().email("Invalid email format"),
    password: z.string().nonempty("Password is required"),
});
export type TSigninSchema = TypeOf<typeof SigninSchema>;
export type TLoginSchema = TypeOf<typeof LoginSchema>;
