import {
  colorTransition,
  JudgeDataType,
  DataCrypto,
  StorageUtils
} from './others';

import { checkMail, checkPhone, checkNewPassword } from '@/utils/validator';

const cryptoData = new DataCrypto();
const dataType = new JudgeDataType();
const storage = new StorageUtils();

/**
 * 防抖函数
 * @author GengBiao
 * @param fn 回调函数
 * @param delay 延时时间，单位ms
 */

function debounce(fn: Function, delay = 100) {
  let timer: number | null;
  return (...args: any) => {
    if (timer) {
      clearTimeout(timer);
    }
    timer = window.setTimeout(() => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      fn.apply(this, args);
      timer = null;
    }, delay);
  };
}

/**
 * 节流函数
 * @author GengBiao
 * @param fn 回调函数
 * @param delay 延时时间，单位ms
 */

function throttle(fn: Function, delay = 100) {
  let timer: number | null;
  return (...args: any) => {
    if (timer) {
      return;
    }
    timer = window.setTimeout(() => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      fn.apply(this, args);
      timer = null;
    }, delay);
  };
}

export {
  dataType,
  cryptoData,
  storage,
  colorTransition,
  checkMail,
  checkPhone,
  checkNewPassword,
  debounce,
  throttle
};
