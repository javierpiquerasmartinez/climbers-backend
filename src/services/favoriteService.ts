import { FavoriteModel } from "../models/favoriteModel";
import { UserModel } from "../models/userModel";
import { FavoriteInput } from "../validators/favoriteSchema.js";

export class FavoriteService {

  static async addFavorite(requester: any, { favoriteId }: FavoriteInput) {

    const author = await UserModel.findByEmail(requester.email);
    const favoriteUser = await UserModel.findById(favoriteId);
    if (!favoriteUser) throw new Error("Favorite user not found");
    if (!author) throw new Error("User not found");
    if (author.id === favoriteId) throw new Error("Cannot add yourself as a favorite");

    const favorite = await FavoriteModel.addFavorite({ userId: author.id, favoriteId });

    return favorite;
  }

  static async removeFavorite(requester: any, { favoriteId }: FavoriteInput) {

    const author = await UserModel.findByEmail(requester.email);
    const favoriteUser = await UserModel.findById(favoriteId);
    if (!favoriteUser) throw new Error("Favorite user not found");
    if (!author) throw new Error("User not found");
    if (author.id === favoriteId) throw new Error("Cannot remove yourself as a favorite");

    const favorite = await FavoriteModel.removeFavorite({ userId: author.id, favoriteId });

    return favorite;
  }

  static async getFavorites(requester: any) {
    const author = await UserModel.findByEmail(requester.email);
    if (!author) throw new Error("User not found");

    const favorites = await FavoriteModel.getFavorites({ userId: author.id });
    const formatted = favorites.map((fav) => fav.favorite);

    return formatted;
  }
}