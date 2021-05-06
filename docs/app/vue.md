# Vue 学习笔记

## Vue 基础

### Vue 基本概念

> vue 是一个 mvvm 框架，通过双向绑定的方式将 dom 和数据一一对应起来，让用户仅需处理数据逻辑，解放 dom 操作，优化性能

1. 声明式渲染 通过{{message}}将 data 中的数据和 dom 挂钩
2. 条件与循环
   - v-if ：当前节点不渲染，性能提升
   - v-show ：节点渲染，但类似与添加了 display:none;
   - v-for ：循环语句，用法：v-for=(item,index) in somes
3. 数据相关
   - v-model ：将 input 框的 value 和 change 事件合成为一个指令，达到双向绑定的效果
   - v-bind ：绑定属性 缩写为：
   - v-on ：绑定方法 缩写为@
4. Vue 实例
   - el：实例挂在的 dom 节点
   - components：引入的外部组件
   - props：父组件传入的属性
   - data：需要双向绑定的值，改变即需渲染页面节点，若数据不需要重新渲染节点，不要放在这里面
   - computed：计算属性，根据某依赖值动态转换的值，有缓存，仅会根据依赖值变化而变化
   - watch：侦听属性，对某一个属性或状态进行侦听，改变时处理对应逻辑
   - methods：实例自身的一些方法
5. 事件相关
   - 事件绑定：v-on 或@；可直接在内联处理器中绑定方法或者调用方法
   - 事件修饰符：
     stop(阻止事件继续传播)，prevent(阻止默认事件)，
     capture(使用捕获模式)，self(事件到自身时才调用)，
     once(仅触发一次)，passive(不阻止浏览器默认行为)
   - 按键修饰符：
     enter,tab,delete,esc,space,up,down,left,right
   - 系统修饰符：
     ctrl,alt,shift,meta
6. 生命周期

   - create：创建 vue 实例，初始化实例数据，生成虚拟 dom
   - mounted：将虚拟 dom 挂在到页面上，渲染页面
   - update：更新 data 里面的数据时，引发重新渲染页面的操作
   - destroyed：销毁实例时的回调，一般用来注销一些监听事件

### Vue 简单原理

> 在 create 阶段通过 Object.definePorperty 的 get 和 set 方法对拿数据和改数据添加逻辑，在通过观察者模式给每一个数据配置一个调度中心，页面 mounted 时，将对应的 dom 节点推入对应数据的调度中心去，以此来实现双向绑定。

eg：简单代码原理

```javascript
var data = { name: "yck" };
observe(data);
let name = data.name; // -> get value
data.name = "yyy"; // -> change value

function observe(obj) {
  // 判断类型
  if (!obj || typeof obj !== "object") {
    return;
  }
  Object.keys(obj).forEach(key => {
    defineReactive(obj, key, obj[key]);
  });
}

function defineReactive(obj, key, val) {
  // 递归子属性
  observe(val);
  let dp = new Dep();
  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get: function reactiveGetter() {
      console.log("get value");
      // 将 Watcher 添加到订阅
      if (Dep.target) {
        dp.addSub(Dep.target);
      }
      return val;
    },
    set: function reactiveSetter(newVal) {
      console.log("change value");
      val = newVal;
      // 执行 watcher 的 update 方法
      dp.notify();
    }
  });
}
```

```javascript
// 通过 Dep 解耦属性的依赖和更新操作
class Dep {
  constructor() {
    this.subs = [];
  }
  // 添加依赖
  addSub(sub) {
    this.subs.push(sub);
  }
  // 更新
  notify() {
    this.subs.forEach(sub => {
      sub.update();
    });
  }
}
// 全局属性，通过该属性配置 Watcher
Dep.target = null;
```

```javascript
class Watcher {
  constructor(obj, key, cb) {
    // 将 Dep.target 指向自己
    // 然后触发属性的 getter 添加监听
    // 最后将 Dep.target 置空
    Dep.target = this;
    this.cb = cb;
    this.obj = obj;
    this.key = key;
    this.value = obj[key];
    Dep.target = null;
  }
  update() {
    // 获得新值
    this.value = this.obj[this.key];
    // 调用 update 方法更新 Dom
    this.cb(this.value);
  }
}
```

