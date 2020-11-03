# vue 项目知识点

- 基本写法
- 生命周期函数
- 组件通信
- 路由设计
- 状态机 vuex 设计
- axios 封装
- 公共方法如过滤器，指令，混入等

## 基本写法

> 第一次接触 vue 时，安装好 node 环境，vuecli 脚手架，初始化一个项目，网上关于环境安装的教程很多，这里不做赘述，我们来看下 vue 的基本写法

```vue
<template>
  <div class="home">
    <a-carousel autoplay>
      <div v-for="(item, index) in myList" :key="{ index }">
        <h3>{{ item }}</h3>
      </div>
    </a-carousel>
    <div>
      <TopHeader></TopHeader>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import { TopHeader } from '@/components/index'

export default {
  name: 'Home',
  components: { TopHeader },
  props: {},
  data() {
    return {
      myList: [1, 2, 3, 4],
      conList: [
        {
          title: 'vue',
          list: [],
        },
      ],
    }
  },
  computed: {},
  watch: {},
  methods: {},
  created() {},
  mounted() {},
  updated() {},
  destroyed() {},
}
</script>

<style lang="less">
.home {
  width: 1200px;
  margin: 0 auto;
  .ant-carousel {
    margin-top: 30px;
    .slick-slide {
      text-align: center;
      height: 320px;
      line-height: 160px;
      background: #364d79;
      overflow: hidden;
    }
  }
}
</style>
```

一个 vue 组件完美的将 html,css,js 囊括其中

其中`<template>`包裹区域书写 html
`<script>` 包裹区域书写 js
`<style>`包裹区域书写 css

一个.vue 组件就是一段 html,css,js 的集合，包裹一段逻辑

项目的组合再也不是 html,css,js 零散的搭建

而是多段逻辑分门别类的堆砌

配合 v-if,v-for 等指令，{{}}双大括号的数据绑定

代码组织更加高效和直接

## 组件生命周期以及其他属性

> 熟悉一个 vue 组件各个属性的意义和用法，了解生命周期

```javascript
import { TopHeader } from '@/components/index'
export default {
  name: 'Home',
  components: { TopHeader },
  props: {},
  data() {
    return {
      title: 'vue',
      myList: [1, 2, 3, 4],
      conList: [
        {
          title: 'vue',
          list: [],
        },
      ],
    }
  },
  computed: {},
  watch: {},
  methods: {},
  beforeCreate() {},
  created() {},
  beforeMount() {},
  mounted() {},
  beforeUpdate() {},
  updated() {},
  beforeDestroy() {},
  destroyed() {},
}
```

### 属性

1. name：组件名，keep-alive 的 include 和 exclude 会用到
2. components：引入的组件需要在此处注册
3. props：父组件传入的值需要在此处注册
4. data：组件内部状态数据
5. computed：计算属性，随某一个值变化而变化，返回一个值
6. watch：监听某一个数据变化，处理一段逻辑
7. methods：组件方法

### 生命周期

#### 实例化期

> 其中 beforeCreate 和 created 中间会触发 render 函数，其中 beforeMount 和 mounted 中间会触发 render 函数，

1. beforeCreate：组件实例化之后，在实例初始化之后，数据观测 (data observer) 和 event/watcher 事件配置之前被调用，此时还无法使用 this.状态和方法
2. create：在这一步，实例已完成以下的配置：数据观测 (data observer)，属性和方法的运算，watch/event 事件回调。然而，挂载阶段还没开始，`$el` 属性目前不可见，此时可以调用 this.状态和方法。
3. beforeMount：在挂载开始之前被调用：相关的 render 函数首次被调用。\$el 属性已经可见，但还是原来的 DOM，并非是新创建的。此时页面的`{{title}}`输出还是`{{title}}`
4. mounted：`el `被新创建的 `vm.$el `替换，并挂载到实例上去之后调用该钩子。如果 root 实例挂载了一个文档内元素，当 `mounted `被调用时 `vm.$el` 也在文档内。此时的`{{title}}`已经变为 vue 了

#### 存在期

> Vue 需要改变数据才会触发组件重新渲染，才会触发上面的存在期钩子函数。其中 beforeUpdate 和 updated 中间会触发 render 函数。

1.  beforeUpdate：数据更新时，虚拟 dom 变化之前调用，这里适合在更新之前访问现有的 dom，比如手动移除已添加的事件监听器。不要在此函数中更改状态，会触发死循环
2.  updated：当这个钩子被调用时，组件 DOM 已经更新，所以你现在可以执行依赖于 DOM 的操作。然而在大多数情况下，你应该避免在此期间更改状态。如果要相应状态改变，通常最好使用计算属性或 watcher 取而代之。

#### 销毁期

1. beforeDestroy： 实例销毁之前调用，在这一步，实例仍然完全可用。一般在这里移除事件监听器、定时器等，避免内存泄漏
2. destroyed： Vue 实例销毁后调用。调用后，Vue 实例指示的所有东西都会解绑定，所有的事件监听器会被移除，所有的子实例也会被销毁。所以如果需要用到 Vue 实例指示的所用绑定的东西，需要在 beforeDestroy 中使用。这么说，destroyed 函数能做的事，在 beforeDestroy 也能做，所以没必要在 destroyed 函数中处理。

