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

export {
  dataType,
  cryptoData,
  storage,
  colorTransition,
  checkMail,
  checkPhone,
  checkNewPassword
};
