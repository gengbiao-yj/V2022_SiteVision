<script setup lang="ts">
import { getMapStyle, saveMapStyle } from '@/apis/user';
import { ElMessage } from 'element-plus/es';

interface PropsType {
  cusNo: string;
}
const props = defineProps<PropsType>();

/*  获取图层样式
------------------------------------------------ */
const layerStyles = ref() as { value: Array<MapStyle> };
const getLayerStyle = async () => {
  try {
    const { code, data } = await getMapStyle({ cusNo: props.cusNo });
    if (code === 200) {
      layerStyles.value = data;
      layerStyles.value.forEach(e => {
        e.outlineWidth = parseInt(e.outlineWidth as string);
        console.log(e.outlineWidth);
      });
    }
  } catch (e) {
    console.log(e);
  }
};
getLayerStyle();

/*  保存图层样式
------------------------------------------------ */
const saveAllLayers = () => {
  let promiseAll = [] as Promise<{ code: number }>[];
  layerStyles.value.forEach(e => {
    promiseAll.push(saveMapStyle(e));
  });
  Promise.all(promiseAll)
    .then(res => {
      if (res.every(j => j.code === 200)) {
        ElMessage.success('保存成功');
        getLayerStyle();
      } else {
        ElMessage.error('保存失败');
      }
    })
    .catch(err => {
      ElMessage.error('保存失败');
      console.log(err);
    });
};
</script>
<script lang="ts">
export default {
  name: 'LayerMaintenance'
};
</script>

<template>
  <div class="info-box">
    <!-- 标题 -->
    <div class="title mg-b-15">
      <div class="left">
        <span class="ft-s-13 ft-w-6">图层维护</span>
      </div>
      <div class="right">
        <el-button size="small" type="primary" @click="saveAllLayers"
          >保存</el-button
        >
      </div>
    </div>
    <!-- 卡片内容 -->
    <div class="content-box">
      <el-scrollbar>
        <div class="content">
          <el-card v-for="e in layerStyles" :key="e.layCode" shadow="hover">
            <img src="../../../../public/resource/imgs/layerView.png" />
            <div class="pd-r-10 pd-l-10">
              <el-divider>
                <span class="ft-s-18">{{ e.layName }}</span>
              </el-divider>
              <div class="row">
                <span>填充颜色</span>
                <el-color-picker
                  v-model="e.fillColor"
                  show-alpha
                  size="small"
                />
              </div>
              <div class="row">
                <span>边框颜色</span>
                <el-color-picker
                  v-model="e.outlineColor"
                  show-alpha
                  size="small"
                />
              </div>
              <div class="row">
                <span>边框宽度</span>
                <el-slider v-model="e.outlineWidth" max="10" />
              </div>
              <div class="row">
                <span>边框类型</span>
                <el-radio-group v-model="e.outlineType" class="ml-4">
                  <el-radio label="line">实线</el-radio>
                  <el-radio label="dash">虚线</el-radio>
                </el-radio-group>
              </div>
            </div>
            <div
              class="layer"
              :style="{
                background: e.fillColor,
                border: `${e.outlineWidth}px ${
                  e.outlineType === 'line' ? 'solid' : 'dashed'
                } ${e.outlineColor}`
              }"
            ></div>
          </el-card>
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
    display: grid;
    grid-template-rows: auto;
    grid-template-columns: repeat(4, 256px);
    grid-auto-flow: row;
    justify-content: space-between;
    overflow: hidden auto;
    padding-right: 10px;

    .el-card {
      width: 100%;
      position: relative;
      padding: 0;
      &:deep(.el-card__body) {
        padding: 0;
        > img {
          width: 100%;
        }
      }

      .row {
        @include flex(row, space-between, center);
        color: #6a6a6a;
        font-size: 14px;
        margin: 8px 0;
        > span {
          width: 60px;
        }
        > div {
          width: calc(100% - 80px);
          @include flex(row, flex-end, center);
        }
      }

      .layer {
        position: absolute;
        width: 140px;
        height: 140px;
        top: 58px;
        right: calc(50% - 70px);
        border-radius: 50%;
      }
    }

    .el-card:nth-child(n + 5) {
      margin-top: 4%;
    }
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
