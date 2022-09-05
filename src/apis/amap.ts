/**
 * 第三方 - 高德地图 API
 */
import axios from 'axios';
import { AMAP } from '@/plugin/Axios/config';
import type { AmapV3IP } from '@/types/index';

// IP 定位
const amapIP = async () => {
  try {
    const { data } = await axios.get('https://restapi.amap.com/v3/ip', {
      params: {
        key: AMAP.AMAP_WEBKEY
      }
    });
    return Promise.resolve(data) as Promise<AmapV3IP>;
  } catch (error) {
    return Promise.reject(error);
  }
};

export { amapIP };
