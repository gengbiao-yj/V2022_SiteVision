// import type { FormInstance } from 'element-plus'

// 匹配手机号
export const checkPhone = (rule: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error('请输入手机号'));
  } else {
    const reg = /^1[3|4|5|7|8|9][0-9]\d{8}$/;
    if (reg.test(value)) {
      callback();
    } else {
      return callback(new Error('请输入正确的手机号'));
    }
    callback();
  }
};

// 匹配邮箱号
export const checkMail = (rule: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error('请输入邮箱'));
  } else {
    const reg = /^[\w-]+@([\w-]+\.)+(org|com|cc|cn)$/;
    if (reg.test(value)) {
      callback();
    } else {
      return callback(new Error('请输入正确的邮箱'));
    }
    callback();
  }
};

// 匹配新密码
export const checkNewPassword = (rule: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error('请输入密码'));
  } else {
    const reg = /^[0-9a-zA-Z]{6,16}$/;
    if (reg.test(value)) {
      callback();
    } else {
      return callback(new Error('6-16位数字、字母组成，区分大小写'));
    }
    callback();
  }
};
