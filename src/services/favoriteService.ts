import { FavoriteModel } from "../models/favoriteModel.js";
import { UserModel } from "../models/userModel.js";
import { errors } from "../utils/errors/index.js";
import { FavoriteInput } from "../validators/favoriteSchema.js";

export class FavoriteService {

  static async addFavorite(requester: any, { favoriteId }: FavoriteInput) {

    const author = await UserModel.findByEmail({ email: requester.email });
    const favoriteUser = await UserModel.findById({ id: favoriteId });
    if (!favoriteUser) throw errors.badRequest("Favorite user not found");
    if (!author) throw errors.badRequest("User not found");
    if (author.id === favoriteId) throw errors.badRequest("Cannot add yourself as a favorite");

    const favorite = await FavoriteModel.addFavorite({ userId: author.id, favoriteId });

    return favorite;
  }

  static async removeFavorite(requester: any, { favoriteId }: FavoriteInput) {
    const author = await UserModel.findByEmail({ email: requester.email });
    const favoriteUser = await UserModel.findById({ id: favoriteId });
    if (!favoriteUser) throw errors.badRequest("Favorite user not found");
    if (!author) throw errors.badRequest("User not found");
    if (author.id === favoriteId) throw errors.badRequest("Cannot remove yourself as a favorite");

    const favorite = await FavoriteModel.removeFavorite({ userId: author.id, favoriteId });

    return favorite;
  }

  static async getFavorites(requester: any) {
    const author = await UserModel.findByEmail({ email: requester.email });
    if (!author) throw errors.badRequest("User not found");

    const favorites = await FavoriteModel.getFavorites({ userId: author.id });
    const formatted = favorites.map((fav) => fav.favorite);

    return formatted;
  }
}