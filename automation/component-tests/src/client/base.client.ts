import axios, { AxiosResponse } from 'axios';
import {URLBuilder} from 'url-assembler';
import { HTTPMethod, Json, ServiceClientConfig } from '../utils/service-client/service.types';
import { APIResponse } from '../utils/service-client/api-response';

export abstract class ServiceClient {
  url?: string = process.env.API_URL;
  readonly prefix?: string;
  

  get name() {
    return this.constructor.name;
  }

  protected _get<T>(resource: string, options?: ServiceClientConfig) {
    return this._request<T>('get', resource, { ...options });
  }

  protected async _request<T>(
    method: HTTPMethod,
    resource: string,
    options: ServiceClientConfig = {}
  ): Promise<APIResponse<T>> {
    const url = `${this.url}${resource}`

    const config = {
      method,
      url,
      validateStatus,
      ...options,
      headers: {
        ...options.headers
      }
    };
    const name = this.name;
    let description = 'Made a HTTP Request';
    const { schema: _, ...rawOptions } = options;
    console.log({ name, description, url, ...rawOptions });
    let result: AxiosResponse;
    try {
      result = await axios(config);
    } catch (e) {
      throw e;
    }
    const { status, data, headers, statusText } = result;
    description = 'HTTP Response received';
    console.log({ name, description, status, statusText, headers, data });
    if (result && 'schema' in config && config['schema']) {
      validate(options?.schema, result.data) as unknown as T;
    }
    return new APIResponse<T>(result);
  }
}

function validate(schema: any, value: Json) {
  return schema?.parse(value) ?? value;
}

function validateStatus(status: number) {
  return status >= 0 && status < 600;
}
