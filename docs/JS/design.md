# 设计模式：把不变的事物和变化的事物分离开来

## 单例模式

保证一个类只有一个实例，并提供一个访问它的全局访问点

用一个变量来标志当前是否已经为某个类创建过对象，如果是，则在下一次获取该类的实例时，直接返回之前创建的对象。

javascript中的单例模式

建一个全局变量，就是单例

确保只有一个实例，并提供全局访问

```javascript
var a ={}
```

缺点

命名空间污染

使用 命名空间

```javascript
var namespace={
    a:function(){alert(1)}
    b:function(){alert(2)}
}
```

使用闭包封装私有变量

```javascript
//自执行函数
//返回一个对象，对象的属性为一个方法

var user = (function(){
    var _name = 'wang'
    var _age = 12
    return {
        getUserInfo:function(){
            return _name+_age
        }
    }
})
```

## 策略模式

定义一系列的算法，吧他们各自封装成策略类，算法被封装在策略类内部的方法里。在客户对Context发起请求的时候，Context总是把请求委托给这些策略对象中间的某一个进行计算

eg

```javascript
var calcu = function(level,salary){
    if(level==='s'){
        return salary*4
    }
    if(level==='A'){
        return salary*3
    }
    if(level==='B'){
        return salary*2
    }
}
calcu('B',20000)
```

优缺点：

- 代码简单
- calcu函数庞大，包含很多if-else语句，这些语句需要覆盖所有的逻辑分支
- 函数缺乏弹性，违反开放-封闭原则
- 复用性差

```javascript
//定义策略类
var strategies={
    "S":(salary)=>{return salary*4},
    "A":(salary)=>{return salary*3},
    "B":(salary)=>{return salary*2},
}
//请求转接
var calcu=(level,salary)=>{
    return strategies[level](salary)
}
```

- 跟计算奖金有关的逻辑不再放在Context中，而是分布在各个策略对象中
- Context并没有计算奖金的能力，而是把这个职责委托给某个策略对象
- 每个策略对象负责的算法已被各自封装在对象内部

经典用法：使用策略模式实现缓动动画，表单

简单来说：策略模式指的是定义一系列的算法，并且把他们封装起来

## 代理模式

为一个对象提供一个代用品或占位符，以便控制对他的访问

客户——代理（走一些处理）——本体

##### 保护代理：

用于控制不同权限的对象对目标对象的访问

##### 虚拟代理：

把一些开销很大的对象，延迟到真正需要他的时候采取创建（常用）

eg：虚拟代理实现图片预加载

 ```javascript
var myImage=(function(){
    var imgNode=document.createElement('img')
    document.body.appendChild(imgNode)
    return {
        setSrc:function(src){
            imgNode.src=src
        }
    }
    
})

var proxyImage=(function(){
    var img = new Image
    img.onload=function(){
        myImage.setSrc(this.src)
    }
    return {
        setSrc:function(src){
            myImage.setSrc('file:// /C:loading.gif');
            img.src=src
        }
    }
})
proxyImage.setSrc('http://img.jpg')
 ```

##### 缓存代理：

为一些开销大的运算结果提供暂时的存储，在下次运算时，如果传递进来的参数跟之前一致，则可以直接返回前面存储的运算结果

eg：计算乘积

```javascript
//计算乘积的函数
var mult = function(){
    console.log("开始计算乘积")
    var a =1 
    for(var i=0,l=arguments.length;i<l;i++){
        a=a*arguments[i]
    }
    return a
}
//缓存函数
var proxyMult = (function(){
    var cache={}
    return function(){
        var args=Array.prototype.join.call(arguments,',')
        if(args in cache){
            return cache[args]
        }
        return cache[args]=mult.apply(this,arguments)
    }
})
proxyMult(1,2)
proxyMult(1,2)
```

当第二次调用proxyMult(1,2)的时候，本体mult函数并没有被计算，proxyMult直接返回了之前缓存好的计算结果。

缓存代理用于ajax异步请求数据

项目中的分页需求，同一页的数据理论上只需要去后台拉取一次，这些已经拉取到的数据在某个地方被缓存之后，下次再请求同一页的时候，便可以直接使用之前的数据。

##### 高阶函数动态创建代理

eg：缓存代理为例

```javascript
var createProxyFactory=function(fn){
    var cache={}
    return function(){
        var args=Array.prototype.join.call(arguments,',')
        if(args in cache){
            return cache[args]
        }
        return cache[args]=fn.apply(this,arguments)
    }
}
```



## 迭代器模式

是指提供一种方法顺序访问一个聚合对象中的各个元素，而又不需要暴露该对象的内部表示。

javascript中的forEach函数

链接：https://pan.baidu.com/s/15DPohg1aYKE4v7jzUcTYRA 
提取码：zw4r 

## 发布订阅模式-观察者模式

一对多的依赖关系，当一个对象的状态发生改变时，所有依赖于它的对象都将得到通知

1. 首先要指定好谁充当发布者
2. 然后给发布者添加一个缓存列表，用于存放回调函数以便通知订阅者
3. 最后发布消息的时候，发布者会遍历这个缓存列表，依次触发里面存放的订阅者回调函数

eg：售楼部

```javascript
var event={
    //缓存列表，存放订阅者的回调函数
    clientList:[],
    listen:function(key,fn){
        //如果还没有订阅过此类消息，给该类消息创建一个缓存列表
        if(!this.clientList[key]){
            this.clientList[key]=[]
        }
        //订阅的消息添加进消息缓存列表
        this.clientList[key].push(fn)
    },
    //发布消息
    trigger:function(){
        //取出消息类型
        var key = Array.prototype.shift.call(arguments)
        //取出该消息对应的回调函数集合
        var fns = this.clientList[key]
        //如果没有订阅该消息，则返回
        if(!fns||fns.length===0){
            return false
        }
        
        for(var i = 0,fn;fn=fns[i++]){
            fn.apply(this,arguments);
        }
    },
    remove:function(key,fn){
        var fns = this.clientList[key]
        if(！fns){
            return false
        }
        if(!fn){
            fns&&(fns.length=0)
        }else{
            for(var l=fns.length-1;l>=0;l--){
                var _fn=fns[l]
                if(_fn===fn){
                    fns.splice(l,1)
                }
            }
        }
    }
}
var installEvent=function(obj){
    for(var i in event){
        obj[i]=event[i]
    }
}


```

- 时间上的解耦
- 对象之间的解耦
- 消耗内存
- 若过度使用，如多个发布者和订阅者嵌套到一起的时候，难以追踪



## 命令模式

有时候需要向某些对象发送请求，但是并不知道请求的接收者是谁，也不知道被请求的操作是什么。此时希望用一种松耦合的方式来设计程序，使得请求发送者和请求接收者能够消除彼此之间的耦合关系。

eg：订餐

命令模式把客人订餐的请求封装成command对象，也就是订餐中的订单对象，这个对象可以在程序中被四处传递，就像订单可以从服务员手中传到厨师的手中。这样一来，客人不需要知道厨师的名字，从而解开了请求调用者和请求接收者之间的耦合关系。

命令模式在JavaScript语言中是一种隐形的模式