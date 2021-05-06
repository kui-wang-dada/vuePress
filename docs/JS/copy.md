# 浅拷贝和深拷贝

### 基础知识

数据分为基本数据类型(String, Number, Boolean, Null, Undefined，Symbol)和对象数据类型。

- 基本数据类型的特点：直接存储在栈(stack)中的数据
- 引用数据类型的特点：**存储的是该对象在栈中引用，真实的数据存放在堆内存里**

引用数据类型在栈中存储了指针，该指针指向堆中该实体的起始地址。当解释器寻找引用值时，会首先检索其在栈中的地址，取得地址后从堆中获得实体。

### 深浅拷贝的区别

深拷贝和浅拷贝的示意图大致如下：

**浅拷贝只复制指向某个对象的指针，而不复制对象本身，新旧对象还是共享同一块内存。但深拷贝会另外创造一个一模一样的对象，新对象跟原对象不共享内存，修改新对象不会改到原对象。**

### 浅拷贝的实现方式

#### 1、Object.assign()

`Object.assign()` 方法可以把任意多个的源对象自身的可枚举属性拷贝给目标对象，然后返回目标对象。但是 `Object.assign()` 进行的是浅拷贝，拷贝的是对象的属性的引用，而不是对象本身。

```
var obj = { a: {a: "kobe", b: 39} };
var initalObj = Object.assign({}, obj);
initalObj.a.a = "wade";
console.log(obj.a.a); //wade
```

>  **当object只有一层的时候，是深拷贝**

```javascript
let obj = {    username: 'kobe'    };
let obj2 = Object.assign({},obj);
obj2.username = 'wade';
console.log(obj);//{username: "kobe"}
```

#### 2、Array.prototype.concat()

```javascript
let arr = [1, 3, {    username: 'kobe'    }];
let arr2=arr.concat();    
arr2[2].username = 'wade';
console.log(arr);
```

修改新对象会改到原对象：

[图片上传失败...(image-797604-1547035617705)]

#### 3、Array.prototype.slice()

```javascript
let arr = [1, 3, {    username: ' kobe'    }];
let arr3 = arr.slice();
arr3[2].username = 'wade';
console.log(arr);
```

同样修改新对象会改到原对象：

![img](http://upload-images.jianshu.io/upload_images/9421914-4b55b536f4eddadd?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

**关于Array的slice和concat方法的补充说明**：Array的slice和concat方法不修改原数组，只会返回一个浅复制了原数组中的元素的一个新数组。

原数组的元素会按照下述规则拷贝：

- 如果该元素是个对象引用(不是实际的对象)，slice 会拷贝这个对象引用到新的数组里。两个对象引用都引用了同一个对象。如果被引用的对象发生改变，则新的和原来的数组中的这个元素也会发生改变。
- 对于字符串、数字及布尔值来说（不是 String、Number 或者 Boolean 对象），slice 会拷贝这些值到新的数组里。在别的数组里修改这些字符串或数字或是布尔值，将不会影响另一个数组。

可能这段话晦涩难懂，我们举个例子，将上面的例子小作修改：

```javascript
let arr = [1, 3, {    username: ' kobe'    }];
let arr3 = arr.slice();
arr3[1] = 2console.log(arr,arr3);
```

![img](http://upload-images.jianshu.io/upload_images/9421914-73e7ff78d73669d4?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

### 深拷贝的实现方式

#### 1、JSON.parse(JSON.stringify())

```javascript
let arr = [1, 3, {    username: ' kobe'}];
let arr4 = JSON.parse(JSON.stringify(arr));
arr4[2].username = 'duncan'; 
console.log(arr, arr4)
```

![img](http://upload-images.jianshu.io/upload_images/9421914-b881bb4f7e6d08e9?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

原理： 用JSON.stringify将对象转成JSON字符串，再用JSON.parse()把字符串解析成对象，一去一来，新的对象产生了，而且对象会开辟新的栈，实现深拷贝。

>  **这种方法虽然可以实现数组或对象深拷贝，但不能处理函数。**

```javascript
let arr = [1, 3, {    username: ' kobe'},function(){}];
let arr4 = JSON.parse(JSON.stringify(arr));
arr4[2].username = 'duncan'; 
console.log(arr, arr4)
```

![img](http://upload-images.jianshu.io/upload_images/9421914-76bab62f7401225d?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

这是因为 `JSON.stringify()` 方法是将一个JavaScript值(对象或者数组)转换为一个 JSON字符串，不能接受函数。

#### 2、手写递归方法

递归方法实现深度克隆原理：**遍历对象、数组直到里边都是基本数据类型，然后再去复制，就是深度拷贝。**

```javascript
    //定义检测数据类型的功能函数    
    function checkedType(target) {      return Object.prototype.toString.call(target).slice(8, -1)    }    
//实现深度克隆---对象/数组    
function clone(target) {      
    //判断拷贝的数据类型      
    //初始化变量result 成为最终克隆的数据      
    let result, targetType = checkedType(target)      
    if (targetType === 'object') {        
        result = {}      
    } 
    else if (targetType === 'Array') {        
        result = []      
    } 
    else {        
        return target      
    }      //遍历目标数据      
    for (let i in target) {        
        //获取遍历数据结构的每一项值。        
        let value = target[i]        
        //判断目标结构里的每一值是否存在对象/数组        
        if (checkedType(value) === 'Object' || checkedType(value) === 'Array') { 
            //对象/数组里嵌套了对象/数组          
            //继续遍历获取到value值          
            result[i] = clone(value)        
        } else { 
            //获取到value值是基本的数据类型或者是函数。          
            result[i] = value;        
        }      
    }      
    return result    
}
```

#### 3、函数库lodash

该函数库也有提供 `_.cloneDeep` 用来做 Deep Copy。

```javascript
var _ = require('lodash');
var obj1 = {    
    a: 1,    
    b: { f: { g: 1 } },    
    c: [1, 2, 3]
};
var obj2 = _.cloneDeep(obj1);
console.log(obj1.b.f === obj2.b.f);// false
```