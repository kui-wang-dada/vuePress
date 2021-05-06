# Webpack 小结

## 什么是 webpack

- 一个打包工具，把各种各样的文件打包成一个 JS 文件，或者是把一些小图打包到大图里面。

- 可以处理 js，jade，css，less，scss 等文件

## 为什么要使用 webpack

- 模块化——前端越来越复杂，将代码划分到不同的模块中，将模块打包成一个或几个

- 优化加载速度——压缩代码

- 使用新的开发模式——使用 ES6，转换代码

## webpack 特点

- 同时支持 commonjs 和 amd

- 一切都可以打包

- 分模块打包

## 简单示例

entry：入口

output：打包出来的文件路径和文件名

module：对应模块

使用了 webpack 后可以使用 require()

```javascript
module.exports = {
  //文件入口
  entry: "./index.js",
  output: {
    //打包出口的配置
    path: __dirname, //文件路径
    filename: "bundle.js" //文件名
  },
  //模块
  module: {
    //读取某些类型的文件时需要预先处理
    loaders: [
      {
        test: /\.css$/, //正则，匹配对应的文件名
        loaders: ["style-loader", "css-loader"] //如何处理，一般使用三方，执行顺序从右到左，css-loader处理css文件，style-loader将处理的文件挂在到页面上
      }
    ]
  }
};
```

### 多入口示例

```javascript
var path = require("path"); //webpack自带

var config = {
  entry: {
    admin: "./admin/index.js", //管理界面入口
    consumer: "./consumer/index.js" //用户界面入口
  },
  output: {
    path: path.join(__dirname, "dist"), //打包的文件路径和文件名
    publicPath: "/dist/", //从哪一个url获取公共文件
    filename: "[name].bundle.js" //name读取entry中的key
  }
};

module.exports = config;
```

### 启动 webpack 的 hot-reload

在 package 中的 scripts 加入 start 命令

便可用 npm run start 启动

```json
{
  "name": "demo2",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "start": "webpack-dev-server --progress --colors --hot --inline"
  }
}
```

webpack 的 plugin

修改 webpack 底层的配置 api，可以定制优化 webpack 的配置

```javascript
var path = require("path"); //webpack自带
var webpack = require("webpack");

var config = {
  entry: {
    admin: "./admin/index.js", //管理界面入口
    consumer: "./consumer/index.js" //用户界面入口
  },
  output: {
    path: path.join(__dirname, "dist"), //打包的文件路径和文件名
    publicPath: "/dist/", //从哪一个url获取公共文件
    filename: "[name].bundle.js" //name读取entry中的key
  },
  plugins: [
    new webpack.optimize.UglifyJsPlugin() //压缩代码
  ]
};

module.exports = config;
```

### webpack 的 module 设置

```javascript
var path = require("path");
var webpack = require("webpack");

var env = process.env.NODE_ENV;
var config = {
  entry: {
    admin: "./admin/index.js",
    consumer: "./consumer/index.js"
  },
  output: {
    path: path.join(__dirname, "dist"),
    publicPath: "/dist/",
    filename: "[name].bundle.js"
  },
  plugins: [],
  module: {
    noParse: [/jquery/], //不对该文件进行额外的压缩打包，加快打包时间
    loaders: [
      {
        test: /\/images\//, //针对所有含有/images/的文件
        loader: "file" //加载文件的loader
      },
      {
        test: /\/icons\//, //针对所有含有/icons/的文件
        loader: "url" //变为base64图片
      },
      {
        test: /\.js$/, //针对所有的js文件
        exclude: /node_modules/, //排除node_modules文件
        include: __dirname, //只对当前打包
        loader: "babel" //使用babel
      },
      {
        test: /\.scss$/, //后缀名为.scss的文件
        loader: "style!css!sass" //从右往左运行，
      }
    ]
  }
};
if (env === "production") {
  config.plugins = config.plugins.concat(
    new webpack.optimize.UglifyJsPlugin({
      //压缩文件
      compress: {
        warnings: false //去除warning
      }
    }),
    new webpack.optimize.OccurenceOrderPlugin() //优化boundle的id使其更小
  );
}

module.exports = config;
```
