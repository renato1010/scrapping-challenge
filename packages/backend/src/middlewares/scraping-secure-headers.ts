import { NextFunction, Request, Response } from "express";

const asyncHeadersScraping = async (req: Request, _res: Response, next: NextFunction) => {
  const {url} = req.body;
  next();
};

export { asyncHeadersScraping };
