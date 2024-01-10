import { UserType } from "../models/user.model";
class UserDto {
    id;
    first_name;
    last_name;
    avatar;

    constructor(user: UserType) {
        this.id = user._id;
        this.first_name = user.first_name;
        this.last_name = user.last_name ;
        this.avatar = user.avatar;
    }
}

export default UserDto;
