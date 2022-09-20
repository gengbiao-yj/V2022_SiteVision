<script lang="ts" setup>
import basicPinia from '@/pinia/storagePinia';
import type { FormInstance } from 'element-plus/es';
import { updateCusbrand, insertCusbrand, deleteCusbrand } from '@/apis/user';
import { ElMessage } from 'element-plus';

const basicStore = basicPinia();
const BASE_URL = basicStore.getBaseUrl();

interface PropsType {
  brandList: Array<BrandInfo>;
  cusNo: string;
}
const props = defineProps<PropsType>();
const emits = defineEmits(['onSuccess']);

/*  卡片编辑
------------------------------------------------ */
let editOrSave: 0 | 1 = 0; // 0- 编辑 1- 保存
const showEditDialog = ref(false); // 编辑弹窗状态
const initBrand: BrandInfo = {
  brandCode: '',
  brandId: 0,
  cnName: '',
  creator: '',
  cusNo: '',
  enName: '',
  siteIcon: '',
  storeIcon: ''
};
const editCard = ref() as { value: BrandInfo }; // 编辑中的卡片信息

const clickCard = (e: BrandInfo, type: 0 | 1) => {
  editOrSave = type;
  cardForm.value?.resetFields();
  editCard.value = { ...e };
  showEditDialog.value = true;
};

// 校验
const cardForm = ref<FormInstance>(); // form 表单实例
const rules = reactive({
  brandCode: [{ required: true, message: '请输入品牌代码', trigger: 'blur' }],
  cnName: [{ required: true, message: '请输入品牌中文名称', trigger: 'blur' }],
  enName: [{ required: true, message: '请输入品牌英文名称', trigger: 'blur' }],
  siteIcon: [{ required: true, message: '请上传机会点图标', trigger: 'blur' }],
  storeIcon: [{ required: true, message: '请上传门店图标', trigger: 'blur' }]
});

const operationRes = (code: number, suc = '保存成功', err = '保存失败') => {
  if (code === 200) {
    ElMessage.success(suc);
    showEditDialog.value = false;
    emits('onSuccess');
  } else {
    ElMessage.error(err);
  }
};

// 保存按钮
const saveClick = () => {
  if (editOrSave === 0) {
    saveCardInfo();
  } else {
    addCardInfo();
  }
};

// 保存编辑卡片信息
const saveCardInfo = async () => {
  try {
    const res = await cardForm.value?.validate();
    if (res) {
      const { code } = await updateCusbrand(editCard.value!);
      operationRes(code);
    }
  } catch (e) {
    ElMessage.error('保存失败');
    console.log(e);
  }
};

// 保存新增卡片信息
const addCardInfo = async () => {
  try {
    const res = await cardForm.value?.validate();
    if (res) {
      editCard.value.cusNo = props.cusNo;
      const { code } = await insertCusbrand(editCard.value!);
      operationRes(code);
    }
  } catch (e) {
    ElMessage.error('保存失败');
    console.log(e);
  }
};

// 删除卡片信息
const deleteCardInfo = async (brandId: number) => {
  try {
    const { code } = await deleteCusbrand({ brandId });
    operationRes(code, '删除成功', '删除失败');
  } catch (e) {
    console.log(e);
  }
};
</script>
<script lang="ts">
export default {
  name: 'BrandMaintenance'
};
</script>

