import type { ErrorStatus } from './get-error-success-responses';
import { getErrorMessage } from './handling-catch-error';
import { MapHttpErrorStatusToMessage } from './map-httpstatus-codes';

export type TErrorResponse = { ok: false; status: ErrorStatus; message: string };
async function request<TResponse>(url: string, config: RequestInit = {}): Promise<TResponse | TErrorResponse> {
  let response: Response | undefined = undefined;
  response = await fetch(url, config);
  if (response.ok) {
    return await response.json();
  }
  // handle the error
  const errMsg = response?.statusText ?? null;
  const errorStatusCode = (response?.status as ErrorStatus) ?? null;
  let errorRes: TErrorResponse;
  if (errMsg && errorStatusCode) {
    errorRes = {
      ok: false,
      status: errorStatusCode,
      message: MapHttpErrorStatusToMessage[errorStatusCode],
    };
    return errorRes;
  } else {
    const opaqueErrStatus = errorStatusCode || 400;
    const errMsg = getErrorMessage(opaqueErrStatus);
    return { ok: false, status: opaqueErrStatus, message: errMsg };
  }
}

export { request };
