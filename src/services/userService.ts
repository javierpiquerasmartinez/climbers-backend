import { UserModel } from '../models/userModel.js';
import { errors } from '../utils/errors/index.js';
import { CreateUserInput, DeleteUserInput, UpdateUserInput, UserConversationsInput, UserFiltersInput, UserProfileInput } from '../validators/userSchema.js';

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

  static async updateSelf(requester: any, input: UpdateUserInput) {
    await UserService.requesterIsOwner(requester, input);
    const userUpdated = await UserModel.updateUser(input);
    return userUpdated;
  };

  static async updateUserAvatarUrl(requester: any, id: string, avatarUrl: string) {
    await UserService.requesterIsOwner(requester, { id });
    return await UserModel.updateUserAvatarUrl({ id, avatarUrl });
  }

  static async requesterIsOwner(requester: any, { id }: any) {
    const user = await UserModel.findById({ id });
    if (!user) {
      throw new Error('User not found');
    }
    if (user.email !== requester.email) {
      throw new Error('Unauthorized');
    }
    return true;
  }

  static async getUserWithFilters(filters: UserFiltersInput) {
    return await UserModel.getUserWithFilters(filters);
  };

  static async getUserConversations(requester: any, input: UserConversationsInput) {
    await UserService.requesterIsOwner(requester, input);
    return await UserModel.getUserConversations({ id: input.id });
  };

  static async getCurrentUser(requester: any) {
    const email = requester?.email;
    if (!email) {
      throw new Error('Unauthorized');
    }
    return await UserModel.getCurrentUser({ email: requester.email });
  }

  static async getUserProfile(input: UserProfileInput) {
    const user = await UserModel.getUserProfile({ id: input.id });
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }

  static async deleteUser(requester: any, input: DeleteUserInput) {
    await UserService.requesterIsOwner(requester, input);
    await UserModel.deleteUser({ id: input.id });
  }
}
