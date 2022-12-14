/**
 * 非 hooks 功能函数、类
 */

/*  资源引入
------------------------------------------------ */
import CryptoJS from 'crypto-js';

/*  数据加密解密
------------------------------------------------ */
export class DataCrypto {
  private key = CryptoJS.enc.Utf8.parse('123456789asdfghj'); // 十六位十六进制数作为密钥
  private iv = CryptoJS.enc.Utf8.parse('asdfghj123456789'); // 十六位十六进制数作为密钥偏移量
  // 加密
  public Encrypt(value: any, isObj = true) {
    const srcs = CryptoJS.enc.Utf8.parse(isObj ? JSON.stringify(value) : value);
    const encrypted = CryptoJS.AES.encrypt(srcs, this.key, {
      iv: this.iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    });
    return encrypted.ciphertext.toString().toUpperCase();
  }

  // 解密
  public Decrypt<T>(cryptValue: any, isObj = true): T {
    const encryptedHexStr = CryptoJS.enc.Hex.parse(cryptValue);
    const srcs = CryptoJS.enc.Base64.stringify(encryptedHexStr);
    const decrypt = CryptoJS.AES.decrypt(srcs, this.key, {
      iv: this.iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    });
    const decryptedStr = decrypt.toString(CryptoJS.enc.Utf8);
    const value = decryptedStr.toString();
    return isObj ? JSON.parse(value) : value;
  }
}

/*  storage 存储封装
------------------------------------------------ */
const cryptoData = new DataCrypto();
export class StorageUtils {
  private jointStorageKey(key: StorageKeyType) {
    return `${process.env.VUE_APP_TITLE}__${key}`;
  }

  // 储存数据
  public setSession(key: StorageKeyType, value: any) {
    const storageValue = {
      value
    };
    sessionStorage.setItem(
      this.jointStorageKey(key),
      cryptoData.Encrypt(storageValue, true)
    );
  }

  public setLocal(key: StorageKeyType, value: any, expire: number) {
    const storageValue = {
      value,
      expirationT: Date.now() + Math.floor(expire)
    };
    localStorage.setItem(
      this.jointStorageKey(key),
      cryptoData.Encrypt(storageValue, true)
    );
  }

  // 获取数据
  public getSession(key: StorageKeyType) {
    const value = sessionStorage.getItem(this.jointStorageKey(key));
    if (value) {
      return cryptoData.Decrypt<SessionStorageValue>(value, true);
    } else {
      return { value: null };
    }
  }

  public getLocal(key: StorageKeyType): GetLocalStorage {
    if (localStorage.getItem(this.jointStorageKey(key))) {
      const value = localStorage.getItem(this.jointStorageKey(key));
      const decryptVal = cryptoData.Decrypt<LocalStorageValue>(value, true);
      if (decryptVal.expirationT > Date.now()) {
        return {
          value: decryptVal.value,
          status: 1,
          msg: '获取成功！'
        };
      } else {
        localStorage.removeItem(this.jointStorageKey(key));
        return {
          value: '',
          status: 0,
          msg: '数据过期，已删除！'
        };
      }
    } else {
      return {
        value: '',
        status: 0,
        msg: '未找到指定 session 数据！'
      };
    }
  }

  // 清除指定数据
  public removeLocal(key: StorageKeyType) {
    localStorage.removeItem(key);
  }

  public removeSession(key: StorageKeyType) {
    sessionStorage.removeItem(key);
  }
}
