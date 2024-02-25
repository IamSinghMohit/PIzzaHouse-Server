import { z, TypeOf } from "zod";
export enum UserRole {
    ADMIN = "admin",
    NORMAL = "normal",
}
export const SigninSchema = z.object({
    first_name: z.string().nonempty("first_name is required"),
    last_name: z.string().nonempty("first_name is required"),
    email: z.string().email("Invalid email format"),
    password: z.string().nonempty("Password is required"),
});
export const LoginSchema = z.object({
    email: z.string().email("Invalid email format"),
    password: z.string().nonempty("Password is required"),
});
export type TSigninSchema = TypeOf<typeof SigninSchema>;
export type TLoginSchema = TypeOf<typeof LoginSchema>;
