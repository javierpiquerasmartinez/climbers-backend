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

  static async getClimbingStyles() {
    try {
      const climbingLevels = prisma.climbingStyle.findMany({ orderBy: { name: 'asc' } })
      return climbingLevels;
    } catch (error) {
      console.log(error)
      throw errors.internal("Error finding Climbing Styles");
    }
  }

  static async getAllParams() {
    try {
      const [climbingStyles, climbingLevels] = await Promise.all([
        prisma.climbingStyle.findMany({ orderBy: { name: 'asc' } }),
        prisma.climbingLevel.findMany({ orderBy: { name: 'asc' } }),
      ]);
      return {
        climbingStyles: climbingStyles,
        climbingLevels: climbingLevels
      }
    } catch (error) {
      console.log(error)
      throw errors.internal("Error finding params");
    }
  }
}