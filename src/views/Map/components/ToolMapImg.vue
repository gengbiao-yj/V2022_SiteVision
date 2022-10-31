<!-- 组件：将页面可视区域截图转成 image 并下载 -->
<script setup lang="ts">
import html2canvas from 'html2canvas';
import { ElImageViewer } from 'element-plus';
import { dataURLToBlob, getNewDate } from '@/utils';
import { ElMessage } from 'element-plus';
import { basicStore } from '@/pinia';
import { nanoid } from 'nanoid';
import { ElMessageBox } from 'element-plus';
const { getScreenshotLst, setScreenshotLst } = basicStore;
const screenshotLst = getScreenshotLst();

const props = defineProps({
  map: {
    type: HTMLDivElement,
    required: true
  }
});

// 定义事件
const emits = defineEmits(['toolAccordion']);
// 抛出组件数据
const visibleStyleBox = ref(false); // 切换弹窗状态
defineExpose({
  visible: visibleStyleBox
});

// 打开内容框
const openContentBox = () => {
  emits('toolAccordion', 3);
  visibleStyleBox.value = true;
};
const activeName = ref<'picture' | 'list'>('picture');

// 开始截图，默认截取可视区域地图
const screenshotData = ref<string>(''); // 当前截图的数据
const screenshotName = ref<string>(''); // 当前截图的名称
const editImgName = ref<boolean>(false);
const screenshot = () => {
  html2canvas(props.map, {
    useCORS: true, // 【重要】开启跨域配置
    scale: window.devicePixelRatio,
    allowTaint: true // 允许跨域图片
  }).then(canvas => {
    screenshotData.value = canvas.toDataURL('image/jpeg', 1);
    console.log(screenshotData.value);
    screenshotName.value = 'IMG/' + getNewDate();
  });
};

// 图片查看
const showImgPreview = ref<boolean>(false);
let imgPreviewLst = ref<Array<string>>(['']);
// 查看当前截图
const checkShootImg = (data: string) => {
  imgPreviewLst.value = [data];
  showImgPreview.value = true;
};
// 下载当前截图
const downLoadShootImg = (data: string, fileName: string) => {
  let a: HTMLAnchorElement | null = document.createElement('a');
  a.style.display = 'none';
  const blob = dataURLToBlob(data);
  const url = URL.createObjectURL(blob);
  a.setAttribute('href', url);
  a.setAttribute('download', fileName + '.png');
  document.body.appendChild(a);
  a.click();
  URL.revokeObjectURL(url);
  document.body.removeChild(a);
  a = null;
};
// 暂存当前截图
const saveScreenshot = () => {
  if (screenshotLst.value.length < 1) {
    const newSaveImg = {
      url: screenshotData.value,
      id: nanoid(),
      name: screenshotName.value
    };
    screenshotLst.value.push(newSaveImg);
    setScreenshotLst(screenshotLst.value);
    // activeName.value = 'list';
  } else {
    ElMessage.warning('浏览器最多存储1张图片！');
  }
};

/**
 * 删除历史图片
 * @param id 图片id
 * @author GengBiao
 */
const deleteHistoryImg = (id: string) => {
  ElMessageBox.confirm('确认删除吗？')
    .then(e => {
      const index = screenshotLst.value.findIndex(e => e.id === id);
      screenshotLst.value.splice(index, 1);
      setScreenshotLst(screenshotLst.value);
    })
    .catch(err => {
      console.log(err);
    });
};

// 关闭弹窗处理
const closeStyleBox = () => {
  visibleStyleBox.value = false;
};
onMounted(() => {
  document.body.addEventListener('click', closeStyleBox);
});
onBeforeUnmount(() => {
  document.body.removeEventListener('click', closeStyleBox);
});
</script>
<script lang="ts">
export default {
  name: 'ToolMapImg'
};
</script>

