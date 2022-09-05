/**
 * 各业务接口请求参数的类型集合
 */

/*  业务 - User 模块各接口的请求参数泛型
------------------------------------------------ */
// 登录接口
interface UserLoginParams {
  loginName: string; // 账号
  pwd: string; // 密码
  browser: string; // 浏览器信息
  userName: string; // 对接系统用户
  positionID: number; // 对接系统部门ID
}

// 修改密码接口
interface changePwdParams {
  loginName: string; // 登录名
  newPwd: string; // 新密码
  pwd: string; // 旧密码
  cusNo: string;
}

/*  业务 - 通用模块各接口的请求参数泛型
------------------------------------------------ */
// 省市区查询接口
interface DataAreaParams {
  JoinCode: string;
  TypeID: number;
}

/*  业务 - 列表模块各接口的请求参数泛型
------------------------------------------------ */
// 机会点列表接口、门店列表接口
interface ListViewParams {
  cusNo: string; // 企业编号
  provinceCode: string; // 省份编码
  cityCode: string; // 城市编码
  districtCode: string; // 区县编码
  parameter: string; // 模糊查询参数
  size: number; // 每页长度
  page: number; // 页码
}

export type {
  UserLoginParams,
  DataAreaParams,
  ListViewParams,
  changePwdParams
};
