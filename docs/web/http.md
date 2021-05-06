# HTTP 协议总结

## Http 协议基础

### 经典五层模型

> 应用层——传输层——网络层——数据链路层——物理层

1. 物理层主要作用是定义物理设备如何传输数据，指代物理硬件
2. 数据链路层在通信的实体间建立数据链路连接，基本计算机二进制传输
3. 网络层为数据在节点之间传输创建逻辑链路
4. 传输层为 TCP 或 UDP，可以想象为一条管道
5. 应用层为 HTTP，可以想象为一个包

基本概念：一个 tcp 可以发送多个 http 请求，一个 http 请求必须在一个 tcp 连接里

### http 发展历史

#### http/0.9

- 只有一个命令 GET
- 没有 HEADER 等描述数据的信息
- 服务器发送完毕，就关闭 TCP 连接

#### http/1.0

- 增加了很多命令，POST,PUT
- 增加了 status code 和 header
- 多字符集支持、多部分发送、权限、缓存等

#### http/1.1

- 支持了持久连接
- pipeline,管道化
- 增加 host 和其他一些命令

#### http2

- 所有数据以二进制传输，摆脱原来的字符串
- 同一个连接里面发送多个请求不再需要按照顺序来，并行
- 头信息压缩以及推送等提高效率的功能，服务端可以主动发送信息，提升性能

### 三次握手

> http 不存在连接，只有请求和响应
> TCP 连接可以发送多个 http 请求，TCP 连接有三次握手网络请求的消耗

1. 客户端发送连接数据包
2. 服务端开启 TCP SOCKET,再给客户端发送数据包
3. 客户端拿到数据包，再给服务端发送确认数据包

第三次是为了避免第二次握手丢失，导致服务端一直开启端口连接

### URI——URL 和 URN

#### URI

> 统一资源标志符/Uniform Resource Identifier

- 用来唯一标识互联网上的信息资源
- 包括 URL 和 URN

#### URL

> 统一资源定位器/Uniform Resource Locator

- http://user:pass@host.com:80/path?query=string#hash
- http 协议
- user:pass 用户认证，基本用不到
- host.com 定位服务在互联网上的位子，可以为 IP 或者域名
- 80 端口，web 服务，物理服务器上多个 web 服务，不带端口默认访问 80
- path 路由，web 服务上具体的内容
- query 搜索参数，如何进行搜索和查找，传参
- hash 锚点定位工具

此类格式的都叫做 URL，比如 http,ftp 协议

#### URN

> 永久统一资源定位符

- 在资源移动之后还能被找到
- 目前还没有非常成熟的使用方案

### http 报文格式

#### 起始行

- 请求报文：GET /text/test.txt HTTP/1.0
- 响应报文：HTTP/1.0 200 OK

#### 头部

- 请求头：Accept:text/\* Accept-Language:en,fr
- 响应头：Content-type:text/plain Content-length:19

#### 主体

- 请求体：参数
- 响应体：返回的数据

#### HTTP 的方法

- 用来定义对于资源的操作
- 常用有 GET,POST 等
- 从定义上讲有各自的语义

#### HTTP CODE

- 定义服务器对请求的处理结果
- 各个区间的 CODE 有各自的语义

  - 100-199 还需要一些操作才能发送请求
  - 200-299 操作成功
  - 300-399 重定向
  - 400-499 发送的请求有问题 401 认证 403 被拒绝 404 找不到
  - 500-599 服务端问题

- 好的 HTTP 服务可以通过 CODE 判断结果

### 创建一个简单的 web 服务

```javascript
const http = require("http");
http
  .createServer(function(req, res) {
    console.log("req come", req.url);

    res.end("123");
  })
  .listen(9999);
```

## HTTP 各种特性

### CORS 跨域请求的限制与解决

> 浏览器对于非同域的请求会拦截，请求还是会发送，后台服务返回内容，但是浏览器会拦截掉并报错

#### 简单请求

- 允许方法仅为 GET，HEAD，POST
- Content-Type 仅为 text/plain,multipart/form-data,application/x-www-form-urlencoded
- 请求头限制，仅部分固定请求头允许
- XMLHttpRequestUpload 对象均没有注册任何事件监听器
- 请求中没有使用 ReadableStream 对象

```javascript
res.writeHead(200, {
  "Access-Control-Allow-Origin": "*"
});
```

#### 预请求

> 先通过 OPTION 请求访问服务端，返回告诉浏览器允许接下来发送的 POST 请求，浏览器就不会拦截

```javascript
res.writeHead(200, {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "", //允许的请求头
  "Access-Control-Allow-Methods": "", //允许的请求方法
  "Access-Control-Max-Age": "" //预请求不需option验证的最大时间
});
```

#### jsonp

```javascript
<script src="http://127.0.0.1:8888" />
```

### Cache-Control

