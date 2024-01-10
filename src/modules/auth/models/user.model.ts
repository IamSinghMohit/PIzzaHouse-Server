import bcrypt from "bcrypt";
import {
    prop,
    pre,
    DocumentType,
    getModelForClass,
    index,
    modelOptions,
} from "@typegoose/typegoose";
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
@index({ email: 1 }, { unique: true })
@modelOptions({
    schemaOptions: {
        versionKey: false,
    },
})
class User {
    @prop({ required: true, type: String })
    first_name: string;

    @prop({ required: false, type: String })
    last_name: string;

    @prop({ unique: true, required: true, type: String })
    email: string;

    @prop({ required: false, type: String ,unique:true})
    googleId?: string;

    @prop({ required: false, type: String })
    avatar: string;

    @prop({ required: false, type: String })
    password: string;

    @prop({ enum: UserRole, required: false, default: "normal" })
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
    | "email"
    | "password"
    | "role"
    | "first_name"
    | "last_name"
    | "googleId"
    | "_id"
>;
