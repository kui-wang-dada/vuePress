# vuex 深入

## 什么是 vuex

> 借鉴了 flux,redux 的思想，把组件的共享状态抽取出来，用一个全局单例模式管理

#### vuex 整个过程

1. state 中的状态数据被组件挂在使用，此时该状态类似与组件中 data 里的数据
2. 组件在交互过程中，需要改变状态，只能通过触发 actions 或者 mutations，actions 的本质也是封装逻辑，触发 mutations
3. 触发 mutations，改变了全局中的 state
4. 引用该 state 的组件节点都会重新渲染新值
   注意：state 只会被 mutations 改变。

## vuex 的核心概念

### state

> 通过在 vue 根实例中注册 store 选项，该 store 实例会注入到根组件下的所有子组件中，且子组件通过`this.$store.state`访问到

- 组件中一般在计算属性中返回某个 state

eg：根实例中注入 store 选项

```javascript
new Vue({
  el: "#app",
  //将store实例注入到vue根实例中
  store,
  router,
  components: { App },
  template: "<App/>"
});
```

##### 使用 mapState

- 直接使用 state 时可使用箭头函数或者字符串
- 若需要用到组件内状态进行拼接时使用常规函数
  eg:

```javascript
// 在单独构建的版本中辅助函数为 Vuex.mapState
import { mapState } from "vuex";

export default {
  // ...
  computed: mapState({
    // 箭头函数可使代码更简练
    count: state => state.count,

    // 传字符串参数 'count' 等同于 `state => state.count`
    countAlias: "count",

    // 为了能够使用 `this` 获取局部状态，必须使用常规函数
    countPlusLocalState(state) {
      return state.count + this.localCount;
    }
  })
};
```

- 有了对象展开后，通常使用以下方式

```javascript
computed: {
  localComputed () { /* ... */ },
  // 使用对象展开运算符将此对象混入到外部对象中
  ...mapState({
    // ...
  })
}
```

### getters

> 有些时候，vuex 的 state 中存入的数据或者状态并不能直接被组件使用，此时可以用 getters 转换以下

- getters 可以认为是 store 的计算属性，根据依赖变化，并有缓存
- getters 会暴露为 store.getters 对象，组件中可以通过`this.$store.getters`访问
- getters 具体 getter 的第一个参数为 state，第二个参数为 getters
- 可以通过方法访问，来给 getter 传参数

```javascript
const store = new Vuex.Store({
  state: {
    todos: [
      { id: 1, text: '...', done: true },
      { id: 2, text: '...', done: false }
    ]
  },
  getters: {
    //第一个参数为state，第二个参数为getters
    doneTodosCount: (state, getters) => {
      return getters.doneTodos.length
    }
    //通过方法访问，传入参数
    getTodoById: (state) => (id) => {
      return state.todos.find(todo => todo.id === id)
    }
  }
})

store.getters.getTodoById(2) //通过方法访问
```

#### mapGetters 辅助函数

- 将 store 中的 getters 映射到局部计算属性，和 mapState 一样
- 可以使用对象展开符，也可以使用对象形式给 getter 换一个名字

```javascript
import { mapGetters } from 'vuex'

export default {
  // ...
  computed: {
  // 使用对象展开运算符将 getter 混入 computed 对象中
    ...mapGetters([
      'doneTodosCount',
      'anotherGetter',
      // ...
    ])
    mapGetters({
      // 把 `this.doneCount` 映射为 `this.$store.getters.doneTodosCount`
      doneCount: 'doneTodosCount'
    })
  }
}
```

### mutations

> 更改 state 的唯一方式就是提交 mutations

- 每一个 mutations 都有一个字符串的事件类型和一个回调函数，这个回调函数就是我们改变状态的地方
- 不能直接调用一个 mutations,只能通过相应的 type，使用`this.$store.commit([type])`唤醒 mutations
- mutations 第一个参数为 state，第二个参数为组件传入的参数
- mutations 需遵循 vue 的响应规则
  1. 提前在你的 store 中初始化所有所需属性
  2. 给对象增添属性时使用`vue.set(obj,'newProp','12')`
  3. 以新对象替换老对象，如`state.obj = { ...state.obj, newProp: 123 }`
- 可以使用常量替代 mutations 事件类型，新建一个 mutation-type 来管理这些常量
- mutations 必须是同步函数
- 在组件中使用 mutations
  1. 可以使用`this.$store.commit([type])`
  2. 使用 mapMutation 辅助函数将组件中的 methods 映射为 store.commit 调用

```javascript
import { mapMutations } from "vuex";

export default {
  // ...
  methods: {
    ...mapMutations([
      "increment", // 将 `this.increment()` 映射为 `this.$store.commit('increment')`

      // `mapMutations` 也支持载荷：
      "incrementBy" // 将 `this.incrementBy(amount)` 映射为 `this.$store.commit('incrementBy', amount)`
    ]),
    ...mapMutations({
      add: "increment" // 将 `this.add()` 映射为 `this.$store.commit('increment')`
    })
  }
};
```

### Action

- action 提交的是 mutations，而不是直接改变状态
- action 可以包含任意异步操作或复杂逻辑
- action 方法接受一个和 store 有相同属性和方法的 context 对象，可以调用
  context.commit,context.state,context.getters
  ```javascript
    actions: {
      //通常使用参数解构来简化代码
      increment ({ commit,state,getters }) {
        commit('increment')
      }
    }
  ```
- action 通过`store.dispach`触发，同样支持传入参数或对象
- 同样，也可以使用 mapActions 将组件的 methods 映射为 store.dispatch 进行调用

```javascript
import { mapActions } from "vuex";

export default {
  // ...
  methods: {
    ...mapActions([
      "increment", // 将 `this.increment()` 映射为 `this.$store.dispatch('increment')`

      // `mapActions` 也支持载荷：
      "incrementBy" // 将 `this.incrementBy(amount)` 映射为 `this.$store.dispatch('incrementBy', amount)`
    ]),
    ...mapActions({
      add: "increment" // 将 `this.add()` 映射为 `this.$store.dispatch('increment')`
    })
  }
};
```

### Module

> 由于使用单一状态树，应用的所有状态会集中到一个比较大的对象。当应用变得非常复杂时，store 对象就有可能变得相当臃肿。Vuex 允许我们将 store 分割成模块（module）。每个模块拥有自己的 state、mutation、action、getter、甚至是嵌套子模块——从上至下进行同样方式的分割

```javascript
const moduleA = {
  state: { ... },
  mutations: { ... },
  actions: { ... },
  getters: { ... }
}

const moduleB = {
  state: { ... },
  mutations: { ... },
  actions: { ... }
}

const store = new Vuex.Store({
  modules: {
    a: moduleA,
    b: moduleB
  }
})

store.state.a // -> moduleA 的状态
store.state.b // -> moduleB 的状态
```
