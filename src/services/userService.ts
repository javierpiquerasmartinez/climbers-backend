import { UserModel } from '../models/userModel.js';
import { CreateUserInput } from '../validators/userSchema.js';

export const createUser = async (input: CreateUserInput) => {
  const existing = await UserModel.findByEmail(input.email);
  if (existing) {
    throw new Error('User already exists');
  }
  return await UserModel.createUser(input);
};
