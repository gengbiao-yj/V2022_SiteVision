/**
 * 业务
 */
import { http } from '@/plugin/Axios/index';
import qs from 'qs';

/*  用户
------------------------------------------------ */
// 登录
function login(Data: UserLoginParams) {
  return http.request<ResponseResult<UserLogin>>({
    url: '/user/login',
    method: 'post',
    data: qs.stringify(Data)
  });
}

// 用户信息修改
function saveUser(Data: UserLogin) {
  return http.request<ResponseResult<UserLogin>>({
    url: '/user/saveUser',
    method: 'post',
    data: qs.stringify(Data)
  });
}

// 用户密码修改
function changPwd(Data: changePwdParams) {
  return http.request<ResponseResult<object>>({
    url: '/user/changPwd',
    method: 'post',
    data: qs.stringify(Data)
  });
}

/*  通用
------------------------------------------------ */
// 省市区查询
function dataArea(Data: DataAreaParams) {
  return http.request<ResponseResult<Array<DataArea>>>({
    url: '/common/dataArea',
    method: 'post',
    data: qs.stringify(Data)
  });
}

// 图片上传
function uploadImage(Data: object) {
  return http.request<ResponseResult<UploadImg>>({
    url: '/common/uploadImage',
    method: 'post',
    data: Data
  });
}

// 品牌信息编辑
function updateCusbrand(Data: BrandInfo) {
  return http.request<
    ResponseResult<{
      code: string;
      data: string;
      message: string;
    }>
  >({
    url: '/common/updateCusbrand',
    method: 'post',
    data: qs.stringify(Data)
  });
}

// 品牌删除
function deleteCusbrand(Data: { brandId: number }) {
  return http.request<
    ResponseResult<{
      code: string;
      data: string;
      message: string;
    }>
  >({
    url: '/common/deleteCusbrand',
    method: 'post',
    data: qs.stringify(Data)
  });
}

// 新增品牌信息
function insertCusbrand(Data: BrandInfo) {
  return http.request<
    ResponseResult<{
      code: string;
      data: string;
      message: string;
    }>
  >({
    url: '/common/insertCusbrand',
    method: 'post',
    data: qs.stringify(Data)
  });
}

/*  列表数据
------------------------------------------------ */
// 机会点列表
function listViewSites(Data: ListViewParams) {
  return http.request<ResponseResult<ListView>>({
    url: '/listView/sites',
    method: 'post',
    data: qs.stringify(Data)
  });
}

// 门店列表
function listViewStores(Data: ListViewParams) {
  return http.request<ResponseResult<ListView>>({
    url: '/listView/stores',
    method: 'post',
    data: qs.stringify(Data)
  });
}

// 关注竞品店列表
function listViewCompetitors(Data: ListViewParams) {
  return http.request<ResponseResult<ListView>>({
    url: '/listView/competitor',
    method: 'post',
    data: qs.stringify(Data)
  });
}

// 已有商圈列表
function listViewTas(Data: ListViewParams) {
  return http.request<ResponseResult<ListView>>({
    url: '/listView/ta',
    method: 'post',
    data: qs.stringify(Data)
  });
}

/*  系统管理
------------------------------------------------ */
// 获取企业信息
function getCompanyInfo(Data: { cusNo: string }) {
  return http.request<ResponseResult<Company>>({
    url: '/system/companyInfo',
    method: 'post',
    data: qs.stringify(Data)
  });
}

// 保存企业信息
function saveCompanyInfo(Data: CompanyInfo) {
  return http.request<
    ResponseResult<{
      content: string; // 返回消息
      type: string; // 消息类型
    }>
  >({
    url: '/system/saveCompanyInfo',
    method: 'post',
    data: qs.stringify(Data)
  });
}

export {
  login,
  dataArea,
  listViewSites,
  listViewStores,
  listViewCompetitors,
  listViewTas,
  uploadImage,
  saveUser,
  changPwd,
  getCompanyInfo,
  saveCompanyInfo,
  updateCusbrand,
  insertCusbrand,
  deleteCusbrand
};
