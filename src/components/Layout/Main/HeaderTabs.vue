<!-- Tabs- 导航标签页 -->
<script lang="ts" setup>
import type { _HTMLDivElement, TabsItem } from '@/types/index';
import type { TabsPaneContext } from 'element-plus';
import basicPinia from '@/pinia/storagePinia';
const basicStore = basicPinia();
const { setTabs, getTabs } = basicStore;

// 初始数据
const editableTabsValue = ref('/Main/MainMap');
const editableTabs = ref<Array<TabsItem>>(getTabs());
const router = useRouter();
const route = useRoute();

// 校准当前路由对应的tab
onBeforeMount(() => {
  let index = editableTabs.value.findIndex(
    e => e.path === router.currentRoute.value.path
  );
  if (index !== -1) {
    editableTabsValue.value = editableTabs.value[index].path;
  }
});

// 监视路由变化动态增减 tabs
watch(route, newV => {
  const isRecord = editableTabs.value.some(e => e.path === newV.path);
  if (
    !isRecord &&
    ['/404', '/Refresh', '/Login'].every(r => newV.path.indexOf(r) === -1)
  ) {
    editableTabs.value.push({
      title: newV.meta.title + '',
      name: newV.path,
      path: newV.path
    });
    editableTabsValue.value = editableTabs.value.slice(-1)[0].path;
    setTabs(editableTabs.value);
  } else {
    let filterTab = editableTabs.value.filter(e => e.path === newV.path);
    if (filterTab.length) {
      editableTabsValue.value = filterTab[0].path;
    }
  }
});

/*  tab 操作
------------------------------------------------ */
// 移除 tab
const removeTab = (targetName: string) => {
  const tabs = editableTabs.value;
  let activeName = editableTabsValue.value;
  if (activeName === targetName) {
    tabs.forEach((tab, index) => {
      if (tab.name === targetName) {
        const nextTab = tabs[index + 1] || tabs[index - 1];
        if (nextTab) {
          activeName = nextTab.name;
        }
      }
    });
  }
  editableTabsValue.value = activeName;
  editableTabs.value = tabs.filter(tab => tab.name !== targetName);
  setTabs(editableTabs.value);
  activeTabRouter(activeName);
};

// 点击 tab 切换页面
const clickTab = (e: TabsPaneContext) => {
  activeTabRouter(e.paneName as string);
};

// 找出当前激活中tab，并跳转路由
const activeTabRouter = (activePaneName: string) => {
  let activeItem = editableTabs.value.find(k => k.name === activePaneName);
  if (activeItem!.path) {
    router.push(activeItem!.path);
  }
};

// tab menu 操作项
const tabMenuList = ref([
  { label: '刷新页面', value: 'refresh', icon: '#icon-refresh' },
  { label: '关闭左侧', value: 'closeLeft', icon: '#icon-arrowLeft' },
  { label: '关闭右侧', value: 'closeRight', icon: '#icon-arrowRight' },
  { label: '关闭所有', value: 'closeAll', icon: '#icon-remove' }
]);
const showTabMenu = ref(false); // tab menu 展现状态
const tabMenuInstance = ref() as _HTMLDivElement; // tab menu 实例
// 右键tab 计算left偏移位置，并显示
const rightClickTab = ref(1); // 右击操作tab的数组下标
const leftForbid = ref(false); // 关闭左侧按钮失效条件
const rightForbid = ref(false); // 关闭右侧按钮失效条件
const drawTabMenu = (currentTab: string, e: any) => {
  tabMenuInstance.value.style.left = e.target.offsetLeft + 'px';
  showTabMenu.value = true;
  rightClickTab.value =
    [...e.target.parentNode.children].findIndex(k => k === e.target) + 1;
  leftForbid.value = false;
  rightForbid.value = false;
  if (rightClickTab.value <= 2) leftForbid.value = true;
  if (rightClickTab.value === editableTabs.value.length) {
    rightForbid.value = true;
  }
};

