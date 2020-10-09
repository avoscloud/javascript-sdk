/* eslint-disable @typescript-eslint/no-explicit-any */

import { RequestOptions, Response } from '@leancloud/adapter-types';
import { HTTPRequest, HTTPResponse } from '../app/http';
import { unmarshalURL } from './url';
import { AdapterManager } from '../app/adapters';

class TestStorage {
  private static _map = new Map<string, string>();

  static setItem(key: string, value: string): void {
    this._map.set(key, value);
  }

  static getItem(key: string): string {
    return this._map.get(key);
  }

  static removeItem(key: string): void {
    this._map.delete(key);
  }

  static clear(): void {
    this._map.clear();
  }
}

class TestAdapter {
  static requests: HTTPRequest[] = [];
  static responses: Partial<HTTPResponse>[] = [];

  static storage = TestStorage;

  static async request(url: string, options?: RequestOptions): Promise<Response> {
    const components = unmarshalURL(url);
    TestAdapter.requests.push({
      method: options?.method,
      baseURL: components.host,
      path: components.path,
      header: options?.headers,
      query: components.query,
      body: options?.data,
    });

    if (TestAdapter.responses.length) {
      const res = TestAdapter.responses.pop();
      return {
        status: res.status ?? 200,
        headers: res.header ?? {},
        data: res.body as any,
      };
    }
    return { status: 200, headers: {}, data: {} };
  }
}

export const adapters = TestAdapter;

if (!AdapterManager.isSet) {
  AdapterManager.set(adapters);
}