import * as ElementPlusIconsVue from '@element-plus/icons-vue';
import type { App } from 'vue';

// 引入所有 icon 图标
export function setupAllIcon(app: App) {
  for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component);
  }
}
