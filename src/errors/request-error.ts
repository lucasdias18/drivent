import { ApplicationError, RequestError } from '@/protocols';

export function requestError(status: number, statusText: string): RequestError {
  return {
    name: 'RequestError',
    data: null,
    status,
    statusText,
    message: 'No result for this search!',
  };
}

export function badRequestError(): ApplicationError {
  return {
    name: 'badRequestError',
    message: 'bad request',
  };
}
