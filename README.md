# sitesvision

## 简介
基于 MapBox 与大数据的一款选址规划系统，采用时下流行的 Vue3 UI 库 Element-Plus UI；技术框架采用了 Vue3.2 + WebPack5 + TypeScript4.5 + Element-Plus。

## 特性

- 布局方案
  - 丰富的布局模式，具有高可配性，满足您的各类布局需求
- 最新技术栈
  - 基于 Vue3、WebPack5、TypeScript、Element-Plus、Pinia 等最新技术栈开发
- 组件封装
  - 对日常使用频率较高的组件二次封装,满足基础工作需求
- 主题配置
  - 丰富的主题配置及黑暗主题适配
- 权限管理
  - 完善的前后端权限管理方案

## 项目地址

[🎉 GIT仓库](https://github.com/gengbiao-yj/V2022_SiteVision.git)

## 安装&运行&构建

- 安装依赖（npx only-allow yarn）

  ```node
  yarn install
  ```

- 本地运行（cross-env 会重写环境变量，已自动配置本地proxy代理跨域）

  ```node
  yarn serve:dev  #本地链接开发环境
  
  yarn serve:uat  #本地链接测试环境
  
  yarn serve:prod #本地链接正式环境
  ```

- 构建项目

  ```node
  yarn build:dev  #构建开发环境，输出打包文件 dist_dev
  
  yarn build:uat  #构建测试环境，输出打包文件 dist_uat
  
  yarn build:pros #构建正式环境，输出打包文件 dist_prod
  ```

- 备注

  - 项目 node 版本已锁定为"14.x"，请使用 nvm 工具自行切换电脑本地 node 版本
  - 请使用 yarn 作为该项目的包管理工具

## 规范

- 代码规范

  - 项目集成了 eslint 代码校验与 prettier 代码格式化

  - ```node
    yarn lint # 校验并格式化代码
    ```

  - 配置文件：.prettierrc.js、.eslintrc.js、.eslintignore

- git 提交规范

  - 项目集成了 commitlint 工具，规范 git commit 内容格式

  - ```
     * feat：新增功能
     * fix：bug 修复
     * docs：文档更新
     * style：不影响程序逻辑的代码修改(修改空白字符，格式缩进，补全缺失的分号等，没有改变代码逻辑)
     * refactor：重构代码(既没有新增功能，也没有修复 bug)
     * perf：性能, 体验优化
     * test：新增测试用例或是更新现有测试
     * build：主要目的是修改项目构建系统(例如 glup，webpack，rollup 的配置等)的提交
     * ci：主要目的是修改项目继续集成流程(例如 Travis，Jenkins，GitLab CI，Circle等)的提交
     * chore：不属于以上类型的其他类型，比如构建流程, 依赖管理
     * revert：回滚某个更早之前的提交
    ```

  - 配置文件： commitlint.config.js

## 目录结构

```
  app
  ├─ public             # 静态资源
  │  ├─ resource        # 资源文件(打包过程中不做压缩处理直接拷贝)
  │  ├─ index.html      # 入口文件
  │  └─ favicon.icon    # 网站图标
  ├─ dist_dev           # dev打包
  ├─ dist_uat           # uat打包
  ├─ dist_prod          # prod打包
  ├─ src                # 源码
  │  ├─ apis            # 封装接口请求
  │  ├─ assets          # 资源文件
  │  ├─ components      # 项目组件
  │  │  ├─ Layout       # 布局组件
  │  │  └─ PublicGlobal # 全局注册公共组件
  │  ├─ data            # 定义数据
  │  ├─ directives      # Vue 自定义指令
  │  ├─ pinia           # 公共状态仓库
  │  ├─ plugin          # 封装插件（axios、element 等）
  │  │  ├─ Axios        # axios 封装，供apis内部文件调用
  │  │  └─ ElementPlus  # ElementPlus 封装处理
  │  ├─ router          # 路由
  │  ├─ scss            # 样式
  │  │  ├─ components   # ElementPlus 样式重写
  │  │  ├─ global       # 全局 scss 变量、mixin 混入文件目录
  │  │  ├─ public       # 公共样式文件目录
  │  │  ├─ global.scss  # 全局 scss 变量、mixin 混入，导出文件
  │  │  └─ public.scss  # 公共样式导出文件
  │  ├─ types           # TypeScript 类型定义
  │  ├─ utils           # 公共方法
  │  └─ views           # 所有业务页面
  ├─ App.vue            # 根组件
  ├─ main.ts            # 初始化文件
  ├─ shims-vue.d.ts     # 适配定义文件（*.vue/*.json）
  ├─ .env.prod          # 生产环境配置文件
  ├─ .env.dev           # 开发环境配置文件
  ├─ .env.uat           # 测试环境配置文件
  ├─ .env.prod          # 生产环境配置文件
  ├─ .eslintignore      # eslint 忽略检查文件配置
  ├─ .eslintrc.js       # eslint 代码检查配置
  ├─ .eslintrc-auto-import.json
  ├─ .gitignore         # git 忽略文件配置
  ├─ .prettierrc.js     # 代码格式化配置
  ├─ auto-imports.d.ts
  ├─ babel.config.js    # bable 配置
  ├─ commitlint.config.js # git commit 规范检查配置
  ├─ tsconfig.json      # ts 配置
  ├─ components.d.ts
  ├─ package.json
  ├─ package-lock.json  # 依赖包版本锁定（npm）
  ├─ yarn.lock          # 依赖包版本锁定（yarn）
  ├─ README.md          # 项目文档
  └─ vue.config.js      # vue-cli 配置
```

## 浏览器支持  

本地开发推荐使用`Chrome 80+` 浏览器

支持现代浏览器, 不支持 IE

| IE          | Edge            | Firefox         | Chrome          | Safari          |
| ----------- | --------------- | --------------- | --------------- | --------------- |
| not support | last 2 versions | last 2 versions | last 2 versions | last 2 versions |

## 截图

![image](https://gitee.com/gengbiao-yangjie/tc-images/raw/master/picture/20220906/134435557-1.png)

![image](https://gitee.com/gengbiao-yangjie/tc-images/raw/master/picture/20220906/134929970-1.png)

![image](https://gitee.com/gengbiao-yangjie/tc-images/raw/master/picture/20220906/134940921-1.png)

![image](https://gitee.com/gengbiao-yangjie/tc-images/raw/master/picture/20220906/134953715-1.png)
