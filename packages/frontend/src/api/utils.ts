import { TErrorResponse } from './fetch-wrapper';

export const hasError = <TResponse extends { ok: boolean }>(res: TResponse | TErrorResponse): res is TErrorResponse => {
  return 'ok' in res && !res.ok;
};
