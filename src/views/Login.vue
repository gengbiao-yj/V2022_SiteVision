<template>
  <div class="login-root">
    <div class="content-box">
      <div class="left-box">
        <div class="slogan-title">
          拥抱大数据，充分结合人工智能
          <p class="large">高效解决选址问题</p>
        </div>
      </div>
      <div class="right-box">
        <div class="login-form">
          <!-- title -->
          <h1 class="login-title">欢迎登录址见</h1>
          <!-- tabs -->
          <div class="tabs">
            <div class="tabs-item-box" ref="tabsItemBox">
              <span class="tabs-item" @click="barClick(0)">账号登录</span>
              <span class="tabs-item" @click="barClick(1)">短信码登录</span>
            </div>
            <span ref="tabsActiveBar" class="tabs-active-bar"></span>
          </div>
          <!-- form -->
          <div>
            <el-form
              label-position="top"
              label-width="100px"
              :model="accountForm"
              v-show="activeIndex === 0"
              ref="accountFormRef"
              :rules="accountFormRules"
            >
              <el-form-item label="账号" prop="account">
                <el-input
                  v-model="accountForm.account"
                  placeholder="请输入账号/手机号"
                  size="large"
                  clearable
                />
              </el-form-item>
              <el-form-item label="密码" prop="passWord">
                <el-input
                  v-model="accountForm.passWord"
                  placeholder="请输入密码"
                  size="large"
                  type="password"
                  show-password
                  clearable
                />
              </el-form-item>
            </el-form>
          </div>

          <el-form
            label-position="top"
            label-width="100px"
            :model="noteForm"
            v-show="activeIndex === 1"
          >
            <el-form-item label="手机号">
              <el-input
                v-model.number="noteForm.phone"
                placeholder="请输入11位手机号码"
                size="large"
                clearable
                type="text"
              />
            </el-form-item>
            <el-form-item label="验证码">
              <el-input
                v-model="noteForm.noteCode"
                placeholder="请输入短信验证码"
                size="large"
                clearable
              >
                <template #append>
                  <span style="color: #5699ff; cursor: pointer"
                    >发送验证码</span
                  >
                </template>
              </el-input>
            </el-form-item>
          </el-form>

          <label class="alert-msg">
            <span>注：仅支持已配置的账号登录，未配置请联系公司内管理员</span>
            <span style="color: #009dff; cursor: pointer"> 忘记密码</span>
          </label>
          <!-- 登录按钮 -->
          <el-button
            size="large"
            type="primary"
            style="width: 100%; margin: 15px auto; color: white"
            color="#4695ff"
            @click="loginBtnClick"
            >登录</el-button
          >
        </div>
        <div class="advice-msg">建议使用谷歌浏览器</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { login } from '@/apis/user';
import MD5 from 'js-md5';
import { ElMessage } from 'element-plus';
import basicPinia from '@/pinia/storagePinia';
import type { FormInstance, FormRules } from 'element-plus';

const router = useRouter();
// const route = useRoute();

const basicStore = basicPinia();
const { setUserInfo, getUserInfo } = basicStore;

/*  计算 tabs 指示条位置
------------------------------------------------ */
onMounted(() => {
  calcuActiveBarPos(0);
});
const activeIndex = ref<number>(0);
const tabsItemBox = ref<HTMLDivElement | null>(null);
const tabsActiveBar = ref<HTMLSpanElement | null>(null);
const calcuActiveBarPos = (index: number) => {
  activeIndex.value = index;
  const boxel = tabsItemBox.value!;
  if (boxel.children.length > 0) {
    const activeTabsItem = boxel.children[index] as HTMLSpanElement;
    const offsetX = activeTabsItem.offsetLeft;
    let activeBarLength = activeTabsItem.clientWidth;
    const activeBar = tabsActiveBar.value!;
    activeBar.style.transform = `translate(${offsetX}px)`;
    // 页面初始化完成后加入动画
    if (activeBar.style.width > '10px') {
      activeBar.style.transition = '0.3s ease-in-out';
    }
    activeBar.style.width = `${activeBarLength}px`;
  }
};

/*  登录方式切换
------------------------------------------------ */
const barClick = (i: number) => {
  accountForm.account = '';
  accountForm.passWord = '';
  noteForm.phone = '';
  noteForm.noteCode = '';
  calcuActiveBarPos(i);
};

