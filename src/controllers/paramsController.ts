import { Request, Response } from 'express';
import { ParamsService } from '../services/paramsService';

export const getClimbingLevels = async (req: Request, res: Response) => {
  const climbingLevels = await ParamsService.getClimbingLevels()
  res.status(201).json(climbingLevels);
};
