<script setup lang="ts">
import { cusAllCityList, saveCusCity } from '@/apis/user';
import { ElMessage } from 'element-plus/es';

interface PropsType {
  cusNo: string;
}
const props = defineProps<PropsType>();

/*  获取城市列表与已选城市列表
------------------------------------------------ */
const allCityList = ref() as { value: Array<Option> };
const selectCityList = ref() as { value: Array<number> };
interface Option {
  key: number;
  label: string;
  disabled: boolean;
}
const cusCityList = async () => {
  try {
    const { code, data } = await cusAllCityList({ cusNo: props.cusNo });
    if (code === 200) {
      allCityList.value = data.allCityList.map(e => {
        return {
          key: parseInt(e.code),
          label: e.cnName,
          disabled: false
        };
      });
      selectCityList.value = data.selectCityList.map(j => parseInt(j.code));
    }
  } catch (e) {
    console.log(e);
  }
};
cusCityList();

/*  保存城市维护列表
------------------------------------------------ */
const saveInfo = async () => {
  try {
    const cityCode = selectCityList.value.join(',');
    const { code, data } = await saveCusCity({ cityCode, cusNo: props.cusNo });
    if (code === 200) {
      ElMessage.success(data.content);
      cusCityList();
    } else {
      ElMessage.error('保存失败');
    }
  } catch (e) {
    ElMessage.error('保存失败');
    console.log(e);
  }
};
</script>
<script lang="ts">
export default {
  name: 'CityMaintenance'
};
</script>

<template>
  <div class="info-box">
    <!-- 标题 -->
    <div class="title mg-b-15">
      <div class="left">
        <span class="ft-s-13 ft-w-6">城市维护</span>
      </div>
      <div class="right">
        <el-button size="small" type="primary" @click="saveInfo"
          >保存</el-button
        >
      </div>
    </div>
    <!-- 内容 -->
    <div class="content-box">
      <el-scrollbar>
        <div class="content">
          <el-transfer
            v-model="selectCityList"
            style="height: 500px"
            :titles="['未选城市', '已选城市']"
            filterable
            filter-placeholder="请输入城市名称"
            :data="allCityList"
          />
        </div>
      </el-scrollbar>
    </div>
  </div>
</template>

<style scoped lang="scss">
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
  }
}
</style>
