## 从零搭建一个脚手架

### 目的

1. 熟悉 npm 发布流程，为开源组件做流程知识储备

2. 思考 webpack 配置，eslint 配置，组织架构和插件封装，形成架构。

3. 将组织好的架构发布到 npm，积累架构并可持续发展。无论何时何地都可立刻使用。

### 我的情况

1. vue 技术栈有大量后台管理系统经验，可用脚手架提取一个。

2. vue 技术栈有 cordova 混合开发经验，可搭建一个。

3. ReactNative 技术栈有三个 app 开发经验，可提炼并优化一个

4. Node 后台服务学习和练手需要搭建两个，分为 koa+mysql 和 express+mongodb。

### 基本原理

> 命令行其实就是一个方法，通过写dada init/config背后的逻辑，将对应的代码从git仓库拉下来而已，然后发布到npm上



### 具体操作

1. 初始化一个空项目,`npm init`

2. 安装以下插件

```javascript
babel-cli/babel-env: 语法转换
commander: 命令行工具
download-git-repo: 用来下载远程模板
ini: 格式转换
inquirer: 交互式命令行工具
ora: 显示loading动画
chalk: 修改控制台输出内容样式
log-symbols: 显示出 √ 或 × 等的图标
```

3. 配置 babel 转译

```javascript
{
    "presets": [
        [
            "env",
            {
                "targets": {
                    "node": "current"
                }
            }
        ]
    ]
}

```

4. 通过在 package.json 中定义命令，并`npm link`将命令关联全局

```javascript
{
    "bin":{
        "dada":"./bin/www"
    },
    "scripts": {
        "compile": "babel src -d dist",
        "watch": "npm run compile -- --watch"
    }
}
```

`npm link`

5. 在 www 文件中指定脚本由 node.js 解析

```javascript
#! /usr/bin/env node
require("../dist/main.js");
```

6. 处理命令行，其实就是通过书写命令背后的逻辑，从对应的 git 仓库下载代码

```javascript
let init = async (templateName, projectName) => {
  //项目不存在
  if (!fs.existsSync(projectName)) {
    //命令行交互
    inquirer
      .prompt([
        {
          name: "description",
          message: "Please enter the project description: "
        },
        {
          name: "author",
          message: "Please enter the author name: "
        }
      ])
      .then(async answer => {
        //下载模板 选择模板
        //通过配置文件，获取模板信息
        let loading = ora("downloading template ...");
        loading.start();
        // 从git下载，templateName为git仓库模版名
        downloadLocal(templateName, projectName).then(
          () => {
            loading.succeed();
            const fileName = `${projectName}/package.json`;
            if (fs.existsSync(fileName)) {
              const data = fs.readFileSync(fileName).toString();
              let json = JSON.parse(data);
              json.name = projectName;
              json.author = answer.author;
              json.description = answer.description;
              //修改项目文件夹中 package.json 文件
              fs.writeFileSync(
                fileName,
                JSON.stringify(json, null, "\t"),
                "utf-8"
              );
              console.log(
                symbol.success,
                chalk.green("Project initialization finished!")
              );
            }
          },
          () => {
            loading.fail();
          }
        );
      });
  } else {
    //项目已经存在
    console.log(symbol.error, chalk.red("The project already exists"));
  }
};
import downloadGit from "download-git-repo";
const downloadLocal = async (templateName, projectName) => {
  let config = await getAll();
  let api = `${config.registry}/${templateName}`;
  return new Promise((resolve, reject) => {
    downloadGit(api, projectName, err => {
      if (err) {
        reject(err);
      }
      resolve();
    });
  });
};
```

7. 发布到npm上

- 首先要npm login登录npm

- 执行npm publish发布脚手架

- 其他地方就可以使用了

