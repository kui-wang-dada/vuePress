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
RUN[("apt-get", "install", "-y", "vim")];
CMD[("echo", "hello docker")];
ENTRYPOINT[("echo", "hello docker")];
```

### 6. 将image发布到dockerhub

- docker login
- docker push imageName:tag


## docker network

### 端口映射
`docker run --name web -d -p 80:80 nginx`

--name: 容器命名
-d:后台运行
-p:端口映射

## docker volumn数据持久化

- 基于本地文件系统的volumn 
  可以在执行docker create或docker run 时，通过-v参数将主机的目录作为容器的数据卷。
- 基于plugin的volumn，支持第三方的存储方案，比如nas,aws

### volumn的类型

- 受管理的data volumn，由docker后台自动创建。
- 绑定挂载的volumn，具体挂载位置可以由用户指定。

### 具体用法

> dockerfile中：volume ['/var/lib/mysql']

1. `docker volumn ls` 查看volume
2. `docker volumn inspect id` 查看指定volume
3. `docker volumn rm id`  删除volume
4. `docker run -d -v mysql:/var/lib/mysql --name mysql1 ` -v将/var/lib/mysql的volume命名为mysql

### bind mounting

> 将本地文件和容器映射

`docker run -d -v $(pwd):/usr/share/nginx/html -p 80:80 --name web 。。。`

$(pwd)代表当前目录

## docker-compose

> 批处理多容器的app

- 是一个基于docker的命令行工具
- 通过一个yml文件定义多容器的docker应用
- 通过一条命令就可以根据yml文件的定义去创建或者管理多个容器
- yml主要包括services,networks,volumes



## 基础命令

1. `docker image ls` 查看本机的 image

   `docker image rm id` 删除某一个 image

2. `docker container ls` 查看本机的正在运行的容器

   `docker container ls -a`查看历史运行过的容器

   `docker container rm id` 删除某一个容器

3. `docker run/exec -it name /bin/bash ` 运行某一个容器并进入bash

4. `docker network inspect bridge`  看到对应容器的bridge
    `ping ip`  ping通ip 
    `telnet ip:duankou`  查看端口情况
    `curl ip`  访问ip
5. `docker-compose up -d` 根据命令行目录下的docker-compose.yml文件起项目，-d不打印日志并后台运行

6. `docker-compose ps` 查看多个容器中的服务的情况

7. `docker-compose stop` 关闭容器中的服务但不删除

8. `docker-compose done` 关闭容器并删除容器

9. `docker-compose images`  列出images

10. `docker-compose exec [container] bash` 进入容器的bash命令行

11. ``



## 配置 docker-compose.yml

```javascript

```
