import { UserModel } from '../models/userModel.js';
import { CreateUserInput, UpdateUserInput } from '../validators/userSchema.js';

export class UserService {

  static async createUser(input: CreateUserInput) {
    const existing = await UserModel.findByEmail(input);
    if (existing) {
      throw new Error('User already exists');
    }
    return await UserModel.createUser(input);
  };

  static async updateUser(input: UpdateUserInput) {
    const existing = await UserModel.findById(input);
    if (!existing) {
      throw new Error('User not found');
    }
    const userUpdated = await UserModel.updateUser(input);
    return userUpdated;
  };
}
