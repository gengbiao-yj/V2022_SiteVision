<!-- name: 个人信息 -->
<script setup lang="ts">
import { basicStore } from '@/pinia';
import { saveUser } from '@/apis/user';
import { checkMail, checkPhone } from '@/utils';
import { ElMessage } from 'element-plus';
import type { FormInstance } from 'element-plus';

const personSwitch = ref(false); // 编辑动作
const personInfo = reactive<UserLogin>(basicStore.getUserInfo()); // 个人信息

// 重置个人信息
const resetInfo = () => {
  const { leader, loginName, dept, mail, phone, position, userName } =
    basicStore.getUserInfo();

  personInfo.leader = leader;
  personInfo.loginName = loginName;
  personInfo.dept = dept;
  personInfo.mail = mail;
  personInfo.phone = phone;
  personInfo.position = position;
  personInfo.userName = userName;
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
</script>
<script lang="ts">
export default {
  name: 'PersonInfo'
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
      <sv-replace-img
        :edit="personSwitch"
        :src="personInfo.avatar"
        :size="70"
        shape="square"
        class="mg-b-10 mg-l-20"
        @success="e => (personInfo.avatar = e)"
      >
      </sv-replace-img>
      <el-form
        ref="rulesRef"
        label-position="left"
        label-width="90px"
        :model="personInfo"
        :rules="rules"
        status-icon
      >
        <el-form-item label="用户名：" prop="userName">
          <transition name="inOut" mode="out-in" appear>
            <span v-if="!personSwitch" class="pd-l-10">{{
              personInfo.userName
            }}</span>
            <el-input v-else v-model="personInfo.userName" clearable />
          </transition>
        </el-form-item>
        <el-form-item label="姓名：" prop="loginName">
          <transition name="inOut" mode="out-in" appear>
            <span v-if="!personSwitch" class="pd-l-10">{{
              personInfo.loginName
            }}</span>
            <el-input v-else v-model="personInfo.loginName" clearable />
          </transition>
        </el-form-item>
        <el-form-item label="手机号：" prop="phone">
          <transition name="inOut" mode="out-in" appear>
            <span v-if="!personSwitch" class="pd-l-10">{{
              personInfo.phone
            }}</span>
            <el-input v-else v-model="personInfo.phone" clearable />
          </transition>
        </el-form-item>
        <el-form-item label="邮箱：" prop="mail">
          <transition name="inOut" mode="out-in" appear>
            <span v-if="!personSwitch" class="pd-l-10">{{
              personInfo.mail
            }}</span>
            <el-input v-else v-model="personInfo.mail" clearable />
          </transition>
        </el-form-item>
        <el-form-item label="直接上级：">
          <transition name="inOut" mode="out-in" appear>
            <span v-if="!personSwitch" class="pd-l-10">{{
              personInfo.leader
            }}</span>
            <el-input v-else v-model="personInfo.leader" clearable />
          </transition>
        </el-form-item>
        <el-form-item label="部门：">
          <transition name="inOut" mode="out-in" appear>
            <span v-if="!personSwitch" class="pd-l-10">{{
              personInfo.dept
            }}</span>
            <el-input v-else v-model="personInfo.dept" clearable />
          </transition>
        </el-form-item>
        <el-form-item label="职务：">
          <transition name="inOut" mode="out-in" appear>
            <span v-if="!personSwitch" class="pd-l-10">{{
              personInfo.position
            }}</span>
            <el-input v-else v-model="personInfo.position" clearable />
          </transition>
        </el-form-item>
      </el-form>
    </div>
    <div v-show="personSwitch" class="footer">
      <el-button size="small" @click="resetInfo">重置</el-button>
      <el-button type="primary" size="small" @click="saveInfo">保存</el-button>
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

    > .left {
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