<template>
  <el-tooltip effect="dark" content="截图" placement="right-start">
    <div class="tool-item-btn cur-pointer" @click.stop="openContentBox">
      <svg class="icon svg-20" aria-hidden="true">
        <use href="#down-picture"></use>
      </svg>
    </div>
  </el-tooltip>
  <transition name="fromLeft">
    <div v-show="visibleStyleBox" class="map-style-box">
      <header>
        <h4>截图工具</h4>
        <Close class="svg-18 cur-pointer" @click.stop="closeStyleBox" />
      </header>
      <main @click.stop>
        <el-tabs v-model="activeName">
          <el-tab-pane label="截图" name="picture">
            <div v-show="screenshotData">
              <el-input
                v-show="editImgName"
                v-model="screenshotName"
                size="small"
                class="mg-b-10"
              >
                <template #append>
                  <div class="cur-pointer" @click.stop="editImgName = false">
                    保存
                  </div>
                </template>
              </el-input>
              <div v-show="!editImgName" class="screenshot-name">
                <span>{{ screenshotName }}</span>
                <svg
                  class="icon svg-16 cur-pointer"
                  aria-hidden="true"
                  color="#768fcd"
                  @click.stop="editImgName = true"
                >
                  <use href="#pencil"></use>
                </svg>
              </div>
            </div>
            <div class="screenshot-box" @click.stop="screenshot">
              <svg
                v-show="!screenshotData"
                class="icon svg-100"
                aria-hidden="true"
              >
                <use href="#screenshot"></use>
              </svg>
              <span v-show="!screenshotData" class="mg-b-10">点击截图</span>

              <img v-show="screenshotData" :src="screenshotData" />
              <div v-show="screenshotData" class="clear-shoot-image">
                <svg
                  class="icon svg-20"
                  aria-hidden="true"
                  color="red"
                  @click.stop="screenshotData = ''"
                >
                  <use href="#delete"></use>
                </svg>
              </div>
              <el-button-group
                v-show="screenshotData"
                class="shoot-image-option"
                size="small"
              >
                <el-button
                  plain
                  type="primary"
                  icon="ZoomIn"
                  @click.stop="checkShootImg(screenshotData)"
                  >查看</el-button
                >
                <el-button
                  plain
                  type="primary"
                  icon="FolderAdd"
                  @click.stop="saveScreenshot"
                  >暂存</el-button
                >
                <el-button
                  plain
                  type="primary"
                  icon="Download"
                  @click.stop="downLoadShootImg(screenshotData, screenshotName)"
                  >下载</el-button
                >
              </el-button-group>
            </div>
          </el-tab-pane>
          <el-tab-pane name="list">
            <template #label>
              <div class="tab-pane-save">
                <span>暂存</span>
                <div>{{ screenshotLst.length }}</div>
              </div>
            </template>
            <div
              v-for="img in screenshotLst"
              :key="img.id"
              class="history-screenshot-box"
            >
              <span>{{ img.name }}</span>
              <span>
                <!-- 查看 -->
                <svg
                  class="icon svg-16 cur-pointer"
                  aria-hidden="true"
                  color="#768fcd"
                  @click.stop="checkShootImg(img.url)"
                >
                  <use href="#search"></use>
                </svg>
                <!-- 下载 -->
                <svg
                  class="icon svg-16 cur-pointer mg-l-5"
                  aria-hidden="true"
                  color="#768fcd"
                  @click.stop="downLoadShootImg(img.url, img.name)"
                >
                  <use href="#down-picture"></use>
                </svg>
                <!-- 删除 -->
                <svg
                  class="icon svg-16 cur-pointer mg-l-5"
                  aria-hidden="true"
                  color="red"
                  @click.stop="deleteHistoryImg(img.id)"
                >
                  <use href="#delete"></use>
                </svg>
              </span>
            </div>
          </el-tab-pane>
        </el-tabs>
      </main>
    </div>
  </transition>
  <div @click.stop>
    <el-image-viewer
      v-if="showImgPreview"
      :url-list="imgPreviewLst"
      @close="showImgPreview = false"
    />
  </div>
</template>

<style scoped lang="scss">
@import 'style';
.tool-item-btn {
  left: 10px;
  bottom: 200px;
}
.map-style-box {
  $bgc: #f6f5f5;
  @include box-size(280px, auto);
  @include pseudo-element-striangle('left', 12px, $bgc);
  position: absolute;
  left: 50px;
  bottom: 200px;
  background: $bgc;
  border-radius: 5px;
  padding: 0 0 8px;
  box-shadow: 0px 0px 5px 2px #a6a6a6;
  > header {
    @include flex(row, space-between, center);
    height: 30px;
    width: 100%;
    border-bottom: 1px #d3d3d3 solid;
    padding: 0 8px;
  }
  > main {
    padding: 0 8px;
  }
}

.tab-pane-save {
  position: relative;
  > div {
    position: absolute;
    color: #ff2727;
    top: 0px;
    right: -12px;
    font-size: 14px;
    font-width: 600;
  }
}
.screenshot-name {
  @include flex(row, space-between, center);
  padding-bottom: 5px;
  padding-right: 3px;
  > span {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    width: calc(100% - 30px);
  }
}
.screenshot-box {
  @include flex(column, center, center);
  position: relative;
  cursor: pointer;
  border: 1px #d3d3d3 solid;
  margin: 0 auto;
  border-radius: 8px;
  color: #aaa;
  overflow: hidden;
  .clear-shoot-image {
    @include flex(column, center, center);
    position: absolute;
    top: 0px;
    right: 0px;
    background: #e8e8e8;
    border-bottom-left-radius: 8px;
    padding: 2px 2px 3px;
  }
  .shoot-image-option {
    position: absolute;
    bottom: 5px;
  }
}
.history-screenshot-box {
  @include flex(row, sapce-between, center);
  padding: 2px;
  border-radius: 4px;
  margin-bottom: 1px;
  &:nth-child(odd) {
    background: #fdfffb;
  }
  &:nth-child(even) {
    background: #fff8f3;
  }
  > span:nth-child(1) {
    width: calc(100% - 60px);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: 14px;
    color: #777777;
  }
  > span:nth-child(2) {
    @include flex(row, flex-end, center);
  }
}
</style>
