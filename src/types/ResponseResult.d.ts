/**
 * 接口响应数据的类型集合
 */

/*  业务 - 定义后台返回数据的泛型；<T> 业务数据泛型
------------------------------------------------ */
// 接口请求统一返回的数据结构
interface ResponseResult<T> {
  code: number;
  message: string;
  data: T;
}

/*  业务 - User 模块各接口返回数据泛型
------------------------------------------------ */
// 登录接口
interface UserLogin {
  avatar: string; // 头像路径
  positionID: number; // 职务ID
  token: string;
  userId: number; // 用户ID
  userName: string;
  cusNo: string;
  loginName: string; // 姓名
  phone: string;
  mail: string;
  leader: string; // 直属领导
  dept: string; // 部门名称
  position: string; // 职务名称
}

/*  业务 - 通用模块各接口返回数据泛型
------------------------------------------------ */
// 省市区查询接口
interface DataArea {
  cnName: string;
  code: string;
  createDate: string;
  enName: null | string;
  id: number;
  joinCode: string;
  remark: null | string;
  selected: number;
  typeID: number;
}

// 图片上传
interface UploadImg {
  message: string;
  url: string;
}

/*  业务 - 列表模块各接口的返回数据泛型
------------------------------------------------ */
// 机会点列表接口、门店列表接口
interface ListView {
  rows: Array; // 表格数据
  total: number; // 总数
}

/*  业务 - 系统管理模块各接口返回数据泛型
------------------------------------------------ */
// 企业信息
interface CompanyInfo {
  backImg: string; // 背景图
  cusName: string; // 企业名称
  logo: string; // 企业logo
}

// 品牌信息
interface BrandInfo {
  brandCode: string;
  brandId: number;
  cnName: string;
  creator: string;
  cusNo: string;
  enName: string;
  siteIcon: string;
  storeIcon: string;
}

// 企业、品牌集合信息
interface Company {
  brandList: Array<BrandInfo>;
  companyInfo: CompanyInfo;
}

// 图层样式信息
interface MapStyle {
  cusNo: string; // 企业代码
  fillColor: string; // 填充色
  fillOpacity: string; // 填充色透明度
  icon: string;
  layCode: string;
  layName: string; // 图层名称
  layerID: number;
  outlineColor: string; // 边框颜色
  outlineOpacity: string; // 边框颜色透明度
  outlineType: string; // 边框类型：实线、虚线
  outlineWidth: string | number; // 边框宽度
}

// 城市信息
interface CityInfo {
  cnName: string;
  code: string;
  createDate: string;
  enName: string;
  id: number;
  joinCode: string;
  remark: string;
  selected: number;
  typeID: number;
}

// 城市维护
interface CusCityList {
  allCityList: Array<CityInfo>;
  selectCityList: Array<CityInfo>;
}

/*  第三方 - 高德地图
------------------------------------------------ */
// IP 定位
interface AmapV3IP {
  city: string; // 城市名称
  province: string; // 省份名称
  rectangle: string; // 城市所在矩形区域，左下右上对标对坐标集
  status: '0' | '1'; // 返回状态值
  adcode: string; // 城市 adcode 编码
  centerLngLat: {
    lng: number;
    lat: number;
  }; // rectangle 算出的中心点
}

