import { DataCrypto, StorageUtils } from '@/utils/storage';
import { checkMail, checkPhone, checkNewPassword } from '@/utils/validator';

const cryptoData = new DataCrypto();
const storage = new StorageUtils();

/**
 * 判断数据类型
 * @author GengBiao
 */
export class JudgeDataType {
  private types = [
    'Null',
    'Undefined',
    'Object',
    'Array',
    'String',
    'Number',
    'Boolean',
    'Function',
    'RegExp'
  ] as const;
  private getType(o: any) {
    const str = Object.prototype.toString.call(o);
    return str.match(/\[object (.*?)\]/)![1].toLocaleLowerCase();
  }
  public judgeType(o: any, type: typeof this.types[number]) {
    return type.toLowerCase() === this.getType(o);
  }
}
const dataType = new JudgeDataType();

/**
 * 颜色转换
 * @author GengBiao
 * @param color
 * @param type
 */
function colorTransition(color: string, type: 'rgb' | '#x6' | '#x3') {
  function toRGB(): rgbType {
    color = color.trim();
    if (color.indexOf('#') !== -1 && color.length === 7) {
      return {
        r: parseInt(color.slice(1, 3), 16),
        g: parseInt(color.slice(3, 5), 16),
        b: parseInt(color.slice(5), 16)
      };
    } else if (color.indexOf('#') !== -1 && color.length === 4) {
      return {
        r: parseInt(color.charAt(1) + color.charAt(1), 16),
        g: parseInt(color.charAt(2) + color.charAt(2), 16),
        b: parseInt(color.charAt(3) + color.charAt(3), 16)
      };
    } else {
      return { r: 0, g: 0, b: 0 };
    }
  }
  if (type === 'rgb') return toRGB();
}

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

/**
 * 获取当前时间
 * @author GengBiao
 */
function getNewDate() {
  const d = new Date();
  const year = d.getFullYear();
  const month = d.getMonth() - 0 + 1;
  const date = d.getDate();
  const hour = d.getHours();
  const min = d.getMinutes();
  const sec = d.getSeconds();
  return `${year}-${month}-${date}T${hour}:${min}:${sec}`;
}

/**
 * url string 转 blob数据
 * @param dataurl
 */
function dataURLToBlob(dataurl: string) {
  // 图片转格式
  const arr = dataurl.split(',');
  const mime = arr[0].match(/:(.*?);/) as Array<string>;
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new Blob([u8arr], {
    type: mime[1]
  });
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
  throttle,
  getNewDate,
  dataURLToBlob
};
