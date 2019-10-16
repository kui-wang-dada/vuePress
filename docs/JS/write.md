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
  this.then = function(onResolve) {
    _onResolve = onResolve;
  };
  this.catch = function(onReject) {
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

a.then(value => {
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
        self.resolvedCallbacks.forEach(cb => cb(self.value));
      }
    }, 0);
  }
  function reject(reason) {
    setTimeout(() => {
      if (self.status === "pending") {
        self.reason = reason;
        self.status = "rejected";
        self.rejectedCallbacks.forEach(cb => cb(self.value));
      }
    }, 0);
  }
  try {
    excute(resolve, reject);
  } catch (err) {
    reject(e);
  }
}

MyPromise.prototype.then = function(onResolve, onReject) {
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
a.then(v => console.log(v));
a.then(v => console.log(v));
a.then(v => console.log(v));
```

### 手写 call,apply

> 关键点是如何转移 this

我们知道，this 一般有全局和对象中，改变调用关系，即可转移 this
call 和 apply 实现原理差不多，仅处理参数逻辑不一样

```javascript
Function.prototype.myCall = function(context) {
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

Function.prototype.myApply = function(context) {
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
Function.prototype.myBind = function(context) {
  if (typeof this !== "function") {
    throw new TypeError("Error");
  }

  const _this = this;

  const args = [...arguments].slice(1);

  return function() {
    return _this.apply(context, [...args, ...arguments]);
  };
};
```
