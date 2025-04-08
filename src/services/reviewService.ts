import { ReviewModel } from "../models/reviewModel";
import { CreateReviewInput, GetUserReviewsInput } from "../validators/reviewSchema";
import { UserService } from "./userService";

export class ReviewService {

  static async createReview(requester: any, { authorId, targetId, rating, comment }: CreateReviewInput) {
    await UserService.requesterIsOwner(requester, { id: authorId });
    if (authorId === targetId) {
      throw new Error('No puedes valorarte a ti mismo');
    }
    const existingReview = await ReviewModel.findReview({ authorId, targetId });
    if (existingReview) {
      throw new Error('Ya has valorado a este usuario');
    }
    const review = await ReviewModel.createReview({ authorId, targetId, rating, comment });
    return review;
  }

  static async getReviewsForUser({ id }: GetUserReviewsInput) {
    return await ReviewModel.getReviewsForUser({ id });
  }

  static async getAverageRatingForUser({ id }: GetUserReviewsInput) {
    const result = await ReviewModel.getAverageRatingForUser({ id });
    return result;
  }

}