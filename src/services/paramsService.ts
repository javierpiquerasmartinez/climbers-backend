import { ParamsModel } from "../models/paramsModel.js";

export class ParamsService {

  static async getClimbingLevels() {
    return await ParamsModel.getClimbingLevels();
  }

}