/*  登录
------------------------------------------------ */
// 账号表单
const accountFormRef = ref<FormInstance>();
const accountFormRules = reactive<FormRules>({
  account: [{ required: true, message: '请输入账户！', trigger: 'blur' }],
  passWord: [{ required: true, message: '请输入密码！', trigger: 'blur' }]
});
const accountForm = reactive<{ account: string; passWord: string }>({
  account: '', // 账户
  passWord: '' // 密码
});
// 短信表单
const noteForm = reactive<{ phone: string; noteCode: string }>({
  phone: '', // 账户
  noteCode: '' // 密码
});

// 登录按钮
const loginBtnClick = () => {
  if (activeIndex.value === 0) {
    accountFormRef.value!.validate((res, fields) => {
      if (res) {
        const { account, passWord } = accountForm;
        apiUserLogin(account.trim(), MD5(passWord.trim()));
      }
    });
  } else if (activeIndex.value === 1) {
    ElMessage.warning('暂不支持短信登录！');
  } else {
    return;
  }
};
/**
 * 登录接口
 * @param count         账号
 * @param password      密码
 * @param user          对接系统用户
 * @param positionID    对接系统部门ID
 */
const apiUserLogin = async (
  count: string,
  password: string,
  user = 'Admin',
  positionID = 1
) => {
  try {
    const { data, code, message } = await login({
      loginName: count,
      pwd: password,
      browser: navigator.userAgent,
      userName: user,
      positionID: positionID
    });
    if (code === 200 && !!data) {
      setUserInfo(data);
      const user = getUserInfo();
      console.log(user.token);
      ElMessage.success('登录成功,即将进入系统！');
      let ti = setTimeout(() => {
        ElMessage.closeAll();
        router.replace('/Main');
        clearTimeout(ti);
      }, 800);
    } else {
      ElMessage.error(message);
    }
  } catch (error) {
    console.log(error);
  }
};
</script>

<style lang="scss" scoped>
.login-root {
  background: #e3f2ff;
  @include box-size(100vw, 100vh);

  .content-box {
    @include abs-position(true);
    text-align: center;
    max-height: 80%;
    overflow: hidden;
    padding: 14px;
    transform-origin: 0 0;
    background: #fff;
    box-shadow: 0 15px 19px 0 rgb(12 52 107 / 6%);
    border-radius: 16px;

    & > div {
      display: inline-block;
      position: relative;
      @include box-size(50%, 100%);
    }

    .left-box {
      border-radius: 16px;
      overflow: hidden;
      background: {
        image: url('../../public/resource/imgs/loginCard.png');
        repeat: no-repeat;
        size: 100% auto;
        position: 50%;
      }

      .slogan-title {
        position: absolute;
        top: 12%;
        width: 100%;
        text-align: center;
        font-family: PingFangSC-Semibold, PingFang SC;
        font-weight: 600;
        color: #fff;

        .large {
          letter-spacing: 3px;
          margin-top: 10px;
          letter-spacing: 6px;
        }
      }
    }

    .right-box {
      .login-form {
        width: 100%;
        text-align: left;
        color: rgba(13, 22, 46, 0.8);
        @include abs-position(true);

        .login-title {
          color: #0d162e;
          font: {
            size: 24px;
            weight: bold;
          }
          padding-bottom: 20px;
        }

        .tabs {
          margin-bottom: 20px;
          border-bottom: 2px solid #f7f7f7;
          position: relative;
          width: 100%;

          .tabs-item-box {
            width: 100%;
            @include flex(row, space-around, center);
          }

          .tabs-item {
            text-align: center;
            font-size: 16px;
            padding: 10px 0;
            cursor: pointer;
          }

          .tabs-active-bar {
            position: absolute;
            bottom: -1px;
            background: #3585ff;
            height: 2px;
            min-width: 5px;
          }

          //&:deep(.el-button--primary) {
          //  margin: 15px auto 0 !important;
          //  width: 80% !important;
          //}
        }

        .alert-msg {
          width: 100%;
          text-align: center;
          font: {
            size: 12px;
            weight: 400;
            family: PingFangSC-Regular, PingFang SC;
          }
          color: #999;
        }
      }

      .advice-msg {
        width: 100%;
        text-align: center;
        position: absolute;
        bottom: 0;
        font: {
          size: 12px;
          weight: 400;
          family: PingFangSC-Regular, PingFang SC;
        }
        color: #999;
      }
    }
  }
}

/*  媒体查询
------------------------------------------------ */
@media screen and (max-width: 1920px) {
  .content-box {
    @include box-size(1100px, 682px);
  }

  .slogan-title {
    font-size: 26px;

    .large {
      letter-spacing: 6px;
      font-size: 40px;
      margin-top: 8px;
    }
  }

  .login-form {
    padding: 0 80px;
  }
}
</style>

<script lang="ts">
export default {
  name: 'BaseLogin'
};
</script>
