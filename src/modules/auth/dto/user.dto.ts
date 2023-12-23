import { UserType } from "../models/user.model";
class UserDto {
    id;
    name;
    avatar;
    role;
    created_at;
    updated_at;

    constructor(user: UserType) {
        this.id = user._id;
        this.name = user.name;
        this.avatar = user.avatar || "";
        this.created_at = user.createdAt;
        this.updated_at = user.updatedAt;
        this.role = user.role;
    }
}

export default UserDto;
