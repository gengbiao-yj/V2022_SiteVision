<!-- name: 表格列设置 -->
<script lang="ts" setup>
import type Node from 'element-plus/es/components/tree/src/model/node';
import type { DropType } from 'element-plus/es/components/tree/src/tree.type';
import { defineProps, defineEmits } from 'vue';

const props = defineProps({
  // 表格列配置
  tableColumn: {
    type: Array,
    required: true
  }
});

const emit = defineEmits(['update:tableColumn']);

const columnPopover = ref(false); // 列设置 popover 展现状态
const treeInstance = ref(); // 列设置 tree instance
const defaultProps = {
  children: 'children',
  label: 'label',
  disabled: 'disabled'
}; // tree props

interface column {
  id: number;
  label: string;
  fixed: string | boolean;
  minWidth: string;
  width: string;
  prop: string;
} // type: tree-node-data 数据类型
const tableColumn = reactive([
  {
    id: 0,
    label: '展示列',
    children: [...props.tableColumn] as Array<column>
  }
]); // tree node data
const checkedTableColumn = reactive([...tableColumn[0].children]); // 当前已选择要展示的列

// 节点复选框状态变更
const popoverColumnCheck = (
  item: object,
  data: {
    checkedNodes: Array<column>;
  }
) => {
  checkedTableColumn.length = 0;
  data.checkedNodes.forEach(e => {
    if (e.id !== 0) checkedTableColumn.push(e);
  });
  emit('update:tableColumn', checkedTableColumn);
};

// 拖拽指示线显示控制 status 控制显示隐藏
const dragLineShow = (status: '0' | '1') => {
  let line = document.querySelector(
    '.table-column-tree + .drag-line'
  ) as HTMLDivElement;
  if (line) {
    line.style.willChange = 'display';
    line.style.transition = 'all 0.3s ease-in-out';
    line.style.opacity = status;
    return line;
  }
};

// 重置表格列
const resetTableColumn = (node: object) => {
  checkedTableColumn.length = 0;
  tableColumn[0].children.sort((a, b) => a.id - b.id); // 排序复位
  tableColumn[0] = JSON.parse(JSON.stringify(tableColumn[0])); // 生成新数据，复位DOM排序
  tableColumn[0].children.forEach(e => {
    checkedTableColumn.push(e);
  }); // 表格列顺序复位
  checkedTableColumn.forEach(e => (e.fixed = false)); // 取消所有固定
  emit('update:tableColumn', checkedTableColumn);
  nextTick(() => {
    treeInstance.value.setCheckedKeys([0]); // 恢复全选
  });
  // 删除拖拽指示线
  dragLineShow('0');
};

// 列固定
const fixedTableColumn = (node: any, fixed: string) => {
  let filter = checkedTableColumn.filter(e => e.id === node.data.id);
  if (filter.length) {
    filter[0].fixed === fixed
      ? (filter[0].fixed = false)
      : (filter[0].fixed = fixed);
  }
  emit('update:tableColumn', checkedTableColumn);
};

// 允许拖拽插入条件
const allowDrop = (draggingNode: Node, dropNode: Node, type: DropType) => {
  if (dropNode.data.id === 0) {
    return false;
  } else {
    return type === 'prev';
  }
};

// 允许拖拽条件
const allowDrag = (draggingNode: Node) => {
  return draggingNode.data.id !== 0 && draggingNode.data.fixed === false;
};

// 拖拽离开某个节点时触发的事件
const handleDragLeave = (draggingNode: Node, dropNode: Node, ev: any) => {
  const line = dragLineShow('1');
  if (line && ev.target.offsetTop > 30) {
    line.style.top = `${ev.target.offsetTop + 12}px`;
  }
};

// 拖拽完成()成功
const nodeDropSuccess = () => {
  treeInstance.value.setCheckedKeys([0]); // 恢复全选（拖拽的节点默认脱离选中状态，此处重新选中）
  let checkedNodes: Array<column> = treeInstance.value.getCheckedNodes(); // 当前选中节点
  // 重新赋值，更新DOM
  checkedTableColumn.length = 0;
  tableColumn[0].children.length = 0;
  checkedNodes = JSON.parse(JSON.stringify(checkedNodes));
  checkedNodes.forEach((e, i) => {
    if (e.id !== 0) {
      checkedTableColumn.push(e);
      tableColumn[0].children.push(e);
    }
  });
  nextTick(() => {
    treeInstance.value.setCheckedKeys([0]); // 恢复全选（重新赋值后，展示列下属节点默认未选中，此处重新选中）
  });
  dragLineShow('0');
  emit('update:tableColumn', checkedTableColumn);
};

// 点击空白处关闭表格列设置弹窗
const closeColumnPopover = () => {
  columnPopover.value = false;
};
onMounted(() => {
  document.body.addEventListener('click', closeColumnPopover);
});
onBeforeUnmount(() => {
  document.body.removeEventListener('click', closeColumnPopover);
});
</script>
<template>
  <!-- 列设置 -->
  <el-popover
    v-model:visible="columnPopover"
    placement="bottom"
    :width="230"
    trigger="click"
  >
    <template #reference>
      <div>
        <el-tooltip effect="dark" content="设置列" placement="top-start">
          <Tools class="svg-18" @click.stop="columnPopover = !columnPopover" />
        </el-tooltip>
      </div>
    </template>
    <el-tree
      :data="tableColumn"
      :props="defaultProps"
      :default-expanded-keys="[0]"
      :default-checked-keys="[0]"
      draggable
      :allow-drop="allowDrop"
      :allow-drag="allowDrag"
      class="table-column-tree"
      node-key="id"
      show-checkbox
      ref="treeInstance"
      @check="popoverColumnCheck"
      @node-drag-leave="handleDragLeave"
      @node-drop="nodeDropSuccess"
      @node-collapse="dragLineShow('0')"
      @node-expand="dragLineShow('0')"
    >
      <template #default="{ node }">
        <div class="custom-tree-node">
          <span>
            {{ node.label }}
          </span>
          <div>
            <el-tooltip
              effect="dark"
              content="固定到左侧"
              placement="bottom-start"
            >
              <svg
                class="icon svg-12 mg-r-15"
                :class="{ 'color-red': node.data.fixed == 'left' }"
                aria-hidden="true"
                v-show="node.data.id !== 0"
                @click.stop="fixedTableColumn(node, 'left')"
              >
                <use href="#icon-xueyuan-shangyijie"></use>
              </svg>
            </el-tooltip>
            <el-tooltip
              effect="dark"
              content="固定到右侧"
              placement="bottom-start"
            >
              <svg
                class="icon svg-12 mg-r-5"
                :class="{ 'color-red': node.data.fixed == 'right' }"
                aria-hidden="true"
                v-show="node.data.id !== 0"
                @click.stop="fixedTableColumn(node, 'right')"
              >
                <use href="#icon-xueyuan-xiayijie"></use>
              </svg>
            </el-tooltip>
            <span
              v-if="node.data.id === 0"
              class="primary-color ft-s-12"
              @click.stop="resetTableColumn(node)"
              >重置</span
            >
          </div>
        </div>
      </template>
    </el-tree>
    <div class="drag-line"></div>
  </el-popover>
</template>

<style scoped lang="scss">
.el-tooltip__trigger {
  @include flex(row, center, center);
}
</style>

<script lang="ts">
export default {
  name: 'SvTableColumnOption'
};
</script>
