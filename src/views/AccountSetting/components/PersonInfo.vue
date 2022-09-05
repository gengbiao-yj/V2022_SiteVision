<!-- name: 个人信息 -->
<script setup lang="ts">
import basicPinia from '@/pinia/storagePinia';
import { uploadImage, saveUser } from '@/apis/user';
import { checkMail, checkPhone } from '@/utils';
import { ElMessage } from 'element-plus';
import type { UserLogin } from '@/types';
import type { FormInstance, UploadRequestOptions } from 'element-plus';

const basicStore = basicPinia();

const personSwitch = ref(false); // 编辑动作
const personInfo = reactive<UserLogin>(basicStore.userInfo); // 个人信息
const BASE_URL = basicStore.getBaseUrl();

// 重置个人信息
const resetInfo = () => {
  personInfo.leader = '';
  personInfo.loginName = '';
  personInfo.dept = '';
  personInfo.mail = '';
  personInfo.phone = '';
  personInfo.position = '';
  personInfo.userName = '';
};

// 校验
const rulesRef = ref<FormInstance>(); // form 表单实例
const rules = reactive({
  userName: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  loginName: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
  phone: [{ required: true, validator: checkPhone, trigger: 'blur' }],
  mail: [{ required: true, validator: checkMail, trigger: 'blur' }]
});

// 保存信息
const saveInfo = async () => {
  if (rulesRef.value) {
    try {
      const res = await rulesRef.value.validate();
      if (res) {
        const { data, code } = await saveUser(personInfo);
        if (code === 200) {
          ElMessage.success('保存成功');
          basicStore.setUserInfo(personInfo);
          personSwitch.value = false;
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

// 上传头像图片
const uploadImg = async (file: UploadRequestOptions) => {
  try {
    let formData = new FormData();
    formData.append('file', file.file);
    const { data } = await uploadImage(formData);
    if (data) {
      ElMessage.success(data.message);
      personInfo.avatar = data.url;
      basicStore.setUserInfo(personInfo);
    } else {
      ElMessage.success('上传失败');
    }
  } catch (error) {
    ElMessage.success('上传失败');
  }
};
</script>

<template>
  <div class="info-box">
    <div class="title mg-b-15">
      <div class="left">
        <UserFilled class="svg-14 mg-r-5" />
        <span class="ft-s-13 ft-w-6">个人信息</span>
      </div>
      <div class="right">
        <el-switch
          v-model="personSwitch"
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
      <el-upload
        :multiple="false"
        :limit="1"
        :disabled="!personSwitch"
        :show-file-list="false"
        :http-request="uploadImg"
        accept="image/*"
      >
        <el-avatar
          :size="70"
          class="mg-b-10 avatar"
          :class="{ edit: personSwitch }"
          :src="`${BASE_URL}/${personInfo.avatar}`"
        >
          <img src="../../../../public/resource/imgs/schoolboy.png" />
        </el-avatar>
      </el-upload>
      <el-form
        ref="rulesRef"
        label-position="left"
        label-width="80px"
        :model="personInfo"
        :rules="rules"
        status-icon
      >
        <el-form-item label="用户名" prop="userName">
          <transition name="inOut" mode="out-in" appear>
            <span class="pd-l-10" v-if="!personSwitch">{{
              personInfo.userName
            }}</span>
            <el-input v-else v-model="personInfo.userName" />
          </transition>
        </el-form-item>
        <el-form-item label="姓名" prop="loginName">
          <transition name="inOut" mode="out-in" appear>
            <span class="pd-l-10" v-if="!personSwitch">{{
              personInfo.loginName
            }}</span>
            <el-input v-else v-model="personInfo.loginName" />
          </transition>
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <transition name="inOut" mode="out-in" appear>
            <span class="pd-l-10" v-if="!personSwitch">{{
              personInfo.phone
            }}</span>
            <el-input v-else v-model="personInfo.phone" />
          </transition>
        </el-form-item>
        <el-form-item label="邮箱" prop="mail">
          <transition name="inOut" mode="out-in" appear>
            <span class="pd-l-10" v-if="!personSwitch">{{
              personInfo.mail
            }}</span>
            <el-input v-else v-model="personInfo.mail" />
          </transition>
        </el-form-item>
        <el-form-item label="直接上级">
          <transition name="inOut" mode="out-in" appear>
            <span class="pd-l-10" v-if="!personSwitch">{{
              personInfo.leader
            }}</span>
            <el-input v-else v-model="personInfo.leader" />
          </transition>
        </el-form-item>
        <el-form-item label="部门">
          <transition name="inOut" mode="out-in" appear>
            <span class="pd-l-10" v-if="!personSwitch">{{
              personInfo.dept
            }}</span>
            <el-input v-else v-model="personInfo.dept" />
          </transition>
        </el-form-item>
        <el-form-item label="职务">
          <transition name="inOut" mode="out-in" appear>
            <span class="pd-l-10" v-if="!personSwitch">{{
              personInfo.position
            }}</span>
            <el-input v-else v-model="personInfo.position" />
          </transition>
        </el-form-item>
      </el-form>
    </div>
    <div class="footer" v-show="personSwitch">
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

  .content {
    .avatar {
      position: relative;
    }
    .avatar.edit:hover::after {
      content: '更换头像';
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
  name: 'PersonInfo'
};
</script>
