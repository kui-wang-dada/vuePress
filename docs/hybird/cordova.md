## cordova 基础

### 什么是 cordova

> 通过写 web app ,根据输出平台要求不同，提供不同类型的安装包；个人感觉 cordova 就是把 webapp 包了一层，让其 html,css,js 能跑在不同的客户端

### 常用命令

- cordova install android 将编译好的应用程序安装到模拟器上
- cordova emulate android 在模拟器上运行
- cordova serve android 在浏览器中运行
- cordova build android 打包项目到 android 平台

## cordova 实战

1. 安装
   > 通过 npm install -g cordova
2. 创建一个 app
   > cordova create [appname]
3. 添加一个平台
   > cordova platform add ios/android;不清楚可以添加什么平台时使用：cordova platform 查看
4. 运行
   > cordova run android/ios
5. config.xml

- widget 这是我们在创建应用程序时指定的应用程序反向域值。
- name 我们在创建应用程序时指定的应用程序名称。
- description 应用程式说明。
- author 应用程式的作者。
- content 应用程序的起始页。 它位于 www 目录内。
- plugin 当前安装的插件。
- access 用于控制对外部域的访问。 默认的 origin 值设置为 \* ，这意味着允许访问任何域。 此值不允许打开某些特定的网址来保护信息。
- allow-intent 用于控制对外部域的访问。 默认的 origin 值设置为 \* ，这意味着允许访问任何域。 此值不允许打开某些特定的网址来保护信息。...
- platform 构建应用程序的平台。

## 一、 跑通 cordova

> 了解 cordova 打包发布流程，为代码在真机上调试打基础

### 尝试一：生成一个 cordova 壳子，将工程代码打包，放入壳子对应的位子再用 cordova 打包生成 app 文件，在手机上看效果

1. 安装 cordova：npm install -g cordova；
2. 生成项目壳子：cordova create myApp

- config.xml 目录： cordova 的配置文件
- hooks 目录：存放自定义 cordova 命令的脚本文件。每个 project 命令都可以定义 before 和 after 的 Hook，比如：
  before_build、after_build。
- platforms 目录：各个平台的原生代码工程，不要手动修改，因为在 build 的时候会被覆盖。
- plugins 目录： 插件目录（cordova 提供的原生 API 也是以插件的形式提供的）。
- www 目录：源代码目录，在 cordova prepare 的时候会被 copy 到各个平台工程的 assets\www 目录中。
  其中 index.html 为应用的入口文件。

3. 查看可添加的平台：cordova platform ls ;添加平台：cordova platform add Android/ios
4. 打包工程代码：npm run build
5. 将生成的 www 文件替换入壳子中
6. 打包壳子和项目代码:cordova build，生成对应 apk 文件

- 如果是 android 需下载 jdk
- 如果是 ios 需下载 xcode
- 为了让项目更好的测试和运行，下载 Android Studio 和 xcode 跑两端

### 尝试 2

> 当前项目是基于 vue 集成了 cordova，通过命令行直接打包，不需要再造壳子

1. 直接通过 npm run cordova，下载 cordova 对应的依赖
2. 必须先 npm run build 之后再执行上述命令
3. 本机需要有 cordova 环境，即需下载 xcode,androidStudio,jdk，cocoapods 等
   > 下载 cocoapods 时通过命令 sudo gem install -n /usr/local/bin cocoapods 下载最新的

- 管理 rvm 命令：rvm list ,rvm --default use []

##二、 xcode 问题记录：

1. cordova-plugin-uniquedeviceid 和 phonegap-plugin-push 无法通过 cordova prepare android/ios 下载
   通过 cordova plugin add 【依赖名】解决
2. 使用 xcode 报错：Module 'FirebaseInstanceID' not found；

- 尝试安装 cocoapods，并 pod setup（安装有点慢）
- cordova platform rm ios,删掉原来的 ios 项目
- cordova platform add ios ,加入
- 进入 platform/ios 目录，执行 pod install --verbose

3. xcode 调试

- 在 safari 中进入 Preferences-Advanced-show Develop menu
- safari 菜单栏中 Develop-对应的模拟机-对应的网页

##三、 Android Studio 问题记录

1. 找不到 com.lint; 在 allproject 中加入 google()，将 android 删掉在加入
2. 找不到 google-service.json，去 firebase 下载后运行再删掉
3. 暂时还无法在 androidstudio 的模拟机上运行，google-services.json 一直找不到；猜测：

- 需要购买谷歌服务，或者公司已经有对应账号
- 安卓模拟机无法访问到谷歌服务，服务无法连接
- 其他先决条件

- **解决方案：**
- 删掉 android 平台在加入时，默认会加入最新的，需要指定为 6.4.0
- android sdk 必须使用 26，不要升级
- 删除安卓平台在加入

4. AAPT2 error，找不到 ttIndex 和 fontVariationSettings

- **解决方案：**  
  找到 project/build.gradle 文件,添加以下代码

```javascript
 // 在build.gradle(Module:app)单独配置
 configurations.all {
     resolutionStrategy {
             force 'com.android.support:support-v4:27.1.0'
      }
 }
```

5. unmearge max 错误

- **解决方案**
  在 project/build.gradle 中注释掉以下代码

```javascript
 dependencies {
    implementation fileTree(dir: 'libs', include: '*.jar')
    // SUB-PROJECT DEPENDENCIES START
    implementation(project(path: "CordovaLib"))
    compile "com.android.support:support-v4:24.1.1+"
    compile "com.android.support:support-v4:+"
// 下面这行和上面有冲突
//    compile "com.android.support:support-v13:26.+"
    compile "me.leolin:ShortcutBadger:1.1.17@aar"
    compile "com.google.firebase:firebase-messaging:11.6.2"
    // SUB-PROJECT DEPENDENCIES END
}
```

##四、 总结

### cordova requirements

**安卓**

- java jdk ：通过 www.oracle.com 下载 8.0 版本
- android sdk：安装 android studio 后自动下载
- android target：安装 android studio 后自动下载
- gradle ：通过 brew install gradle 下载

**ios**

- macOS：系统自带
- xcode：app store 下载
- ios-deploy：npm install -g ios-deploy 下载
- cocoapods：先下载 rvm，通过 rvm 的 sudo gem install -n /usr/local/bin cocoapods 下载

### 打包流程

1. 先使用 npm run build 生成 web 包
2. 在通过 cordova build android/ios 来生成安卓和 ios 版本
3. 通过 as 或者 xcode 模拟器看效果