<template>
  <div class="info-box">
    <!-- 标题 -->
    <div class="title mg-b-15">
      <div class="left">
        <span class="ft-s-13 ft-w-6">品牌信息</span>
      </div>
      <div class="right">
        <el-button size="small" type="primary" @click="clickCard(initBrand, 1)"
          >新增</el-button
        >
      </div>
    </div>
    <!-- 卡片内容 -->
    <div class="content-box">
      <el-scrollbar>
        <div class="content">
          <el-card
            v-for="e in props.brandList"
            :key="e.brandId"
            shadow="hover"
            @click="clickCard(e, 0)"
          >
            <div class="row">
              <span>品牌中文名</span>
              <span>{{ e.cnName }}</span>
            </div>
            <div class="row">
              <span>品牌英文名</span>
              <span>{{ e.enName }}</span>
            </div>
            <div class="row">
              <span>机会点图标</span>
              <el-image
                style="width: 30px; height: 30px"
                :src="`${BASE_URL}/${e.siteIcon}`"
                :preview-src-list="[`${BASE_URL}/${e.siteIcon}`]"
              />
            </div>
            <div class="row">
              <span>门店图标</span>
              <el-image
                style="width: 30px; height: 30px"
                :src="`${BASE_URL}/${e.storeIcon}`"
                :preview-src-list="[`${BASE_URL}/${e.storeIcon}`]"
              />
            </div>
            <div class="delete">
              <el-popconfirm
                title="是否删除该品牌？"
                @confirm="deleteCardInfo(e.brandId)"
              >
                <template #reference>
                  <CircleCloseFilled class="svg-18" @click.stop />
                </template>
              </el-popconfirm>
            </div>
          </el-card>
        </div>
      </el-scrollbar>
    </div>
    <!-- 编辑弹窗 -->
    <el-dialog v-model="showEditDialog" title="编辑品牌">
      <el-form
        ref="cardForm"
        label-position="left"
        label-width="140px"
        :model="editCard"
        :rules="rules"
        status-icon
      >
        <el-form-item label="品牌代码：" prop="brandCode">
          <el-input v-model="editCard.brandCode" clearable />
        </el-form-item>
        <el-form-item label="品牌中文名称：" prop="cnName">
          <el-input v-model="editCard.cnName" clearable />
        </el-form-item>
        <el-form-item label="品牌英文名称：" prop="enName">
          <el-input v-model="editCard.enName" clearable />
        </el-form-item>
        <el-form-item label="机会点图标：" prop="siteIcon">
          <sv-replace-img
            :edit="true"
            :src="editCard.siteIcon"
            :size="70"
            shape="square"
            class="mg-b-10 mg-l-20"
            @success="e => (editCard.siteIcon = e)"
          >
          </sv-replace-img>
        </el-form-item>
        <el-form-item label="门店图标：" prop="storeIcon">
          <sv-replace-img
            :edit="true"
            :src="editCard.storeIcon"
            :size="70"
            shape="square"
            class="mg-b-10 mg-l-20"
            @success="e => (editCard.storeIcon = e)"
          >
          </sv-replace-img>
        </el-form-item>
      </el-form>
      <el-divider />
      <div class="dialog-btn-box">
        <el-button @click="showEditDialog = false">取消</el-button>
        <el-button type="primary" @click="saveClick">保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<style lang="scss" scoped>
.info-box {
  padding: 15px 20px;
  height: 100%;
  width: 100%;

  .title {
    @include box-size(100%, 35px);
    @include flex(row, space-between, center);
    border-bottom: 0.8px solid #dedede;

    > .left {
      @include flex(row, center, center);
    }
  }

  .content-box {
    width: 100%;
    height: calc(100% - 35px);
    overflow: hidden auto;
    padding-bottom: 30px;
  }

  .content {
    display: grid;
    grid-template-rows: auto;
    grid-template-columns: repeat(4, 24.2%);
    grid-auto-flow: row;
    justify-content: space-between;
    overflow: hidden auto;
    padding-right: 10px;

    .el-card {
      width: 100%;
      position: relative;
      padding: 15px 0 0;
      .row {
        @include flex(row, space-between, center);
        color: #6a6a6a;
        font-size: 14px;
        margin-bottom: 20px;
      }
      .delete {
        @include flex(row, center, center);
        position: absolute;
        top: 0px;
        right: 0px;
        height: 20px;
        width: 20px;
        cursor: pointer;
        border-bottom-left-radius: 50%;
        border-bottom-right-radius: 50%;
        background: #e5e5e5;
        box-shadow: 0px 1px 2px #796868;
        > svg {
          color: #ff4c4c;
        }
      }
    }

    .el-card:nth-child(n + 5) {
      margin-top: 4%;
    }
  }

  .dialog-btn-box {
    @include flex(row, flex-end, center);
  }

  @media screen and (max-width: 500px) {
    .content {
      display: grid;
      grid-template-rows: auto;
      grid-template-columns: repeat(1, 100%);
    }
  }
}
</style>