### Vue 组件化

#### 1、组件通信

- 父子组件通信
  1. 父组件通过 props 传递属性给子组件，子组件通过\$emit 发送事件传递数据给父组件
  2. $parent或者$children 来访问组件实例中的数据和方法
  3. 通过 refs 拿到组件节点，在通过\$el 拿到组件实例中的数据和方法
- 兄弟组件通信
  1. 通过 this.$parent.$children，在 \$children 中可以通过组件 name 查询到需要的组件实例，然后进行通信
- 跨多层级组件通信
  1. 通过 provide/inject
     ```javascript
        // 父组件 A
        export default {
          provide: {
            data: 1
          }
        }
        // 子组件 B
        export default {
           inject: ['data'],
           mounted() {
         // 无论跨几层都能获得父组件的 data 属性
             console.log(this.data) // => 1
           }
        }
     ```
- 任意组件
  1. vuex
  2. eventbus

### Vue 规模化

#### vue-router

> 前端路由实现的本质就是监听 URL 的变化，然后匹配路由规则，显示相应的页面，并且无须刷新页面。目前前端使用的路由就只有两种实现方式，hash 模式和 history 模式

##### 1. hash 模式

www.test.com/#/ 就是 Hash URL，当 # 后面的哈希值发生变化时，可以通过 hashchange 事件来监听到 URL 的变化，从而进行跳转页面，并且无论哈希值如何变化，服务端接收到的 URL 请求永远是 www.test.com
hash 模式相对简单，并且兼容较好

##### 2. history 模式

History 模式是 HTML5 新推出的功能，主要使用 history.pushState 和 history.replaceState 改变 URL。

通过 History 模式改变 URL 同样不会引起页面的刷新，只会更新浏览器的历史记录

##### 两种模式的比较

- Hash 模式只可以更改 # 后面的内容，History 模式可以通过 API 设置任意的同源 URL
- History 模式可以通过 API 添加任意类型的数据到历史记录中，Hash 模式只能更改哈希值，也就是字符串
- Hash 模式无需后端配置，并且兼容性好。History 模式在用户手动输入地址或者刷新页面的时候会发起 URL 请求，后端需要配置 index.html 页面用于匹配不到静态资源的时候

##### 简单实现

```javascript
//书写路由的配置文件
const routerConfig=[
  {
    path: '/',
    name: 'Layout',
    component: require('common/layout/Layout.vue').default,
    redirect: 'homePage',
    children: [
      {
        path: 'homePage',
        name: 'homePage',
        component: require('homePage/HomePage.vue').default
      },
    ]
  }
]
//通过vue-router生成router实例
let router = new Router({
  ...ROUTER_DEFAULT_CONFIG,
  routes: routerConfig
});
new Vue({
  el: '#app',
  store,
  //将生成的实例router挂在到vue实例中去
  router,
  components: { App },
  template: '<App/>'
});
```

#### 状态管理 vuex

1. 生成 vuex 实例，并挂在到 vue 实例上
   > 通过 vuex 三方库生成实例，将 actions,getters,state,mutations 以及一些其他插件挂在 vuex 上

```javascript
new Vuex.Store({
  actions,
  getters,
  state,
  mutations,
  strict: debug,
  plugins: debug ? [createLogger()] : []
});
```

2. 其他的作用

- mutations：改变仓库数据唯一入口，通过 commit 触发，vuex 在 vue 组件中提供 mapMutations 方法
- state：状态仓库
- getters：拿到仓库中状态的方法，组件中可用 mapGetters 方法
- actions：封装一些复杂逻辑，如异步操作，多种 mutations

3. 具体写法

```javascript
//states
export const state = {
  singer: {},
}
//getters
export const singer = state => state.singer
//mutations
 [SET_SINGER](state, singer) {
    state.singer = singer
  },
//actions
export function selectPlay({
  commit,
  state
}, {
  //放入参数
}) {
 //处理逻辑
}
```
