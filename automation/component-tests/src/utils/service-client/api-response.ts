import {
    AxiosResponse,
    AxiosResponseHeaders,
    InternalAxiosRequestConfig,
    RawAxiosResponseHeaders
  } from 'axios';
  import { Schema } from './service.types';
  
  export class APIResponse<T> {
    data: T;
    status: number;
    statusText: string;
    config: InternalAxiosRequestConfig<any>;
    headers: RawAxiosResponseHeaders | AxiosResponseHeaders;
  
    constructor({ data, status, statusText, headers, config }: AxiosResponse<T>, schema?: Schema<T>) {
      this.data = schema ? schema.parse(data) : data;
      this.status = status;
      this.statusText = statusText;
      this.headers = headers;
      this.config = config;
    }
  }
  