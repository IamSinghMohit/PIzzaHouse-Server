import UserDto from "../dto/user.dto";
import { UserModel } from "../models/user.model";
class UserService {
    static async findUser(filter: Record<string, string>) {
        const user = await UserModel.findOne(filter);
        return user;
    }

    static async createUser(data: Record<string, string>) {
        return await UserModel.create(data);
    }
    static async findOrCreate(
        condition: Record<string, any>,
        data: Record<string, string>
    ) {
        return await UserModel.findOneAndUpdate(condition, data, {
            new: true,
            upsert: true,
        })
    }
}

export default UserService;
