import Axios from './Axios';
import { BASE_URL, urlKey } from './config';

const baseURL = BASE_URL.get(process.env.NODE_ENV as urlKey);

/*  业务 - 接口封装
------------------------------------------------ */
const http = new Axios({
  baseURL,
  timeout: 100000,
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
    time: '',
    token: '',
    timestamp: '',
    mode: 'cors'
  }
});

export { http };
