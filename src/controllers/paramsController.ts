import { Request, Response } from 'express';
import { ParamsService } from '../services/paramsService.js';

export const getClimbingLevels = async (req: Request, res: Response) => {
  const climbingLevels = await ParamsService.getClimbingLevels()
  res.status(201).json(climbingLevels);
};

export const getClimbingStyles = async (req: Request, res: Response) => {
  const climbingStyles = await ParamsService.getClimbingStyles()
  res.status(201).json(climbingStyles);
};

export const getEquipment = async (req: Request, res: Response) => {
  const equipment = await ParamsService.getEquipment()
  res.status(201).json(equipment);
};

export const getLanguages = async (req: Request, res: Response) => {
  const languages = await ParamsService.getLanguages()
  res.status(201).json(languages);
};

export const getAllParams = async (req: Request, res: Response) => {
  const climbingStyles = await ParamsService.getAllParams()
  res.status(201).json(climbingStyles);
};