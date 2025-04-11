import prisma from "../prisma/client.js";
import { errors } from "../utils/errors/index.js";

export class ParamsModel {
  static async getClimbingLevels() {
    try {
      const climbingLevels = prisma.climbingLevel.findMany({ orderBy: { name: 'asc' } })
      return climbingLevels;
    } catch (error) {
      console.log(error)
      throw errors.internal("Error finding Climbing Levels");
    }
  }
}