## 组件通信

组件通信一般分为以下几种情况：

- 父子组件通信
- 兄弟组件通信
- 跨多层级组件通信
- 任意组件

对于以上每种情况都有多种方式去实现，接下来就来学习下如何实现。

### 父子通信

父组件通过 `props` 传递数据给子组件，子组件通过 `emit` 发送事件传递数据给父组件，这两种方式是最常用的父子通信实现办法。

这种父子通信方式也就是典型的单向数据流，父组件通过 `props` 传递数据，子组件不能直接修改 `props`， 而是必须通过发送事件的方式告知父组件修改数据。

另外这两种方式还可以使用语法糖 `v-model` 来直接实现，因为 `v-model` 默认会解析成名为 `value` 的 `prop` 和名为 `input` 的事件。这种语法糖的方式是典型的双向绑定，常用于 UI 控件上，但是究其根本，还是通过事件的方法让父组件修改数据。

当然我们还可以通过访问 `$parent` 或者 `$children` 对象来访问组件实例中的方法和数据。

另外如果你使用 Vue 2.3 及以上版本的话还可以使用 `$listeners `和 `.sync` 这两个属性。

`$listeners` 属性会将父组件中的 (不含 `.native` 修饰器的) `v-on` 事件监听器传递给子组件，子组件可以通过访问 `$listeners `来自定义监听器。

`.sync` 属性是个语法糖，可以很简单的实现子组件与父组件通信

```html

<!--父组件中-->
<input :value.sync="value" />
<!--以上写法等同于-->
<input :value="value" @update:value="v => value = v"></comp>
<!--子组件中-->
<script>
  this.$emit('update:value', 1)
</script>

```

### 兄弟组件通信

对于这种情况可以通过查找父组件中的子组件实现，也就是 `this.$parent.$children`，在 `$children` 中可以通过组件 `name` 查询到需要的组件实例，然后进行通信。

### 跨多层次组件通信

对于这种情况可以使用 Vue 2.2 新增的 API `provide / inject`，虽然文档中不推荐直接使用在业务中，但是如果用得好的话还是很有用的。

假设有父组件 A，然后有一个跨多层级的子组件 B

```javascript
// 父组件 A
export default {
  provide: {
    data: 1,
  },
}
// 子组件 B
export default {
  inject: ['data'],
  mounted() {
    // 无论跨几层都能获得父组件的 data 属性
    console.log(this.data) // => 1
  },
}
```

### 任意组件

这种方式可以通过 Vuex 或者 Event Bus 解决，另外如果你不怕麻烦的话，可以使用这种方式解决上述所有的通信情况

## 路由设计

### 简单路由的实现

1. 安装 vue-router

```javascript
yarn add vue-router
```

2. 引入 vue-router

```javascript
import vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)
let router = new Router({
  routes: [
    {
      path: '/',
      name: 'Home',

      component: () => import('../views/Project.vue'),
    },
  ],
})
new Vue({
  router,
  render: (h) => h(app),
}).$mount('#app')
```

4. 在`App.vue`中利用`router-view`指定路由切换的位置

### 路由嵌套和参数传递

> 在创建路由表的时候，可以为每一个路由对象创建 children 属性，值为数组，在这个里面又可以配置一些路由对象来使用多级路由

```javascript
{
  path :"/list",
  component:()=>import("../views/List"),
  children:[
       // 二级路由前不需要加“/”
      {
        path: "audio",
        component: () => import("../views/Audio")
      },
      {
        path: "video",
        component: () => import("../views/Video")
      }
    ]
}

```

二级路由组件的切换位置依然由`router-view`指定

#### 参数传递

1. query 传参数

```html
<router-link :to="{ path:'/detail', query: { name: 'haha'} }"> 跳转</router-link>
```

```javascript
this.$router.push({ path: '/detail', query: { name: 'haha' } })
```

这种传参方式相当于 url 拼接参数，刷新时参数存在

```html
http://localhost:8080/#/detail?name=haha
```

2. params 传参数

```html
<router-link :to="{ name:'/detail', params: { name: 'haha'} }"> 跳转</router-link>
```

```javascript
this.$router.push({ name: '/detail', params: { name: 'haha' } })
```

这种传参方式 url 中没有参数，刷新时参数不存在，可能会报错。

#### 路由模式

1. hash
2. history

hash: 地址栏 URL 中的#符号，hash 虽然出现在 URL 中，但不会被包含在 HTTP 请求中，对后端完全没有影响，因此改变 hash 不会重新加载页面

history：如果 url 里不想出现丑陋的 hash（#），在 new VueRouter 时配置 mode 为 history，本质是 h5 的 history.pushState 更改 url，不会引起刷新。

但 history 模式，会出现 404 情况，需要后台配置。需要在服务端增加一个覆盖所有情况的候选资源：如果 url 匹配不到任何静态资源，则应该返回同一个 index.html 页面，这个页面就是你 app 依赖的页面。
