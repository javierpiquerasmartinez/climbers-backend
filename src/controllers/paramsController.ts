import { Request, Response } from 'express';
import { ParamsService } from '../services/paramsService';

export const getClimbingLevels = async (req: Request, res: Response) => {
  const climbingLevels = await ParamsService.getClimbingLevels()
  res.status(201).json(climbingLevels);
};

export const getClimbingStyles = async (req: Request, res: Response) => {
  const climbingStyles = await ParamsService.getClimbingStyles()
  res.status(201).json(climbingStyles);
};

export const getAllParams = async (req: Request, res: Response) => {
  const climbingStyles = await ParamsService.getAllParams()
  res.status(201).json(climbingStyles);
};