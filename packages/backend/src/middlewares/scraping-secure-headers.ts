import type { NextFunction, Request, Response } from "express";
import { gotScraping } from "got-scraping";

const SECURITY_HEADERS = ["x-frame-options", "strict-transport-security", "content-security-policy"] as const;
type SecureHeadersTuple = typeof SECURITY_HEADERS;
type SecureHeadersKeys = SecureHeadersTuple[number];
type SecureHeadersVals = { value: string; ok: boolean };
type SecureHeadersInfo = Record<SecureHeadersKeys, SecureHeadersVals> | {};

// if HSTS max-age > half year; is ok
const isOKHSTSMaxAge = (headerVal: string | string[] | undefined): boolean => {
  const HALF_YEAR_IN_SECONDS = 15_552_000;
  if (!headerVal || Array.isArray(headerVal)) return false;
  headerVal = headerVal.trim();
  const hstsAgeReg = /max-age=(\d+).*/gi;
  const regexRes = hstsAgeReg.exec(headerVal);
  if (regexRes == null) return false;
  const [, age] = regexRes;
  if (!age || Number.isNaN(age)) return false;
  const ageInSecs = parseInt(age);
  return ageInSecs > HALF_YEAR_IN_SECONDS;
};
// if CSP header contains at least 2 of directives default-src/script-src/img-src in policy; is ok
const isOKCSP = (headerVal: string | string[] | undefined): boolean => {
  if (!headerVal || Array.isArray(headerVal)) return false;
  let safeDirectivesCounter = 0;
  const okPolicy = ["default-src", "script-src", "img-src"];
  for (let directive of okPolicy) {
    if (headerVal.toLowerCase().includes(directive)) {
      safeDirectivesCounter++;
    }
  }
  return safeDirectivesCounter >= 2;
};
const getSecureHeaders = (headers: Request["headers"]) => {
  let secureHeaderChecks: SecureHeadersInfo = {};
  let headerEntries = Object.entries(headers);
  headerEntries.forEach(([key, val]) => {
    const headerKeyLower = key.toLowerCase();
    switch (headerKeyLower) {
      case "x-frame-options":
        secureHeaderChecks = { ...secureHeaderChecks, "x-frame-options": { value: val, ok: true } };
        break;
      case "strict-transport-security":
        secureHeaderChecks = {
          ...secureHeaderChecks,
          "strict-transport-security": { value: val, ok: isOKHSTSMaxAge(val) },
        };
        break;
      case "content-security-policy":
        secureHeaderChecks = {
          ...secureHeaderChecks,
          "content-security-policy": { value: val, ok: isOKCSP(val) },
        };
        break;
      default:
        break;
    }
  });
  return secureHeaderChecks;
};
// extend Request object locally
 export interface RExtended extends Request<{}, {}, { url: string }> {
  secureHeaders?: SecureHeadersInfo;
}
const asyncHeadersScraping = async (req: RExtended, _res: Response, next: NextFunction) => {
  const { url } = req.body;
  const { headers } = await gotScraping(url);
  req.secureHeaders = getSecureHeaders(headers);
  next();
};

export { asyncHeadersScraping };