- public 任何地方都可以进行缓存
- private 只有发起请求的浏览器进行缓存
- no-cache 本地可以存缓存，但需要后台验证过后才能使用

- max-age 秒数，缓存存在的最大时间
- s-maxage 秒数，在代理服务器，会代替 max-age
- max-stale 秒数，发起请求主动带的头的到期时间

- must-revalidate 重新验证
- proxy-revalidate 用在缓存服务器上，必须重新验证

- no-store 不存储缓存
- no-transform 用在代理服务器，不改动返回内容

```javascript
http
  .createServer(function(req, res) {
    res.writeHead(200, {
      "Content-Type": "text/javascript",
      "Cache-Control": "max-age=20" //会取缓存的内容，请求不会发送到服务器
    });
    res.end("123");
  })
  .listen(9999);
```

> 一般缓存会是一个比较长的时间，这就导致服务端更新内容，客户端却还是取老的静态资源。现在常用的方法是每次打包时在静态路径上添加一个 hash 码，hash 码根据文件改变而来，这样浏览器访问静态资源时就会从新请求。

### 缓存验证 Last-Modified 和 Etag 的使用

有 Cache-Control 的情况下
![http.png](https://upload-images.jianshu.io/upload_images/9421914-35ed48b943da3263.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

#### 验证头

**Last-Modified**
上次修改时间，给资源设置上一次何时修改
配合 if-Modified-Since 或者 if-Unmodified-Since 使用
对比上次修改时间判断是否需要更新

**Etag**
数据签名，数据唯一标识，数据修改，那么签名会不一样
配合 if-Match 或者 If-Non-Match 使用
对比资源的签名判断是否使用缓存

```javascript

//服务端进行etag的验证
const etag=req.headers['if-none-match']
if(etag==='777'){
    res.writeHead(304,{
        'Cache-Control':'max-age=200000,no-cache',
        'Last-Modified':'123'
        'Etag':'777'
    })
    res.end('')
}) else {
    res.writeHead(200,{
        'Cache-Control':'max-age=200000,no-cache',
        'Last-Modified':'123'
        'Etag':'777'
    })
    res.end('123')
}

```

### Cookie 和 Session

#### Cookie

> 在服务端返回数据时，通过 Set-Cookie 保存在浏览器，浏览器下次在同域的请求中会在头带上 Cookie，

- 通过 Set-Cookie 设置
- 下次请求会自动带上
- 键值对，可以设置多个
- max-age 和 expires 设置过期时间
- Secure 只在 https 的时候发送
- HttpOnly 无法通过 document.cookie 访问

```javascript
const host = req.headers.host
const html=fs.readFileSync('test.html'.'utf8')
if (host === "test.com") {
  res.writeHead(200, {
    "Set-Cookie": ["id=123;max-age=2", "abc=456;HttpOnly;domain=test.com"]
    //此时test.com下的所有二级域名都可以访问到cookie
  })
}
res.end('html')
```

#### Session

> 经常做法是将保存在 session 中的用户唯一 ID 存入 Cookie,下次请求时拿到 Cookie，通过 Cookie 在 Session 拿到用户信息，进行操作。

### Http 长连接

> http1.1 默认是长连接， 是在 tcp 上顺序发送请求，浏览器 tcp 并发限制为 6，就是同时可以存在 6 个连接。所以浏览器加载首页时，先创建 6 个 TCP 连接，然后 http 是在这六个连接中顺序发送的。

### 数据协商

> 客户端在发送请求时，限定需要拿到的数据格式，内容等。服务端根据这些限制来操作，服务端不一定按照规定返回。
> **请求**

- Accept 想要的数据类型
- Accept-Encoding 数据编码方式进行传输，限制服务器对数据的压缩方式
- Accept-Language 希望展示的语言
- User-Agent 浏览器的相关信息
  **返回**
- Content-Type 实际返回的数据格式
- Content-Encoding 对应 Accept-Encoding，声明传输方式
- Content-Language 返回的语言

### 重定向

> 通过 URL 访问资源时，服务器告诉浏览器资源换位子了，并告诉新的位置，浏览器再请求新的位置,301 永久变更，302 暂时变更，301 的返回会在缓存中提取

```javascript
if (req.url === "/old") {
  res.writeHead(302, {
    Location: "/new"
  });
  res.end("");
}
if (req.url === "/new") {
  res.writeHead(200, {});
  res.end("1234");
}
```

### Content-Security-Policy

> 内容安全策略

- 限制资源获取
- 报告资源获取越权
- default-src 限制全局
- 指定资源类型

```javascript
res.writeHead(200, {
  //仅允许http和https
  "Content-Security-Policy": "default-src http:https:",
  //仅允许本站脚本
  "Content-Security-Policy": "default-src 'self'",
  //限制特定类型
  "Content-Security-Policy": "script-src http:https:"
  //汇报
  "Content-Security-Policy": "script-src ; report-uri /report"
})
res.end("123")
```
