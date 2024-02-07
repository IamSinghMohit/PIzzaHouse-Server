import { TUser } from "../models/user.model";
class UserDto {
    id;
    first_name;
    last_name;
    email;
    avatar;

    constructor(user: TUser ) {
        this.id = user._id;
        this.first_name = user.first_name;
        this.last_name = user.last_name ;
        this.avatar = user.avatar;
        this.email = user.email;
    }
}

export default UserDto;
