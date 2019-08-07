# Javascript——面向对象程序设计和继承

## 面向对象设计模式

#### 创建对象——单个对象

- 字符字变量
- new 操作符
- 使用create

```javascript
//字符自变量
var a ={
    name:"wang"
}
//使用new操作符,构造函数模式
var b = new Object()

//使用create
//创建一个具有指定原型且可选择性地包含指定属性的对象。
var c = Object.create(Object.prototype)
```



#### 创建对象——多个对象

##### 工厂模式

> 创建对象的过程用一个函数包裹起来——创建多个相似对象

```javascript
function createPerson(name,age){
    var o = new Object()
    o.name = name
    o.age = age
    o.sayName = function(){
        alert(this.name)
    }
    return o
}
var person1 = createPerson(wang,18)
```

优点：快速创建多个相似对象

缺点：就是普通对象，无法识别对象的类型

##### 构造函数模式

```javascript
function Person(name,age){
    this.name = name 
    this.age = age 
    this.sayName = ()=> {alert（this.name)}
}
var person1 = new Person(wang,18)
var person2 = new Person(li,12)


/instanceof:判断变量是否属于构造函数的实例


person1 instanceof(Person)   //true
person1 instanceof(Object)   //true

/constructor:指向实例的构造函数
person1.constructor      //Person
person2.constructor      //Person

Person.call(o)
```

优点：解决工厂模式缺点

1. constructor，工厂模式创造的对象的construct是object，构造函数创建的对象的construct是该构造函数
2. 将构造函数当做普通函数使用：这个时候的this指向了全局作用域

缺点：对象的属性和方法都是独一无二的，占内存。如sayname等方法功能完全一样，却在每个对象上实例化

##### 原型模式

> 每一个函数都有prototype，指向当前函数的原型对象

> 原型对象.constructor=当前函数

> 函数.prototype = 原型对象

```javascript
function Person(){
    //空函数
}
Person.prototype.name = wang
Person.prototype.age = 18
Person.prototype.sayName = () => {alert (this.name)}

var person1 = new Person()    
person1.sayName()    //wang

var person2 = new Person();
person2.sayName()    //wang

alert(person1.sayName == person2.sayName)    //true

person1.__proto__      //实例对象的构造函数的原型对象
```

缺点：所有的实例都共用相同的属性和方法，person1和person2互相影响

1. 删除属性：delete person1.name；仅能删除自由属性，无法删除原型属性

2. 同名屏蔽：普通属性和方法——原型对象的属性和方法

3. getPrototypeof——获得对象的原型

   ```javascript
   var proto = Object.getPrototypeOf(Person)   //proto就是Person的原型对象
   ```

4. hasOwnProperty——判断参数是否是对象上的自由属性

   ```javascript
   var obj = {
       name:wang,
       age:12
   }
   obj.hasOwnProperty("name")
   ```

5. for - in -——枚举对象上的所有属性（还会顺着原型链查找可枚举属性）

6. Object.keys(对象)——返回一个数组（所有属性的name）

7. Object.getOwnPropertyNames()——返回一个数组，由指定对象的所有自身属性的属性名

8. 自定义属性和方法都是可枚举的，Object的原型中所有方法不可枚举，constructor  es3可枚举，es5不可枚举

9. Person.prototype = {  }    将原型对象直接指向一个新对象，Person.prototype.constructor===Object，为了保险应该将Person.prototype.constructor=Person

   一般不建议如此做

   ```javascript
   //原型和实例的动态关系
   var friend = new Person()
   Person.prototype.sayHi = function(){
       alert("hi")
   }
   friend.sayHi()      //"hi"    运行时先看自由属性，再看原型对象上的属性
   
   function Person(){}
   var friend = new Person()    //此时已经定型，friend的只有sayHi的方法
   Person.prototype = {
       name:"wang"
       sayName:()=>alert(this.name)
   }
   friend.sayName() 	//error		此时friend指向的还是原来的原型对象
   ```


##### 组合模式

> 伪经典模式——构造函数+原型

```javascript
function Person(name,age){
    this.name = name 
    this.age = age
}


Person.prototype = {
    constructor : Person,
   	sayName : ()=>alert(this.name)
}

Person.prototype.sayName = ()=>alert(this.name)
```

重点

- 所有的函数上都有一个特殊的属性，prototype——原型对象，原型对象默认只有一个属性——constructor——指向构造函数
- __proto__对象构造函数的原型对象



## javascript的继承

js中从技术上来讲并不存在继承，js是一个面向过程的语言，并不存在类（class），但是可以通过一些特殊的手段模拟继承

继承——

eg-1：玛丽，基类：跑，跳，吃金币，踩怪物；吃了不同的蘑菇，可以发子弹或者变大，但跑，跳功能也有

eg-2：

```javascript
function Person(name,age){
    this.name = name
    this.age = age
}
function Student(name,age,schoolNumber){
    this.name = name 
    this.age = age
    this.schoolNumber
}
```



##### 原型链

> 本质是重写子类的原型对象

```javascript
function SuperPerson(name){
    this.name = name;
}
SuperPerson.prototype.getName = ()=>{
    return this.name
}
function Person(age){
    this.age = age
}

//继承   本质是重写子类的原型对象
Person.prototype = new SuperPerson("wang")   //将子类的原型对象 = 父类的一个实例

var person1 = new Person(12)
alert(person1.getName())    //wang


```

缺点：

1. 为子类添加原型方法时，必须写在继承之前
2. 无法实现多继承
3. 不同实例互相影响，如下代码——当属性在父类的原型对象上时，是共享的
4. 无法传递参数(最大的缺点)



