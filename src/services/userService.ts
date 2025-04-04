import { UserModel } from '../models/userModel';
import { CreateUserInput } from '../validators/userSchema';

export const createUser = async (input: CreateUserInput) => {
  const existing = await UserModel.findByEmail(input.email);
  if (existing) {
    throw new Error('User already exists');
  }
  return await UserModel.createUser(input);
};
