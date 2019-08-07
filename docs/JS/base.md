# JS 基础知识总结（）

## 一、数据类型

> 五种基础数据类型，一种复杂数据类型

### 1、基础数据类型

> 又叫原始数据类型或者不可改变数据类型
>
> number，string，boolean，undefined，null

#### undefind，null 的区别

- null 是一个关键字，undefined 不是关键字
- typeof：undefined 返回的是 undefined，null 返回的是 object
- 数字类型转化时，null 返回 0，undefined 返回 NAN

#### Boolean

- 只有六个值强制转换时为 false：null，undefined，0，''，-0，NAN，其他为 true

#### Number

- 0.1+0.2 不等于 0.3，JS 计算时使用二进制，故小数点操作需要先变为整数计算在变为小数
- NAN：typeof 查看时返回 number，不等于任何数字的数字，NAN 不等于 NAN

#### String

- length 返回 unicode 编码长度
- 理论上只有对象可以用属性方法。使用属性方法时先强制转换为 Object。

### 2、复杂数据类型——对象

> 无序的列表合集，引用类型，可以改变

- 引用类型
- 对象有属性，方法，可以改变
- 内部对象：错误对象，常用对象，内置对象
  - 常用对象：String，Object，Number，Boolean，Function，Array，RegExp，Date 等八种。
  - 内置对象：Global，Math，Json。使用对象时不用 new 操作符
- 宿主对象：windows，和运行环境有关
- 自定义对象：其他自己创建的对象。

### 3、基础数据类型和对象的相互转化

- 原始类型转为字符串：原始类型上加“”；
- 原始类型到数字的转换：undefined——NAN，null——0，true——1，false——0，字符串——（可以强制转换）数字（无法强制转换）NAN（空字符串）0,
- 原始类型到布尔值：null，undefined，0，''，-0，NAN——false，其他为 true
- 原始类型和对象的互转
  - null 和 undefined 无法转为对象，会报错
  - Number 和 Boolean 转换为对象——得到原始值
  - String 转换为对象——得到原始值，length，每一个字符，字符串调用属性会先转为对象进行操作，操作结束后会销毁当前对象，因为原始类型不可改变。
-
