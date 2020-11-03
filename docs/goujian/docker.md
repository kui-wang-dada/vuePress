## 常见命令

### 下载 docker

#### centOS

1. 移除服务器上老的 docker

```javascript
sudo yum remove docker \
                  docker-client \
                  docker-client-latest \
                  docker-common \
                  docker-latest \
                  docker-latest-logrotate \
                  docker-logrotate \
                  docker-engine
```

2. 下载对应插件

```javascript
sudo yum install -y yum-utils \
  device-mapper-persistent-data \
  lvm2
```

3. 配置仓库

```javascript
sudo yum-config-manager \
    --add-repo \
    https://download.docker.com/linux/centos/docker-ce.repo
```

4. 下载 docker-cli

```javascript
sudo yum install docker-ce docker-ce-cli containerd.io
```

5. 启动 docker——`sudo systemctl start docker`

6. 测试 docker 安装是否成功——`sudo docker run hello-world`

7. 查看当前下载镜像`docker image ls`

8. 下载 docker-compose

```javascript
sudo curl -L "https://github.com/docker/compose/releases/download/1.24.1/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
```

9. 解析 docker-compose
   `sudo chmod +x /usr/local/bin/docker-compose`

10. 配置 docker-compose 的路径
    `sudo ln -s /usr/local/bin/docker-compose /usr/bin/docker-compose`

11. 查看版本`docker-compose --version`

## docke 基础

### 1. docker 提供了一个开发，打包，运行 app 的平台

### 2. image:镜像

- 文件和 meta data 的集合（root filesystem）
- 分层的，并且每一层都可以添加改变删除文件，成为一个新的 image
- 不同的 image 可以共享相同的 layer
- image 本身是 read-only 的

#### 获取 image: build from dockerfile

```javascript
//  选择基本image
FROM ubuntu:14.04
//  选择基本标识
LABEL maintainer="Peng Xiao <xiaoquwl@gmail.com>"
// 运行代码
RUN apt-get update && apt-get install -y redis-server

// 暴露的端口
EXPOSE 6379
// 程序的入口，启动redis-server
ENTRYPOINT ["/usr/bin/redis-server"]

```

然后执行命令`docker build -t xiaopeng163/redis:latest .`
`-t`表示当前目录的名字
`.` 表示基于当前目录的 dockerfile 构建

#### 获取 image:pull from registry

> 类似与 git，把 image 传到 registry 上面(dockerhub)，然后通过 pull 命令拉取

eg: `docker pull ubuntu:14.04`

#### 构建一个 base image

1. 创建一个 dockerfile 文件

2. 编写 dockerfile

   ```javascript
   FROM scratch

   ADD hello /

   CMD ["/hello"]
   ```

3. `docker build -t xiaopeng163/hello-world .` 在 dockerhub 上的 xiaopeng163 中创建名为 hello-world 的 image

### 3. container：容器

- 通过 Image 创建（copy）
- 在 Image layer 之上建立一个 container layer (可读写)
- 类比面向对象：类和实例
- Image 负责 app 的存储和分发，container 负责运行 app

### 4. 构建自己的 docker 镜像

> 对 base image 的某一个 container 做了修改之后，重新构建为新的 image

- docker container commit

  `docker commit containerName dockerhubRep/imgName`

  不太提倡，无法保障 image 的安全

- docker image build

  > 通过 dockerfile build 一个 image

  ```javascript
  FROM centos

  RUN yum install -y vim
  // 我们知道image是不可变的，在build过程中，会生成一个临时的container，这个和js的包装对象类似
  ```

  运行`docker build -t dockerhubRep/imageName .`

### 5. dockerfile 语法解析

```javascript

  // 尽量使用官方的image，确保安全
  // 制作base image
  FROM scratch
  // 使用base image;
  FROM centos

  // image的信息，类似与代码中的注释
  LABEL maintainer
  LABEL version
  LABEL description

  // 每运行一个RUN，都会新生成一个layer,故建议通过&&和\将多个命令合并为一个
  RUN

  // 设定当前工作目录，如果根目录下没有root，会自动创建，
  // 使用workdir,不要用run cd ；尽量使用绝对目录
  WORKDIR /root

  // 将文件添加到指定目录
  // ADD 还可以解压缩
  // 大部分情况，copy优于ADD，添加远程文件/目录使用curl或者wget
  ADD hello /   将hello添加到根目录
  COPY

  // 设置常量，尽量使用，增加可维护性
  ENV

  // 存储和网络
  VOLUME and EXPOSE
```

`RUN` 执行命令并创建新的 image layer

`CMD` 设置容器启动后默认执行的命令和参数
如果 docker run 指定了其他命令，cmd 命令被忽略
如果定义了多个 cmd ，只有最后一个会执行

`ENTRYPOINT` 设置容器启动时运行的命令
不会被忽略，一定会执行
最佳实践：写一个 shell 脚本作为 entrypoint

            ```javascript
            COPY docker-entrypoint.sh /usr/local/bin/
            ENTRYPOINT ['docker-entrypoint.sh']
            EXPOSE 27017
            CMD ["mongod"]
            ```

shell 格式

```javascript
RUN apt-get install -y vim
CMD echo "hello docker"
ENTRYPOINT echo "hello docker"
```

