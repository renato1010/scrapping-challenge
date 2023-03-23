import type { Request, Response, NextFunction } from "express";
import { customUrlValidation, isFQDN } from "../utils";

const isUrlValid = (url: string, next: NextFunction): boolean | void => {
  try {
    const fullURL = new URL(url);
    const fqdnError = isFQDN(fullURL.hostname);
    const urlError = customUrlValidation(url);
    return fqdnError && urlError;
  } catch (error) {
    next(error);
  }
};

export const validateUrl = (req: Request<{}, {}, { url: string }>, res: Response, next: NextFunction) => {
  const url = req.body.url;
  const isValid = isUrlValid(url, next);
  if (!isValid) {
    res.status(400).json({ ok: false, message: "Bad Request:URL not valid" });
  }
  next();
};
