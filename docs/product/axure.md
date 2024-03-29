# axure 绘制产品原型图和流程图

## 绘制

### 布局

- 左侧可建立不同模块文件夹，一般需要有一个 log 文件夹，保留一些流程图和日志记录
- 不同元素的对齐，可通过 command 选中后，通过工具栏快捷按钮选择，类似 flex 布局
- 对于弹框，导航，绝对定位的内容，使用动态面板/固定到浏览器

### 插入

- 灵活使用快捷键，插入内容后的字母即为快捷键，点击后，鼠标会变形，拖动即会产生插入的内容
- 椭圆变为圆，拖动时按住 shift
- 插入内容后，右侧可选择宽高和坐标；通常 web 端宽 1920*900，主体 1100-1400 之间；h5 宽 375*667

#### 快捷键

1. command+c x v: 复制剪切粘贴
2. 方向键 / ctrl+方向键 :移动 1px / 10px
3. ctrl + z / y / a / s / g / shift+g: 撤销 / 重做 / 全选 / 保存 / 组合 / 取消组合

### 交互

- 选中内容，右边 tab 选择对应交互
- 在预览或 publish 才可看到效果

### 模块化设计

> 类似于组件，将通用的内容提取出来，可按照代码分类为 ui 组件和业务组件，不断积累

- command 选择需要提取的内容
- 在选中的内容上，右键 create master，命名
- 在左下角 masters 的 tab 下，找到对应 master
- 在任何页面，可直接拖用提取的 master
- 当需要修改时，直接改 master，所有调用的页面都会直接变化
- 如果是布局性 master，可右键 master，直接锁定 location

## 预览和发布

- 点击预览，可在 chrome 浏览器查看效果（axure 起了一个服务）
- 预览时不是热更新，改变之后，需要刷新浏览器才能看到最新的变化
- publish/生成 html 文件，将文件打包成了静态网站，chrome 安装 axure 插件后，点击 index.html 即可查看
- 若将 index.html 所有内容放到服务器，并配置网址，则不需要任何插件，可直接通过网址访问
