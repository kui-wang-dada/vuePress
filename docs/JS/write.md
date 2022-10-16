## 手写代码系列

### 手写一个 promise

> promise 实现回调函数的延时绑定和返回值穿透

注意点：

**回调函数的延时绑定，确保当 promise 包裹一个同步代码时，先绑定**

**添加 then 和 catch 属性，将返回值穿透出去**

eg：极简版

```javascript
// 简单版
function MyPromise(excute) {
  var _onResolve = null;
  var _onReject = null;
  this.then = function (onResolve) {
    _onResolve = onResolve;
  };
  this.catch = function (onReject) {
    _onReject = onReject;
  };
  function resolve(value) {
    //   确保then方法把回调函数绑定到了_onResolve
    setTimeout(() => {
      _onResolve(value);
    }, 0);
  }
  function reject(err) {
    setTimeout(() => {
      _onReject(err);
    });
  }
  excute(resolve, reject);
}

let a = new MyPromise((resolve, reject) => {
  resolve(100);
});

a.then((value) => {
  console.log(value);
});
```

以上代码基本代表了 promise 的原理

- excute 函数在 new 的时候执行
- then 为同步代码，new 后执行

eg2:

- 加入状态处理
- 将 then 提取到原型
- 收集 pending 时的多种回调，如多个 then

```javascript
// 加入状态处理,将then提取到原型
function MyPromise(excute) {
  let self = this;
  self.status = "pending";
  self.value = undefined;
  self.reason = undefined;
  self.resolvedCallbacks = [];
  self.rejectedCallbacks = [];
  function resolve(value) {
    setTimeout(() => {
      if (self.status === "pending") {
        self.value = value;
        self.status = "resolved";
        self.resolvedCallbacks.forEach((cb) => cb(self.value));
      }
    }, 0);
  }
  function reject(reason) {
    setTimeout(() => {
      if (self.status === "pending") {
        self.reason = reason;
        self.status = "rejected";
        self.rejectedCallbacks.forEach((cb) => cb(self.value));
      }
    }, 0);
  }
  try {
    excute(resolve, reject);
  } catch (err) {
    reject(e);
  }
}

MyPromise.prototype.then = function (onResolve, onReject) {
  const self = this;
  let newPromise;
  switch (self.status) {
    case "resolved":
      onResolve(self.value);
      break;
    case "rejected":
      onReject(self.reason);
      break;
    case "pending":
      self.resolvedCallbacks.push(onResolve);
      self.rejectedCallbacks.push(onReject);
      break;
  }
};

let a = new MyPromise((resolve, reject) => {
  resolve(1);
});
// 当存在多个时，全都收集起来
a.then((v) => console.log(v));
a.then((v) => console.log(v));
a.then((v) => console.log(v));
```

### 手写 call,apply

> 关键点是如何转移 this

我们知道，this 一般有全局和对象中，改变调用关系，即可转移 this
call 和 apply 实现原理差不多，仅处理参数逻辑不一样

```javascript
Function.prototype.myCall = function (context) {
  // 首先判断异常
  if (typeof this !== "function") {
    throw new TypeError("Error");
  }
  // 处理参数
  var args = [...arguments].slice(1);
  //   将调用的函数作为绑定对象的一个属性
  context.fn = this;

  var result = context.fn(...args);
  delete context.fn;
  return result;
};

Function.prototype.myApply = function (context) {
  // 首先判断异常
  if (typeof this !== "function") {
    throw new TypeError("Error");
  }
  context.fn = this;

  let result;

  //   判断是否有第二个参数
  if (arguments[1]) {
    result = context.fn(...arguments[1]);
  } else {
    result = context.fn();
  }
  delete context.fn;

  return result;
};
```

### 手写 bind 函数

bind 返回的是一个函数

```javascript
Function.prototype.myBind = function (context) {
  if (typeof this !== "function") {
    throw new TypeError("Error");
  }

  const _this = this;

  const args = [...arguments].slice(1);

  return function () {
    return _this.apply(context, [...args, ...arguments]);
  };
};
```

### 手写一个观察者

> 观察者没有调度中心，发布者和订阅者直接通信

