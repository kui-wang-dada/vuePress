# koa2+sequelize 初探

# 项目结构

1. controllers：请求后的事件
2. mdel：sequelize 数据模型
3. routes：路由分发
4. views：使用 ejs 模板引擎
5. app.js：项目入口
6. config.js：配置文件

# sequelize

## 入口

```javascript
const Sequelize = require("sequelize");
const config = require("../config");
exports.sequelize = function() {
  return new Sequelize(
    config.mysql.database,
    config.mysql.username,
    config.mysql.password,
    {
      dialect: "mysql", // 数据库使用mysql
      host: config.mysql.host, // 数据库服务器ip
      port: config.mysql.port, // 数据库运行端口
      timestamp: true, // 这个参数为true是MySQL会自动给每条数据添加createdAt和updateAt字段
      quoteIdentifiers: true
    }
  );
};
```

## 定义数据模型

```javascript
module.exports = function(sequelize, DataTypes) {
  return sequelize.define("student", {
    sid: {
      type: DataTypes.STRING(50),
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING(100)
    }
  });
};
```

## 确定关联

```javascript
const db = require("./db").sequelize();
let student = db.import("./student");
let course = db.import("./course");

// 同步模型到数据库中
//多对多模型通过中间表方式简历联系
course.belongsToMany(student, {
  through: "courseToStudent",
  foreignKey: "sid"
});
student.belongsToMany(course, {
  through: "courseToStudent",
  foreignKey: "cid"
});
```

## 创建初始数据

```javascript
db.sync({
  alter: true
}).then(function(result) {
  (async () => {
    let aa = await student.create({
      sid: "s-" + new Date(),
      name: "王哒四号",
      age: "17",
      sex: "男"
    });
    let bb = await course.create({
      cid: "1104",
      name: "化学"
    });
    bb.addStudent(aa); //建立联系
  })();
});
```

## 多表操作

### 查询

```javascript
let aa = await student.findAll({
  include: {
    model: course //关联数据默认放到courses中
  }
});
```

### 创建

```javascript
let aa = await student.create({
  sid: query.sid,
  name: query.name,
  age: query.age,
  sex: query.sex
});
```

### 更新

```javascript
//先更新主表非关联部分
let cc = await student.update(
  {
    name: query.name,
    age: query.age,
    sex: query.sex
  },
  {
    where: {
      sid
    }
  }
);
//拿到当前需要改的学生
let dd = await student.findOne({
  where: {
    sid
  }
});
//通过参数获得当前学生需要更改的课程
let ee = query.courses;
//将所有课程找到并推入到ff
let ff = [];
for (let i = 0; i < ee.length; i++) {
  let bb = await course.findOne({
    where: {
      cid: ee[i]
    }
  });
  ff.push(bb);
}
//更改当前学生的课程关联
dd.setCourses(ff);
```

### 删除

```javascript
let aa = await student.destroy({
  where: {
    sid
  }
});
```

# koa2

## 监听端口

```javascript
const Koa = require("koa");
const app = new Koa();
const config = require("./config");

app.listen(config.port, function listening() {
  console.log("服务器启动成功！端口：", config.port);
});
```

## 引入模板引擎

```javascript
const views = require("koa-views");
app.use(
  views(__dirname + "/views", {
    extension: "ejs"
  })
);
```

## 路由分发

### 1. 引入

```javascript
const router = require("./routes");
app.use(router.routes()).use(router.allowedMethods());
```

## 2. 具体操作

```javascript
router.get("/", async ctx => {
  try {
    //查询数据库，拿到数据，返回给前端
    let aa = await student.findAll({
      include: {
        model: course
      }
    });
    // ctx.body = aa
    await ctx.render("index", {
      students: aa
    });
  } catch (e) {
    return (ctx.body = {
      msg: "获取信息失败",
      ab: e,
      code: -1
    });
  }
});
```
