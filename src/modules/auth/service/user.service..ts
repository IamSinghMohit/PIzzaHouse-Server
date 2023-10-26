import { UserModel } from "../models/user.model";
class UserService {
    static async findUser(filter: Record<string, string>) {
        const user = await UserModel.findOne(filter);
        return user;
    }

    static async createUser(data: Record<string, string>) {
        const user =  new UserModel(data);
        return await user.save();
    }
}

export default UserService;
