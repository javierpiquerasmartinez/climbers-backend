import { ParamsModel } from "../models/paramsModel.js";

export class ParamsService {

  static async getClimbingLevels() {
    return await ParamsModel.getClimbingLevels();
  }

  static async getClimbingStyles() {
    return await ParamsModel.getClimbingStyles();
  }

  static async getEquipment() {
    return await ParamsModel.getEquipment();
  }

  static async getLanguages() {
    return await ParamsModel.getLanguages();
  }

  static async getAllParams() {
    return await ParamsModel.getAllParams();
  }

}