##一、 前端思考

> 将数据展示在不同硬件上的一套规则

- 颜色样式规则 —— css

- 交互跳转规则 —— js

### 需要什么

1. 数据

2. 页面跳转规则

3. 全局状态管理

4. 公共方法引入

5. 具体页面

### 当前项目(vue+cordova)对应的支持

1. axios ： 从后台拿到数据

2. vue+router ： 前端路由

3. vuex ： vue 项目状态管理

4. utils ： 自己封装的公共方法

5. pages: 根据 ui 图和原型图组织

### RN 项目对应的支持

1. axios ： 从后台拿到数据，vue+RN 都可以集成

2. react-navigation ：RN 前端路由

3. react-redux : RN 状态管理

4. utils : 自己封装的公共方法

5. pages: 根据 ui 图和原型图组织

### 其他项目

- 万变不离其中，前端四条腿封装好，不管技术栈如何变，项目不会偏

##二、敏捷开发思考

![15.jpg](https://upload-images.jianshu.io/upload_images/9421914-c8c998198837078f.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
![16.jpg](https://upload-images.jianshu.io/upload_images/9421914-0e10c9bffdb957a5.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

##三、 项目相关

### 层级关系

- 顶层业务，具体根据 ui 图和原型图划分板块，填写 css 规则和 js 规则

- 四条腿支撑业务跑起来，通过 vue 原型注入到业务组件中

- webpack 完美提供环境配置，打包发布部署 h5 等工作，vue 底层 api 构建项目基础

- cordova 提供 webview+webpack 打包成的 h5 文件，变为 app。

注意：app 需要灵活使用 androidStudio 和 xcode 工具

![11.jpg](https://upload-images.jianshu.io/upload_images/9421914-89659108572d63bb.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

### 项目组织结构

> 封装项目的四条腿

- 接口的具体路径配置在 api，接口请求成功失败的回调拦截在 config/axios

- 路由的具体路径配置在 router，路由的全局导航守卫在 config/router

- 公共方法在 utils，只导出了 method，常量/指令/过滤器/正则使用时通过具体路径导入

- 全局状态 vuex 在 store

![12.jpg](https://upload-images.jianshu.io/upload_images/9421914-05574a2ffe6fcf0f.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

### 公共组件树

- common 存放公共业务组件，板块间可复用；

- ui 存放公共 ui 组件，同技术栈可复用

![13.jpg](https://upload-images.jianshu.io/upload_images/9421914-9cd3acb4dcd4d184.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

### customer 用户板块页面组件树

- 文件夹根目录下全为页面组件

- item 中为页面不可复用小板块组件

- components 中为页面可复用组件

![14.jpg](https://upload-images.jianshu.io/upload_images/9421914-2bb2c72c2f06e21e.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
