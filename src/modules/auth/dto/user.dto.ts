import { UserType } from "../models/user.model";
class UserDto {
    id;
    name;
    avatar;
    role;
    createdAt;
    updatedAt;

    constructor(user: UserType) {
        this.id = user._id;
        this.name = user.name;
        this.avatar = user.avatar || "";
        this.createdAt = user.createdAt;
        this.updatedAt = user.updatedAt;
        this.role = user.role;
    }
}

export default UserDto;
