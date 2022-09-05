<!-- name: 安全设置 -->
<script setup lang="ts">
import { checkNewPassword } from '@/utils';
import { changPwd } from '@/apis/user';
import basicPinia from '@/pinia/storagePinia';
import MD5 from 'js-md5';
import { ElMessage } from 'element-plus';
import type { FormInstance } from 'element-plus';

const basicStore = basicPinia();
const passwordSwitch = ref(false); // 编辑动作
const passwordInfo = reactive({
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
}); // 密码信息

// 重置密码信息
const resetInfo = () => {
  passwordInfo.oldPassword = '';
  passwordInfo.newPassword = '';
  passwordInfo.confirmPassword = '';
};

// 校验
const rulesRef = ref<FormInstance>(); // form 表单实例
// 新密码确认
const confirmNewPassword = (rule: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error('请确认密码'));
  } else {
    if (value !== passwordInfo.newPassword) {
      return callback(new Error('两次输入密码不一致'));
    }
    callback();
  }
};
const rules = reactive({
  oldPassword: [{ required: true, message: '请输入旧密码', trigger: 'blur' }],
  newPassword: [
    { required: true, validator: checkNewPassword, trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, validator: confirmNewPassword, trigger: 'blur' }
  ]
});

// 保存新密码
const saveInfo = async () => {
  if (rulesRef.value) {
    try {
      const res = await rulesRef.value.validate();
      if (res) {
        const { code, message } = await changPwd({
          cusNo: basicStore.userInfo.cusNo,
          loginName: basicStore.userInfo.loginName,
          newPwd: MD5(passwordInfo.newPassword.trim()),
          pwd: MD5(passwordInfo.oldPassword.trim())
        });
        if (code === 200) {
          ElMessage.success(message);
          passwordSwitch.value = false;
        } else {
          ElMessage.error('修改失败');
        }
      }
    } catch (e) {
      ElMessage.error('修改失败');
    }
  } else {
    return;
  }
};

// 初始化
const init = () => {
  resetInfo();
  if (rulesRef.value) {
    rulesRef.value.resetFields();
  }
};
</script>

<template>
  <div class="info-box">
    <div class="title mg-b-15">
      <div class="left">
        <Lock class="svg-14 mg-r-5" />
        <span class="ft-s-13 ft-w-6">登录密码</span>
      </div>
      <div class="right">
        <el-switch
          v-model="passwordSwitch"
          size="small"
          inline-prompt
          width="45px"
          active-text="修改"
          inactive-text="修改"
          inactive-color="#999"
          @change="init"
        />
      </div>
    </div>
    <div class="content" v-show="passwordSwitch">
      <el-form
        ref="rulesRef"
        label-position="left"
        label-width="80px"
        :model="passwordInfo"
        :rules="rules"
        status-icon
      >
        <el-form-item label="旧密码" prop="oldPassword">
          <el-input v-model="passwordInfo.oldPassword" />
        </el-form-item>
        <el-form-item label="新密码" prop="newPassword">
          <el-input v-model="passwordInfo.newPassword" />
        </el-form-item>
        <el-form-item label="确认密码" prop="confirmPassword">
          <el-input v-model="passwordInfo.confirmPassword" />
        </el-form-item>
      </el-form>
    </div>
    <div class="footer" v-show="passwordSwitch">
      <el-button @click="resetInfo">重置</el-button>
      <el-button type="primary" @click="saveInfo">保存</el-button>
    </div>
  </div>
</template>

<style scoped lang="scss">
.info-box {
  padding: 5px 8px;
  .title {
    @include box-size(100%, 35px);
    @include flex(row, space-between, center);
    border-bottom: 0.8px solid #dedede;

    > div {
      @include flex(row, center, center);
    }
  }

  .footer {
    @include flex(row, flex-end, center);
    height: 45px;
  }
}

@media screen and (min-width: 100px) {
  .info-box {
    width: 80%;
  }
}

@media screen and (min-width: 1000px) {
  .info-box {
    width: 60%;
  }
}

@media screen and (min-width: 1500px) {
  .info-box {
    width: 40%;
  }
}
</style>

<script lang="ts">
export default {
  name: 'SecuritySet'
};
</script>
