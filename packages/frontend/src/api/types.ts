type ApiStatus = 'IDLE' | 'PENDING' | 'SUCCESS' | 'ERROR';
const SECURITY_HEADERS = ['x-frame-options', 'strict-transport-security', 'content-security-policy'] as const;
type SecureHeadersTuple = typeof SECURITY_HEADERS;
type SecureHeadersKeys = SecureHeadersTuple[number];
type SecureHeadersVals = { value: string; ok: boolean };
type SecureHeadersInfo = Record<SecureHeadersKeys, SecureHeadersVals> | Record<string, never>;

export type { ApiStatus, SecureHeadersInfo };
