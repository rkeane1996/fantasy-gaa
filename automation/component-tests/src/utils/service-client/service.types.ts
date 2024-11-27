import { AxiosRequestConfig } from 'axios';

export type HTTPMethod = 'get' | 'put' | 'post' | 'delete';
export interface JsonObject {
  [key: string]: string | number | boolean | unknown | null | Json;
}

export type Json = JsonObject | JsonObject[];

export type ServiceClientConfig = AxiosRequestConfig & {
  schema?: { parse: (obj: unknown) => void };
};

export type Schema<T> = { parse: (obj: T) => T };