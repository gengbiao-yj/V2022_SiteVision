/*  常用 Api 封装，供业务调用
------------------------------------------------ */
// 省市区接口
import { dataArea } from '@/apis/user';

export const getDataArea = async (JoinCode: string, TypeID: number) => {
  try {
    const { code, data } = await dataArea({
      JoinCode,
      TypeID
    });
    if (code === 200) {
      return reactive(data);
    } else {
      return null;
    }
  } catch (error) {
    console.log(error);
  }
};
