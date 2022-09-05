import axios, { AxiosRequestConfig } from 'axios';
import { ElMessage } from 'element-plus';
import { storage } from '@/utils/index';

export default class Axios {
  private instance; // 实例
  constructor(config: AxiosRequestConfig) {
    this.instance = axios.create(config);
    this.interceptors();
  }

  /**
   * 请求动作
   * @param config 请求配置
   * <D> 泛型：定义接口返回数据 data 的类型格式
   */
  public async request<D>(config: AxiosRequestConfig) {
    return new Promise(async (resolve, reject) => {
      try {
        const response = await this.instance.request<D>(config);
        return resolve(response.data);
      } catch (error) {
        return reject(error);
      }
    }) as Promise<D>;
  }
  // 拦截器
  private interceptors() {
    this.interceptorsRequest();
    this.interceptorsResponse();
  }
  // 请求拦截器
  private interceptorsRequest() {
    this.instance.interceptors.request.use(
      (config: AxiosRequestConfig) => {
        const { value, status } = storage.getLocal('userInfo');
        if (status === 1) {
          config.headers!.token = value.token;
          config.headers!.timestamp = value.timestamp;
          config.headers!.time = new Date().getTime();
        } else {
          config.headers!.token = '';
          config.headers!.timestamp = '';
        }
        return config;
      },
      error => {
        return Promise.reject(error);
      }
    );
  }
  // 响应拦截器
  private interceptorsResponse() {
    this.instance.interceptors.response.use(
      response => {
        return response;
      },
      error => {
        const {
          response: { status, data }
        } = error;
        switch (status) {
          case 401:
            ElMessage.warning(`后台错误码：401`);
            break;
          case 402:
            ElMessage.warning(`后台错误码：402`);
            break;
          case 403:
            ElMessage.warning(`后台错误码：404`);
            break;
          default:
            if (data?.message) ElMessage.error(data.message);
        }
        return Promise.reject(error);
      }
    );
  }
}
