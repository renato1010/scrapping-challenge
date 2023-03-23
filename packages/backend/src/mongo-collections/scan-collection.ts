import type { SecureHeadersVals } from "../middlewares";

type SecureHeadersRecord = Record<
  "x-frame-options" | "strict-transport-security" | "content-security-policy",
  SecureHeadersVals
>;
export interface URLScans extends Partial<SecureHeadersRecord> {
  url: string;
  createdAT: Date;
}
