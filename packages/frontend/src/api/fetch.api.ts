import { request } from './fetch-wrapper';

const headers = { 'Content-Type': 'application/json' };
const reqInit: RequestInit = { headers };
const api = {
  get: <TResponse>(url: string) => request<TResponse>(url, reqInit),
  post: <ReqBody, TResponse>(url: string, reqBody: ReqBody) => request<TResponse>(url, { ...reqInit, method: 'POST', body: JSON.stringify(reqBody) }),
  delete: <TResponse>(url: string) => request<TResponse>(url, { ...reqInit, method: 'DELETE' }),
  patch: <ReqBody, TResponse>(url: string, reqBody: ReqBody) =>
    request<TResponse>(url, { ...reqInit, method: 'PATCH', body: JSON.stringify(reqBody) }),
  put: <ReqBody, TResponse>(url: string, reqBody: ReqBody) => request<TResponse>(url, { ...reqInit, method: 'PUT', body: JSON.stringify(reqBody) }),
};

export { api };