// 右击tab弹出操作卡片，各操作选项功能
const tabMenuClick = (e: { label: string; value: string }) => {
  let judge: {
    [key: string]: () => void;
  } = {
    refresh: () => refreshRouter(),
    closeLeft: () => removeNextTab('lf'),
    closeRight: () => removeNextTab('rg'),
    closeAll: () => closeAllTabs()
  };
  judge[e.value]();
};

// 刷新路由
const refreshRouter = () => {
  router.replace(`/Main/Refresh`);
};

// 关闭附近 tab
const removeNextTab = (param: 'lf' | 'rg') => {
  let index = editableTabs.value.findIndex(
    e => e.name === editableTabsValue.value
  ); // 当前激活tab的数组下标
  const rightClickTabName = editableTabs.value[rightClickTab.value - 1].path;

  if (param === 'lf') {
    if (leftForbid.value) return;
    editableTabs.value.splice(1, rightClickTab.value - 2);
    editableTabsValue.value = editableTabs.value[1].name;
  } else if (param === 'rg') {
    if (rightForbid.value) return;
    editableTabs.value.splice(rightClickTab.value, editableTabs.value.length);
  }
  setTabs(editableTabs.value);

  if (rightClickTab.value - 1 !== index) {
    activeTabRouter(rightClickTabName);
  }
};

// 关闭所有标签页，跳转到MainMap
const closeAllTabs = () => {
  editableTabs.value.length = 1;
  editableTabsValue.value = '/Main/MainMap';
  setTabs(editableTabs.value);
  router.replace('/Main/MainMap');
};

// tab menu 关闭
const closeTabMenu = () => {
  showTabMenu.value = false;
};
watch(
  () => showTabMenu.value,
  val => {
    if (val) {
      document.body.addEventListener('click', closeTabMenu);
    } else {
      document.body.removeEventListener('click', closeTabMenu);
    }
  }
);

onBeforeUnmount(() => {
  document.body.removeEventListener('click', closeTabMenu);
});
</script>
<template>
  <el-tabs
    v-model="editableTabsValue"
    type="card"
    class="header-tabs"
    @tab-remove="removeTab"
    @tab-click="clickTab"
    @contextmenu.prevent="drawTabMenu(editableTabsValue, $event)"
  >
    <el-tab-pane
      v-for="item in editableTabs"
      :key="item.path"
      :label="item.title"
      :name="item.name"
      :closable="item.name !== '/Main/MainMap'"
    >
    </el-tab-pane>
  </el-tabs>
  <transition name="tab-menu" mode="out-in" appear>
    <div class="list-menus-root" v-show="showTabMenu" ref="tabMenuInstance">
      <div
        class="type-item"
        :class="{ forbid: (i == 1 && leftForbid) || (i === 2 && rightForbid) }"
        v-for="(e, i) in tabMenuList"
        :key="e.name"
        @click="tabMenuClick(e)"
      >
        <svg fill="currentColor" class="icon svg-14" aria-hidden="true">
          <use :href="e.icon" fill=""></use>
        </svg>
        {{ e.label }}
      </div>
    </div>
  </transition>
</template>

<style lang="scss" scoped>
.list-menus-root {
  position: absolute;
  padding: 0px 0px;
  border-radius: 6px;
  width: 120px;
  background: white;
  //box-shadow: 0px 0px 10px #c9c9c9;
  z-index: 11;
  .type-item {
    padding: 0px 5px;
    width: 100%;
    height: 36px;
    font-size: 14px;
    letter-spacing: 2px;
    cursor: pointer;
    position: relative;
    color: var(--primary-color);
    transition: all 0.1s ease-in-out;
    @include flex(row, center, center);
    svg {
      color: var(--primary-color);
      margin-right: 8px;
    }
    &:not(.forbid):hover {
      @include primary-bg-color(0.1);
    }
    &.forbid {
      background: #e8e8e8;
      cursor: not-allowed;
      color: #aaa;
    }
  }
  &:before {
    content: '';
    display: block;
    position: absolute;
    width: 10px;
    height: 10px;
    background: white;
    top: -5px;
    right: calc(65%);
    transform: rotate(45deg);
  }
}
</style>

<script lang="ts">
export default {
  name: 'HeaderTabs'
};
</script>