Exec 格式

```javascript
RUN[('apt-get', 'install', '-y', 'vim')]
CMD[('echo', 'hello docker')]
ENTRYPOINT[('echo', 'hello docker')]
```

### 6. 将 image 发布到 dockerhub

- docker login
- docker push imageName:tag

## docker network

### 端口映射

`docker run --name web -d -p 80:80 nginx`

--name: 容器命名
-d:后台运行
-p:端口映射 主机端口：容器端口

## docker volumn 数据持久化

- 基于本地文件系统的 volumn
  可以在执行 docker create 或 docker run 时，通过-v 参数将主机的目录作为容器的数据卷。
- 基于 plugin 的 volumn，支持第三方的存储方案，比如 nas,aws

### volumn 的类型

- 受管理的 data volumn，由 docker 后台自动创建。
- 绑定挂载的 volumn，具体挂载位置可以由用户指定。

### 具体用法

> dockerfile 中：volume ['/var/lib/mysql']

1. `docker volumn ls` 查看 volume
2. `docker volumn inspect id` 查看指定 volume
3. `docker volumn rm id` 删除 volume
4. `docker run -d -v mysql:/var/lib/mysql --name mysql1` -v 将/var/lib/mysql 的 volume 命名为 mysql

### bind mounting

> 将本地文件和容器映射

`docker run -d -v $(pwd):/usr/share/nginx/html -p 80:80 --name web 。。。`

\$(pwd)代表当前目录

## docker-compose

> 批处理多容器的 app

- 是一个基于 docker 的命令行工具
- 通过一个 yml 文件定义多容器的 docker 应用
- 通过一条命令就可以根据 yml 文件的定义去创建或者管理多个容器
- yml 主要包括 services,networks,volumes

## 基础命令

1. `docker image ls` 查看本机的 image

   `docker image rm id` 删除某一个 image

2. `docker container ls` 查看本机的正在运行的容器

   `docker container ls -a`查看历史运行过的容器

   `docker container rm id` 删除某一个容器

   `docker container prune` 删除关闭了的容器

3. `docker run/exec -it name /bin/bash` 运行某一个容器并进入 bash

4. `docker network inspect bridge` 看到对应容器的 bridge
   `ping ip` ping 通 ip
   `telnet ip:duankou` 查看端口情况
   `curl ip` 访问 ip
5. `docker-compose up -d` 根据命令行目录下的 docker-compose.yml 文件起项目，-d 不打印日志并后台运行

6. `docker-compose ps` 查看多个容器中的服务的情况

7. `docker-compose stop` 关闭容器中的服务但不删除

8. `docker-compose done` 关闭容器并删除容器

9. `docker-compose images` 列出 images

10. `docker-compose exec [container] bash` 进入容器的 bash 命令行

11. `docker rmi $(docker images -q)` 删除所有镜像

12. `docker stop/rm $(docker ps -aq)` 停止/删除所有容器

## 配置 docker-compose.yml

```javascript
```

## mongo

### 身份认证：

MongoDB 安装完成后，默认是没有权限验证的，默认是不需要输入用户名密码即可登录的，但是往往数据库方面我们会出于安全性的考虑而设置用户名密码。
即任何客户端都可以使用 mongo IP:27017/admin 命令登录 mongo 服务
启用访问控制前，请确保在 admin 数据库中拥有 userAdmin 或 userAdminAnyDatabase 角色的用户。
该用户可以管理用户和角色，例如：创建用户，授予或撤销用户角色，以及创建或修改定义角色。
启用验证的方式：

1. /etc/mongodb.conf //将 auth=true 前面的注释拿掉，然后重启服务生效。
2. 2.线上生产环境使用的是 docker:
   a. 需要在 config 和 shard 服务的启动命令中加上“--auth”参数。
   b. 需要在宿主机生成一个 keyfile 文件：openssl rand -base64 755 > mongo.key，
   分别放在 mongos、config 和 shard 目录中，并修改目录权限：chown -R 999:999 mongos 和 keyfile 权限：chmod 600 mongos/mongo.key
   c. 在 config 和 shard 和 mongos 服务启动命令中添加“--keyFile /data/db/mongo.key”参数。

### 用户权限：

一，掌握权限，理解下面 4 条基本上就差不多

1. mongodb 是没有默认管理员账号，所以要先添加管理员账号，在开启权限认证。
2. 切换到 admin 数据库，添加的账号才是管理员账号。
3. 用户只能在用户所在数据库登录，包括管理员账号。
4. mongo 的用户是以数据库为单位来建立的，每个数据库有自己的管理员。
5. 管理员可以管理所有数据库，但是不能直接管理其他数据库，要先在 admin 数据库认证后才可以。
   注：帐号是跟着库走的，所以在指定库里授权，必须也在指定库里验证

`db.createUser({user: "admin",pwd: "123456",roles: [ { role: "userAdminAnyDatabase", db: "admin" } ]})`

`db.createUser({user: "root",pwd: "123456",roles: [ { role: "root", db: "admin" } ]})`

`db.createUser({user: "position",pwd: "123456",roles: [ { role: "dbOwner", db: "position" } ]})`