```javascript
function SuperType(){
    this.colors = ["red"]
}
function SonType(){}

SonType.prototype = new SuperType()    //继承，原型对象 = 父类实例

var color1 = new SonType()

color1.colors.push("black")			//改变了原型对象，所有实例都会共享

var color2 = new SonType()

alert(color2.colors)		//接收了改变后的值
```

##### 借用构造函数

> 本质是父类的构造函数添加入子类中

优点：

1. 传递参数
2. 可实现多继承
3. 解决了共享问题

- ###### 传递参数

```javascript
function SuperPerson(name){
    this.name = name
}
function SonPerson(name,age){
    SuperPerson.call(this,name) 
    this.age = age
}

var person1 = new SonPerson("wang",12)
```

- ###### 互相不影响

```javascript
function SuperType(){
    this.colors = ['red']
}
function SonType(){
    SuperType.call(this)   //将父类的构造函数在子类中运行
}

var color1 = new SonType()
color1.colors.push("black")
var color2 = new SonType()
alert(color2.colors)       //'red'

```



缺点：

1. 方法都在构造函数中定义，都是独一无二的，函数无法复用
2. 创建的实例只是子类的实例，不是父类的实例
3. 只能继承构造函数中的属性和方法，不能继承原型上的属性和方法
4. 无法复用，创造出来的每一个对象的属性和方法都是独一无二的

##### 组合式继承

> 借用构造函数写属性,原型链写公共方法

```javascript
function Father(name){
    this.name = name     //构造函数写属性
}

Father.prototype.sayName = function(){
    alert(this.name)      //原型对象上写方法
}

function Son(name,age){
    SuperType.call(this,name)	 //继承父类构造函数中的属性
    this.age = age
}
Son.prototype = new Father()      //重写子类的原型对象
Son.prototype.constructor = Son   //将子类原型对象的构造函数指向子类本身

Son.prototype.sayAge = function(){    //再给子类原型对象添加事件
    alert(this.age)
}

var tt = new Son("wang",12)

```

优点：结合了前两种模式的优点，避免了其缺点，伪经典模式

缺点：

1. 父类的构造函数被调用两次，call/new 
2. 同名覆盖，属性在原型和实例上各占一份，占用多余内存

##### 原型式继承

```javascript
var a = {
    name:"wang"
}
var b = {
    age:12
}
b.__proto__ = a
//__proto__  在IE中支持不好



//创造一个跳板
function F(){}
F.prototype = a 
var c = new F()

//原型式继承
function object(o){
    function F(){}
    F.prototype = o
    return new F()
}

//写法二
Object.create(prototype, descriptors)  //es5
//创建一个空函数
//让空函数的protetype==继承的对象
//使用new 操作符
```

缺点：看起来不像继承

##### 寄生式继承

> 本质等同于原型式继承

##### 完美继承——组合寄生式继承

> 解决组合式继承的两个问题

```javascript
function Father(name){
    this.name = name
}
Father.prototype.sayName = function(){
    alert(this.name)
}
function Son(name,age){
    Father.call(this,name)        //父类构造函数仅运行了一次
    this.age = age
}

var p = Object.create(Father.prototype)
p.constructor = Son
//Son.prototype = new Father()
//Son.prototype.__proto__ = Father.prototype
Son.prototype = p
```



### ES6的class

```javascript
//父类
class Person {
    constructor(name) {
        this.name = name;
    }
    say () {
        console.log("say hi");
      
    }
};
//子类
class SMan extends Person {
    constructor (name, age) {     //指向构造函数本身
        super(name);				//先运行父类的构造函数	this.name=name
        this.age = age;
    }
    show () {
        console.log(this.age);
    }
}

var eg = new SMan("wang",12)
eg.show();
eg.say()
```

- 就是对组合继承的封装使用

## 其他

### new 操作符的四个步骤

- 创建一个对象
- 将构造函数的this指向新创建的对象
- 实行函数里的所有代码
- 将创建的对象返回

改完之后和工厂模式一样

区别点：

- 没有显示创建对象，没有显式的return
- 构造函数的第一个字母大写（约定俗成）
- con

### this的指向分类——都是指向对象

- 纯函数的调用——全局作用域（window）
- 作为对象的方法和属性调用——指向对象
- 作为构造函数调用——创建出来的新对象
- apply/call——强制指向一个对象

不确定this指向时，一般console.log(this)或打断点

### 深拷贝和浅拷贝——最简单的继承

> 继承就是把别人的属性拿过来，最简单的方法就是复制一份

JS五种基础类型，一种引用类型

##### 浅拷贝

遍历复制一份

##### 深拷贝

遍历递归复制一份

```javascript
//非拷贝
var a = {
    name:"wang"
}
var b = a

//浅拷贝
//此递归方法不包含数组对象
var a = { 
    a:1, 
    arr: [2,3] 
}
var b = shallowCopy(a)

function shallowCopy(obj) {
  var newobj = {};
  for (var prop in obj) {
    if (obj.hasOwnProperty(prop)) {     //判断自身属性
      newobj[prop] = obj[prop];
    }
  }
  return newobj;
}

//深拷贝
var a = { 
    a:1, 
    arr: [1,2]，
    nation : '中国',
    birthplaces:['北京','上海','广州']
};
var b = {name:'杨'};

b = deepCopy(obj,b);

console.log(obj2);
//深复制，要想达到深复制就需要用递归
function deepCopy(o,c){
   var c = c || {}；
   for(var i in o){
   if(typeof o[i] === 'object'){
          //要考虑深复制问题了
          if(o[i].constructor === Array){
            //这是数组
            c[i] =[]；
          }else{
            //这是对象
            c[i] = {}；
          }
          deepCopy(o[i],c[i])；
        }else{
          c[i] = o[i]；
        }
     }
     return c
 }



```









