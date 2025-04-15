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

  static async getLanguages() {
    try {
      const languages = prisma.languages.findMany({ orderBy: { name: 'asc' } })
      return languages;
    } catch (error) {
      throw errors.internal("Error finding Languages");
    }
  }

  static async getEquipment() {
    try {
      const equipment = prisma.equipment.findMany({ orderBy: { name: 'asc' } })
      return equipment;
    } catch (error) {
      throw errors.internal("Error finding Equipment");
    }
  }

  static async getAllParams() {
    try {
      const [climbingStyles, climbingLevels, languages, equipment] = await Promise.all([
        prisma.climbingStyle.findMany({ orderBy: { name: 'asc' } }),
        prisma.climbingLevel.findMany({ orderBy: { name: 'asc' } }),
        prisma.languages.findMany({ orderBy: { name: 'asc' } }),
        prisma.equipment.findMany({ orderBy: { name: 'asc' } }),
      ]);
      return {
        climbingStyles: climbingStyles,
        climbingLevels: climbingLevels,
        equipment: equipment,
        languages: languages
      }
    } catch (error) {
      console.log(error)
      throw errors.internal("Error finding params");
    }
  }
}