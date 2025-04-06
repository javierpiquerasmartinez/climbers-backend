import { UserModel } from '../models/userModel.js';
import { CreateUserInput, UpdateUserInput } from '../validators/userSchema.js';

export const createUser = async (input: CreateUserInput) => {
  const existing = await UserModel.findByEmail(input.email);
  if (existing) {
    throw new Error('User already exists');
  }
  return await UserModel.createUser(input);
};

export const updateUser = async (input: UpdateUserInput) => {
  const userUpdated = await UserModel.updateUser(input);
  return userUpdated;
};
