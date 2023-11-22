import bcrypt from "bcrypt";
import {
    prop,
    pre,
    DocumentType,
    getModelForClass,
} from "@typegoose/typegoose";
import { TimeStamps, Base } from "@typegoose/typegoose/lib/defaultClasses";
import { UserRole } from "../schema/auth.schema";

@pre<User>("save", async function (next) {
    // only hash the password if it has been modified (or is new)
    if (!this.isModified("password")) return next();

    // Random additional data
    const salt = await bcrypt.genSalt(10);

    const hash = await bcrypt.hash(this.password, salt);

    // Replace the password with the hash
    this.password = hash;

    return next();
})
class User extends TimeStamps {
    @prop({ required: false })
    googleId?: string;

    @prop({ required: true })
    name: string;

    @prop({ required: true })
    lastname: string;

    @prop({ required: false })
    avatar: string;

    @prop({ unique: true, required: true })
    email: string;

    @prop({ required: true })
    password: string;

    @prop({ enum: UserRole, required: false })
    role: UserRole;

    async comparePassword(this: DocumentType<User>, candidatePassword: string) {
        return bcrypt
            .compare(candidatePassword, this.password)
            .catch(() => false);
    }
}

export const UserModel = getModelForClass(User);

export type UserType = Pick<
    DocumentType<User>,
    | "avatar"
    | "lastname"
    | "email"
    | "password"
    | "role"
    | "name"
    | "googleId"
    | "_id"
    | "createdAt"
    | "updatedAt"
>;
