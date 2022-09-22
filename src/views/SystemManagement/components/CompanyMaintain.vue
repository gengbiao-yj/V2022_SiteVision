<!-- name: 企业维护 -->
<script setup lang="ts">
import { saveCompanyInfo } from '@/apis/user';
import { ElMessage } from 'element-plus';
import type { FormInstance } from 'element-plus';

interface PropsType {
  companyInfo: CompanyInfo;
}
const props = defineProps<PropsType>();

const emits = defineEmits(['onSuccess']);

const editSwitch = ref(false); // 编辑动作
// 重置企业信息
const resetInfo = () => {
  companyInfo.value.cusName = initCompanyInfo.value.cusName;
  companyInfo.value.logo = initCompanyInfo.value.logo;
  companyInfo.value.backImg = initCompanyInfo.value.backImg;
};

// 校验
const rulesRef = ref<FormInstance>(); // form 表单实例
const rules = reactive({
  cusName: [{ required: true, message: '请输入用户名', trigger: 'blur' }]
});

// 获取企业信息
const initCompanyInfo = ref<CompanyInfo>({
  backImg: '',
  cusName: '',
  logo: ''
});
const companyInfo = ref<CompanyInfo>({
  backImg: '',
  cusName: '',
  logo: ''
});

watch(
  () => props.companyInfo,
  newV => {
    initCompanyInfo.value = { ...newV };
    companyInfo.value = { ...newV };
  },
  {
    immediate: true
  }
);

// 保存企业信息
const saveInfo = async () => {
  if (rulesRef.value) {
    try {
      const res = await rulesRef.value.validate();
      if (res && companyInfo.value) {
        const { data, code } = await saveCompanyInfo(companyInfo.value);
        if (code === 200) {
          ElMessage.success('保存成功');
          editSwitch.value = false;
          emits('onSuccess');
        } else {
          ElMessage.error('保存失败');
        }
      }
    } catch (e) {
      ElMessage.error('保存失败');
    }
  } else {
    return;
  }
};
</script>
<script lang="ts">
export default {
  name: 'CompanyMaintain'
};
</script>

<template>
  <div class="info-box">
    <div class="title mg-b-15">
      <div class="left">
        <!--        <UserFilled class="svg-14 mg-r-5" />-->
        <span class="ft-s-13 ft-w-6">企业维护</span>
      </div>
      <div class="right">
        <el-switch
          v-model="editSwitch"
          size="small"
          inline-prompt
          width="45px"
          active-text="编辑"
          inactive-text="编辑"
          inactive-color="#999"
        />
      </div>
    </div>
    <div class="content">
      <el-form
        ref="rulesRef"
        label-position="right"
        label-width="100px"
        :model="companyInfo"
        :rules="rules"
        status-icon
      >
        <el-form-item label="企业名称：" prop="userName">
          <transition name="inOut" mode="out-in" appear>
            <span v-if="!editSwitch" class="pd-l-10">{{
              companyInfo.cusName
            }}</span>
            <el-input v-else v-model="companyInfo.cusName" clearable />
          </transition>
        </el-form-item>
        <el-form-item label="企业logo：">
          <sv-replace-img
            :edit="editSwitch"
            :src="companyInfo.logo"
            :size="90"
            @success="e => (companyInfo.logo = e)"
          />
        </el-form-item>
        <el-form-item label="登录背景：">
          <sv-replace-img
            :edit="editSwitch"
            :src="companyInfo.backImg"
            :size="90"
            @success="e => (companyInfo.backImg = e)"
          />
        </el-form-item>
      </el-form>
    </div>
    <div v-show="editSwitch" class="footer">
      <el-button size="small" @click="resetInfo">重置</el-button>
      <el-button type="primary" size="small" @click="saveInfo">保存</el-button>
    </div>
  </div>
</template>

<style scoped lang="scss">
.info-box {
  padding: 15px 20px;
  width: 100%;
  .title {
    @include box-size(100%, 35px);
    @include flex(row, space-between, center);
    border-bottom: 0.8px solid #dedede;

    > .left {
      @include flex(row, center, center);
    }
  }

  .content {
    .avatar {
      position: relative;
      margin-bottom: 3px;
    }

    .avatar.edit:hover::after {
      content: '更换LOGO';
      display: block;
      cursor: pointer;
      position: absolute;
      top: 0;
      left: 0;
      bottom: 0;
      right: 0;
      background: rgba(0, 0, 0, 0.4);
      color: white;
      font-size: 12px;
      line-height: 35px;
    }
  }

  .footer {
    @include flex(row, flex-end, center);
    height: 45px;
  }
}

//@media screen and (min-width: 100px) {
//  .info-box {
//    width: 100%;
//  }
//}
//
//@media screen and (min-width: 1000px) {
//  .info-box {
//    width: 60%;
//  }
//}
//
//@media screen and (min-width: 1500px) {
//  .info-box {
//    width: 40%;
//  }
//}
</style>