```javascript
class Publisher {
  constructor() {
    this.subs = [];
  }
  add(sub) {
    this.subs.push(sub);
  }
  remove(sub) {
    this.subs.forEach((item, i) => {
      if (item === sub) {
        this.subs.splice(i, 1);
      }
    });
  }
  notify() {
    this.subs.forEach((sub) => {
      sub.update();
    });
  }
}

class Observe {
  constructor() {}
  update() {}
}
```

### 手写 vue 发布订阅模式

> vue 的发布订阅关键就是 dep 中设置全局属性 target，以此收集依赖

先写一个发布者，vue 中是对数据的劫持，defineProperty 的 get 时调度中心收集依赖，set 时发送通知

```javascript
function observe(obj) {
  if (!obj || typeof obj !== "object") {
    return;
  }
  Object.keys(obj).forEach(key => {
    defineReactive(obj, key, obj[key]);
  });
}

function defineReactive(obj, key, val) {
  let dep=new Dep()

  observe(val);

  Object.defineProperty(obj,key,{
    get:function(){
      if(Dep.target){
         dep.addSub(Dep.target)
      }

      return val
    }
    set:function(newVal){
      dep.notify()
      val=newVal
    }
  })
}
```

在写一个调度中心,主要指责是收集依赖和分发通知，所以必然有 add 和 notify 两个方法

```javascript
class Dep {
  constructor() {
    this.subs = [];
  }
  addSub(sub) {
    this.subs.push(sub);
  }
  notify(sub) {
    this.subs.forEach((sub) => {
      sub.update();
    });
  }
}
Dep.target = null;
```

实现一个订阅者

```javascript
class Watch {
  constructor(obj, key, cb) {
    Dep.target = this;
    this.obj = obj;
    this.key = key;
    this.cb = cb;
    this.val = obj[key];
    Dep.target = null;
  }
  update() {
    this.val = this.obj[this.key];
    this.cb(this.val);
  }
}
```

手写一个 eventbus

> vue 由于 data 数据的复杂性，需要递归监听每一个属性，因此有 observe，watch 类；而 eventbus 只需要实现调度中心，然后 emit 和 on 来执行就行了，订阅者其实是一堆存储的回调方法，而发布者其实就是 emit，发个通知，全局执行

```javascript
class EventEmitter {
  constructor() {
    this.handlers = {};
  }

  on(eventName, cb) {
    if (!this.handlers[eventName]) {
      this.handlers[eventName] = [];
    }
    this.handlers[eventName].push(cb);
  }

  emit(eventName, ...args) {
    if (this.handlers[eventName]) {
      this.handlers[eventName].forEach((cb) => {
        cb(...args);
      });
    }
  }
  // 移除某个事件回调队列里的指定回调函数
  off(eventName, cb) {
    const callbacks = this.handlers[eventName];
    const index = callbacks.indexOf(cb);
    if (index !== -1) {
      // 浅拷贝
      callbacks.splice(index, 1);
    }
  }
  // 为事件注册单次监听器
  once(eventName, cb) {
    const Wrapper = (...args) => {
      cb.apply(...args);
      this.off(eventName, cb);
    };
    this.on(eventName, wrapper);
  }
}
```

```javascript

function observe(obj){
  if(typeof obj!=='object'){
    return
  }
  Object.keys(obj).forEach(key=>{
    defineReactive(obj,key,obj[key])
  })
}
function defineReactive(obj,key,val){
  let dep = new Dep()
  observe(val)
  Object.defineProperty(obj,key,{
    get:function(val){
      if(Dep.target){
        dep.addSub(Dep.target)
      }
      return val
    }
    set:function(newV){
      dep.notify()
      val=newV
    }
  })
}
class Dep{
  constructor(){
    this.subs=[]
  }
  addSub(sub){
    this.subs.push(sub)
  }
  notify(){
    this.subs.forEach(sub=>sub.update())
  }
}

class Watcher{
  constructor(obj,key,cb){
    Dep.target=this
    this.obj=obj
    this.key=key
    this.val=obj[key]
    this.cb=cb
    Dep.target=null
  }
  update(){
    this.val=this.obj[this.key]
    this.cb(this.val)
  }
}
```
