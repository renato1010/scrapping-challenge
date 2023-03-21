import { MapHttpStatusToMessage, MapHttpErrorStatusToMessage, MapHttpSuccessStatusToMessage } from './map-httpstatus-codes';

export type HttpStatus = keyof typeof MapHttpStatusToMessage;
export type ErrorStatus = keyof typeof MapHttpErrorStatusToMessage;
export type SuccessStatus = keyof typeof MapHttpSuccessStatusToMessage;

interface HandlerBasicResponse {
  ok: boolean;
  status: HttpStatus;
}

export interface HandlerErrorResponse<ErrorCode extends ErrorStatus = 400> extends HandlerBasicResponse {
  ok: false;
  status: ErrorCode;
  message: (typeof MapHttpErrorStatusToMessage)[ErrorCode];
}
export interface HandlerSuccessResponse<SuccessCode extends SuccessStatus = 200, Data = Record<string, unknown>> extends HandlerBasicResponse {
  ok: true;
  data: Data;
  status: SuccessCode;
}
export function getErrorResponse<ErrorCode extends ErrorStatus>(errorCode: ErrorCode): HandlerErrorResponse<ErrorStatus> {
  return { ok: false, status: errorCode, message: MapHttpErrorStatusToMessage[errorCode] };
}

export function getSuccessResponse<SuccessCode extends SuccessStatus, Data = Record<string, unknown>>(
  successCode: SuccessCode,
  data: Data,
): HandlerSuccessResponse<SuccessCode, Data> {
  return {
    ok: true,
    data,
    status: successCode,
  };
}
