<!-- 数据表格- 关注竞品 -->
<script lang="ts" setup>
import { listViewCompetitors } from '@/apis/user';
import { basicStore } from '@/pinia';
import { ElMessage } from 'element-plus';

const userInfo = basicStore.getUserInfo();
/*  数据列表
------------------------------------------------ */
const filterForm = reactive({
  province: '', // 省份
  city: '', // 城市
  county: '', // 区县
  competitorCode: '' // 关注品牌店编号
});
const currentPage = ref(1); // 当前页码
const pageSize = ref(15); // 每页数据量
const totalPipeline = ref(0);
const loading = ref(false); // 加载动画
const tableData = reactive<Array<object>>([]); // 表格数据

// 重置查询项
const resetFilters = () => {
  filterForm.province = '';
  filterForm.city = ''; // 城市
  filterForm.county = ''; // 区县
  filterForm.competitorCode = ''; // 关注品牌店编号
};

// 查询列表数据
const searchTableData = async () => {
  try {
    loading.value = true;
    const { data, code } = await listViewCompetitors({
      cusNo: userInfo.cusNo || '',
      provinceCode: filterForm.province,
      cityCode: filterForm.city,
      districtCode: filterForm.county,
      parameter: filterForm.competitorCode,
      size: pageSize.value,
      page: currentPage.value
    });
    loading.value = false;
    if (code === 200) {
      tableData.length = 0;
      data.rows.forEach((e: object) => tableData.push(e));
      totalPipeline.value = data.total;
    }
  } catch (error) {
    loading.value = false;
    ElMessage.warning('查询失败！');
    console.log(error);
  }
};

// 按钮查询
const searchTable = () => {
  currentPage.value = 1;
  searchTableData();
};

/*  列表功能
------------------------------------------------ */
const tableRoot = ref(); // 表格容器实例，用于全屏

// 表格列配置
const checkedTableColumn = reactive({
  value: [
    {
      id: 1,
      label: '关注品牌店编号',
      fixed: false,
      minWidth: '',
      width: '180',
      prop: 'code'
    },
    {
      id: 2,
      label: '门店名称',
      fixed: false,
      minWidth: '180',
      width: '',
      prop: 'storeName'
    },
    {
      id: 3,
      label: '品牌',
      fixed: false,
      minWidth: '',
      width: '',
      prop: 'brandName'
    },
    {
      id: 4,
      label: '省份',
      fixed: false,
      minWidth: '',
      width: '',
      prop: 'provinceName'
    },
    {
      id: 5,
      label: '城市',
      fixed: false,
      minWidth: '',
      width: '',
      prop: 'cityName'
    },
    {
      id: 6,
      label: '区县',
      fixed: false,
      minWidth: '',
      width: '',
      prop: 'districtName'
    },
    {
      id: 7,
      label: '地址',
      fixed: false,
      minWidth: '380',
      width: '',
      prop: 'address'
    }
  ]
});

const stripe = ref(false);

/*  生命周期
------------------------------------------------ */
onBeforeMount(() => {
  // 数据查询
  searchTableData();
});
</script>
<script lang="ts">
export default {
  name: 'ListCompetitor'
};
</script>

<template>
  <div
    ref="tableRoot"
    v-loading="loading"
    class="list-root"
    element-loading-background="rgba(100,100,100,0.4)"
    :element-loading-text="$t(`others.load`)"
  >
    <sv-table-filter :title="$t(`metaTitle.competitor`)">
      <template #form>
        <el-form
          :inline="true"
          :model="filterForm"
          label-position="left"
          label-width="70px"
          class="demo-form-inline"
        >
          <sv-area-data
            v-model:province="filterForm.province"
            v-model:city="filterForm.city"
            v-model:county="filterForm.county"
            size="small"
          />
          <!-- 关注品牌店编号 -->
          <el-form-item :label="$t(`filter.competitiveStoreNumber`)">
            <el-input
              v-model="filterForm.competitorCode"
              placeholder=""
              size="small"
            >
              <template #suffix>
                <transition name="upDown" mode="out-in" appear>
                  <el-icon
                    v-if="filterForm.competitorCode"
                    class="el-input__icon cur-pointer"
                    @click="filterForm.competitorCode = ''"
                    ><CircleClose
                  /></el-icon>
                  <el-icon v-else class="el-input__icon"><EditPen /></el-icon>
                </transition>
              </template>
            </el-input>
          </el-form-item>
        </el-form>
      </template>
      <template #btn>
        <el-button type="primary" size="small" @click="searchTable">
          <template #icon>
            <Search />
          </template>
          {{ $t(`btnSwitch.btnSearch`) }}
        </el-button>
        <el-button type="danger" size="small" @click="resetFilters">
          <template #icon>
            <Refresh />
          </template>
          {{ $t(`btnSwitch.btnReset`) }}
        </el-button>
      </template>
    </sv-table-filter>
    <sv-table-box>
      <template #btnsBox>
        <el-button size="small">
          <template #icon>
            <Plus class="primary-color" />
          </template>
          <span class="primary-color">{{ $t(`btnSwitch.btnNew`) }}</span>
        </el-button>
        <el-button size="small">
          <template #icon>
            <Download class="primary-color" />
          </template>
          <span class="primary-color">{{ $t(`btnSwitch.btnDownLoad`) }}</span>
        </el-button>
      </template>
      <template #toolsBox>
        <!-- 刷新 -->
        <el-tooltip
          effect="dark"
          :content="$t(`tooltip.refresh`)"
          placement="top-start"
        >
          <Refresh class="svg-18" @click="searchTable" />
        </el-tooltip>
        <!-- 斑马纹-->
        <el-tooltip
          effect="dark"
          :content="$t(`tooltip.stripe`)"
          placement="top-start"
        >
          <div style="display: flex; align-items: center">
            <svg
              class="icon svg-18 cur-pointer"
              aria-hidden="true"
              @click="stripe = !stripe"
            >
              <use href="#icon-stripe"></use>
            </svg>
          </div>
        </el-tooltip>
        <!-- 全屏 -->
        <sv-full-screen :instance="tableRoot" />
        <!-- 列表设置 -->
        <sv-table-column-option
          v-model:tableColumn="checkedTableColumn.value"
        />
      </template>
      <template #table>
        <el-table
          :data="tableData"
          height="calc(100% - 60px)"
          header-cell-class-name="table-header-cell"
          cell-class-name="table-cell"
          style="width: 100%"
          :stripe="stripe"
        >
          <el-table-column key="index" label="#" type="index" fixed="left" />

          <el-table-column
            v-for="(item, i) in checkedTableColumn.value"
            :key="i"
            :prop="item.prop"
            :label="item.label"
            :width="item.width"
            :fixed="item.fixed"
            :min-width="item.minWidth"
            show-overflow-tooltip
          >
            <template #default="scope">
              <svg
                v-if="item.id === 7"
                class="icon svg-24 cur-pointer"
                aria-hidden="true"
              >
                <use href="#icon-local"></use>
              </svg>
              <span>
                {{ scope.row[item.prop] }}
              </span>
            </template>
          </el-table-column>
        </el-table>
      </template>
      <template #pagination>
        <sv-table-pagination
          v-model:currentPage="currentPage"
          v-model:pageSize="pageSize"
          :total="totalPipeline"
          :page-size-option="[5, 10, 15, 20]"
          @change="searchTableData"
        />
      </template>
    </sv-table-box>
    <sv-copyright-line />
  </div>
</template>

<style lang="scss" scoped>
.list-root {
  @include box-size(100%, 100%);
  @include flex(column, center, flex-start);
  position: relative;
}
</style>
