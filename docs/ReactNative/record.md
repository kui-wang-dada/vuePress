# ReactNative 知识点记录

## 一、 数据+状态方案记录

1. 页面发起 actions

2. store 中掉接口

3. 接口通过 api 封装，非交互数据请求到后做 model 处理（仅部分数据做了）

4. model 后的数据通过 reducer 存入 state

5. 通过 connect 将 state 按需注入页面

> 形成闭环，首屏数据统一存入 state，api 和 action 结合，页面注入和触发，形成前端小范围 mvc 结构

## 二、罗列知识点

### 基本知识

1. react 的 jsx 写法

2. es6,7 用法

3. react-native 提供的 api

### 四大支柱

1. axios 封装和配置

2. redux 生态链

3. react-navigation 各项配置

4. 公共方法的归类和注入

### 板块设计

1. 板块规则

2. 组件树设计

### 插件和原生

1. 熟悉 react-native 社区

2. 看懂插件文档

3. 原生的基本知识

## 三、 热更新和热部署

> RN 最吸引人的特性就是可以在 ios 和安卓上实现热部署，避过 app store 的审查

### 原理

1. 本地代码集成 codepush 的 sdk

2. 将更新后的内容发布到 codepush

3. 本地代码每次打开时会比对 codepush 服务器上的版本和本地版本是否一致，不一致会触发更新

4. 实现实时更新

### 具体配置地址

https://www.jianshu.com/p/6a5e00d22723

### 一些命令

1. 查看当前登录用户
   `code-push whoami`

2. 创建应用
   // code-push app add 应用名 版本 平台
   `code-push app add test-android android react-native`

3. 查看当前已创建 app 应用列表
   `code-push app list`

4. 重命名 app：`code-push app rename <appName> <newAppName>`

5. 移除 app：`code-push app rm <appName>`

6. 查看 app 的部署：`code-push deployment ls <appName> [--displayKeys|-k]`

7. 查看 app 的某个部署的发布更新的历史记录：`code-push deployment history <appName> <deploymentName> [--displayAuthor|-a]`

8. 发布更新：`code-push release-react 《应用名》 ios -t "1.0.0" --des "测试热更新" -d Staging`

9. debug：`code-push debug <platform>`

10. 查看已应用对应的 key 值 `code-push deployment ls 《应用名》 -k`

11. 清空 app 的更新 `code-push deployment clear <appName> Production or Staging`

## 四、 react-navigation

> RN 最常用的路由组件

### 简介

react-navigation 分为三个部分。

1. StackNavigator 类似顶部导航条，用来跳转页面和传递参数。

2. TabNavigator 类似底部标签栏，用来区分模块。

3. DrawerNavigator 抽屉，类似从 App 左侧滑出一个页面。

```javascript
const TabNav = createBottomTabNavigator(tabNavRouteConfig, tabOptionConfig);

const AppNavigator = createStackNavigator(stackRouteConfig, stakeOptionConfig);

const AppContainer = createAppContainer(AppNavigator);

<AppContainer onNavigationStateChange={this.onNavigationStateChange} />;
```

- routeConfig 为路由路径配置参数

- optionConfig 为导航定制相关参数

- AppContainer 将导航封装为组件

- appContainer 中的页面就可以使用`this.props.navigation.navigate(routeName,params)`跳转

## 五、 三方处理

### 需要 link

1. react-native-device-info

注意 该库使用的是 androidx，和当前大部分 android support 不兼容

2. react-native-gesture-handler

3. react-native-i18n

4. react-native-image-crop-picker

5. react-native-picker

6. react-native-signature-capture

7. react-native-splash-screen

8. react-native-webview

9. rn-fetch-blob

## 六、 当 androidx 和 support 冲突时

1. 通过./gradlew :app : dependencies 查看哪个依赖使用了 androidx

2. 回退该依赖为支持 support 的版本

## 七、 集成自定义 iconfont

1. 安装 react-native-vector-icons 插件

2. 书写 icon 组件，调用上述插件的 create 方法

3. 在阿里 iconfont 选择对应的 icon 并下载

4. 使用工具将 ttf 文件生成对应的 json 文件

5. ios：将 ttf 文件引入 build phase 的 link 中

6. ios: 在 info 中添加 iconfont.ttf 信息

7. android: 在 app/build 中添加以下代码

```javascript
project.ext.vectoricons = [
    iconFontNames: ['iconfont.ttf' ] //添加你需要赋值的字符文件
]
apply from: "../../node_modules/react-native-vector-icons/fonts.gradle"

```

8. android: 将生成的 ttf 文件复制到 app/src/main/assets/fonts 文件中

## 八、 国际化

### 问题

1. react-native-i18n 设置语言后无法实时更新

2. 页面必须手动触发 render 才会有效果

3. react-navigation 中的 tabbar 和 title 也无法更新

### 解决思路

1. 所有页面都是由 react-navigation 包裹的，触发 react-navigation 的更新即可刷新所有页面

```javascript
let { refresh } = this.state;
return (
  <Root>
    <AppNavigator
      onNavigationStateChange={this.onNavigationStateChange}
      screenProps={{ refresh }}
    />
  </Root>
);
```

通过 eventBus 触发 refresh 的更新

2. 底部 tabbar 在页面渲染之前就生成了，故上述一对 tabbar 无效

```javascript
<AppNavigator
  onNavigationStateChange={this.onNavigationStateChange}
  screenProps={{ refresh, tabLabel }}
/>;

navigationOptions: ({ screenProps }) => ({
  tabBarLabel: screenProps.tabLabel.home,
  tabBarIcon: ({ tintColor, focused }) => (
    <Icon name={focused ? "home2" : "home1"} size={25} color={tintColor} />
  ),
  header: null
});
```

通过 ScreenProps 将值传入 createBottomTabNavigator，然后在跟页面里设置 ScreenProps，并在 eventBus 回调中动态改变

## 九、 启动图和图标

### 图标

1. ios:通过图标工厂制作不同尺寸图标

2. ios:选择 images.xcassets,并按 appicon 的设置将不同尺寸的图片上传

3. ios:在 general 中选择 appicon

4. android:通过图标工厂制作不同尺寸的图片

5. android:将图标放入 app/src/main/res 文件夹下

6. android:在 androidManifest 中改图标名称

### 启动图

1. 通过图标工厂制作安卓和 ios 不同尺寸的图标

2. ios: 在 images.xcassets 中添加 launchImages,并按尺寸上传

3. ios:删除 launchScreen.xib 文件

4. ios:general 中选择 launchImages,launchScreenfile 为空

5. 删除 app，重新加载

6. android:将生成的图标放入 app/src/main/res 文件加下

7. android: 在上述文件夹下新建 layout/launch_screen.xml，内容如下

```javascript
<?xml version="1.0" encoding="utf-8"?>
<RelativeLayout xmlns:android="http://schemas.android.com/apk/res/android"
    android:orientation="vertical" android:layout_width="match_parent"
    android:layout_height="match_parent">
    <ImageView android:layout_width="match_parent" android:layout_height="match_parent" android:src="@drawable/screen" android:scaleType="centerCrop" />
</RelativeLayout>
```

8. android: 新建 drawable/icon.png 文件，不然无法打包通过
