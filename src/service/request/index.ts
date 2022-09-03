import axios from 'axios';
import type { AxiosInstance, AxiosRequestConfig } from 'axios';
import { createRPCParams } from '@/utils/util';

class Request {
  instance: AxiosInstance;

  constructor(props?: AxiosRequestConfig) {
    this.instance = axios.create(props);
    this.setInterceptors();
  }

  setInterceptors() {
    this.instance.interceptors.request.use(config => {
      return config;
    });
    this.instance.interceptors.response.use(
      response => {
        return response.data;
      },
      error => error
    );
  }

  request<T>(config: AxiosRequestConfig): Promise<T> {
    return new Promise((resolve, reject) => {
      this.instance
        .request<any, T>(config)
        .then(res => {
          resolve(res);
        })
        .catch(error => {
          reject(error);
        })
        .finally(() => {
          //
        });
    });
  }

  get<T = any>(config: AxiosRequestConfig): Promise<T> {
    return this.request<T>({ ...config, method: 'GET' });
  }

  post<T = any>(config: AxiosRequestConfig): Promise<T> {
    return this.request<T>({ ...config, method: 'POST' });
  }

  put<T = any>(config: AxiosRequestConfig): Promise<T> {
    return this.request<T>({ ...config, method: 'PUT' });
  }

  delete<T = any>(config: AxiosRequestConfig): Promise<T> {
    return this.request<T>({ ...config, method: 'DELETE' });
  }

  rPost<T = any>(method: string, params?: any) {
    const rpcParams = createRPCParams(method);
    if (params) {
      rpcParams.params = rpcParams.params.concat(params);
    }
    if (method === 'getBestSymbolPrice' || method === 'getSymbolInfo') {
      rpcParams.params.shift();
    }
    return this.request<{ result?: T; error?: T }>({
      url: '/',
      method: 'POST',
      data: rpcParams
    });
  }
}

export default Request;
