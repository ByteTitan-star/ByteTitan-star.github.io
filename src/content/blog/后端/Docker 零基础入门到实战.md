---

title: "Docker 零基础入门到实战"
titleEn: "Docker from Zero to Practice"
description: "云原生入门基石，Docker零基础实战全攻略。从核心概念、环境搭建到多阶段构建、数据持久化与网络通信，彻底搞懂容器化底层逻辑，带你完成从开发到生产部署的完整闭环。"
descriptionEn: "A cloud-native starter guide to Docker—from core concepts and setup to multi-stage builds, persistence, networking, and a path from local to production."
pubDate: 2026-08-12
---

刚入行的后端开发小周，在搞定 K8s 博客部署后回头复盘，才发现自己之前只会抄 Dockerfile、敲`docker run`，连镜像和容器的核心区别都没搞懂：打包的镜像动不动 1 个 G，容器重启后博客数据全丢，换台服务器镜像就跑不起来，踩了一堆坑。

运维老陈告诉他：Docker 是云原生技术栈的入门基石，K8s 的底层核心就是容器运行时，只有把 Docker 的底层逻辑彻底搞懂，后续的容器编排学习才不会变成空中楼阁。今天我们就从零开始，把 Docker 从核心概念到生产实战全链路打通，零基础也能跟着一步步上手。

## 一、Docker 是什么？到底解决什么问题？

几乎所有新手入门 Docker，都会先遇到一个灵魂问题：我本地直接跑代码就行，为什么非要用 Docker？

我们先从行业里最经典的痛点说起：**「代码在我本地能跑，线上怎么就崩了？」**开发环境、测试环境、生产环境的操作系统、依赖版本、系统配置、环境变量千差万别，前端开发可能遇到「node 版本不对项目跑不起来」，后端开发可能遇到「本地 jdk8，线上 jdk11 导致功能异常」，运维更是要面对几十上百台服务器的环境一致性问题，每一次部署都像开盲盒。

除此之外，还有两个核心痛点：

1. **资源隔离问题**：多个应用部署在同一台服务器上，会互相抢 CPU、内存资源，一个应用崩溃可能拖垮整台服务器的其他服务；
2. **部署效率问题**：传统部署要手动装依赖、配环境、改配置，一个应用从打包到上线要几十分钟，扩容时还要重复操作，效率极低。

而 Docker，就是为了解决这些痛点诞生的。

### 1. Docker 核心定义

Docker 是一个开源的**容器化引擎**，基于 Linux 内核的 Namespace、Cgroup 等技术，把应用及其所有依赖、运行环境、配置文件，打包成一个标准化的**容器镜像**，实现「一次构建，到处运行」。同时为每个容器提供独立的隔离运行环境，容器之间、容器与宿主机之间互不干扰。

### 2. 新手必懂：Docker vs 虚拟机，到底有什么区别？

很多新手会把 Docker 和虚拟机混为一谈，二者虽然都是虚拟化技术，但底层逻辑天差地别，这也是 Docker 能快速普及的核心原因，我们用一张表格讲清楚:

| 对比维度   | Docker 容器                        | 传统虚拟机                          |
| ---------- | ---------------------------------- | ----------------------------------- |
| 虚拟化级别 | 操作系统级虚拟化，共享宿主机内核   | 硬件级虚拟化，有完整的独立 Guest OS |
| 资源占用   | 极小，镜像通常只有几 MB 到几百 MB  | 极大，虚拟机镜像通常几个 GB 起步    |
| 启动速度   | 毫秒级，1 秒内就能启动             | 分钟级，启动需要几十秒到几分钟      |
| 隔离性     | 进程级隔离，安全性适中             | 完全隔离，安全性极高                |
| 可移植性   | 跨平台兼容性极强，一次构建到处运行 | 移植性差，不同虚拟化平台适配复杂    |

简单来说，虚拟机相当于给应用单独租了一整套房子，有独立的水电、装修；而 Docker 容器相当于给应用租了一个独立的单间，共享房子的水电、公共设施，成本更低、启动更快、搬家更方便。

## 二、前置准备：Docker 环境安装与配置

Docker 的安装非常简单，全平台都有一键安装包，我们分系统讲解安装步骤与核心配置，解决新手最容易卡壳的「镜像拉取慢」问题。

### 1. 全平台安装步骤

* **Windows 系统**：打开 Docker 官网，下载 Docker Desktop 安装包，一键默认安装即可，安装完成后启动 Docker Desktop，右下角出现 Docker 图标说明启动成功。

* **Mac 系统**：M 系列芯片和 Intel 芯片分别下载对应安装包，拖动到应用程序文件夹即可完成安装，启动 Docker Desktop 验证运行状态。

* Linux 系统（CentOS/Ubuntu）

    ：通过官方脚本一键安装，执行命令： 

    ```bash
    curl -fsSL https://get.docker.com | bash -s docker --mirror Aliyun
    ```

    ![点击并拖拽以移动](data:image/gif;base64,R0lGODlhAQABAPABAP///wAAACH5BAEKAAAALAAAAAABAAEAAAICRAEAOw==)

    ​	安装完成后，启动 Docker 服务并设置开机自启： 	

    ```bash
    systemctl start docker
    systemctl enable docker
    ```

    ![点击并拖拽以移动](data:image/gif;base64,R0lGODlhAQABAPABAP///wAAACH5BAEKAAAALAAAAAABAAEAAAICRAEAOw==)

### 2. 安装验证

安装完成后，打开终端（Windows 用 CMD/PowerShell，Mac/Linux 用系统终端），执行以下两条命令，验证安装是否成功：

```bash
# 查看Docker版本，输出版本号说明安装成功
docker --version
# 查看Docker详细信息，确认服务正常运行
docker info
```

![点击并拖拽以移动](data:image/gif;base64,R0lGODlhAQABAPABAP///wAAACH5BAEKAAAALAAAAAABAAEAAAICRAEAOw==)

### 3. 新手必配：国内镜像加速

Docker 默认从国外的 Docker Hub 拉取镜像，国内网络环境下速度极慢，甚至会拉取失败，必须配置国内镜像加速源。

* Windows/Mac 系统：打开 Docker Desktop，进入「Settings」→「Docker Engine」，在配置文件中添加以下镜像源配置，点击 Apply & Restart 重启 Docker 即可： 

    ```bash
    {
      "registry-mirrors": [
        "https://hub-mirror.c.163.com",
        "https://mirror.baidubce.com",
        "https://docker.mirrors.ustc.edu.cn"
      ]
    }
    ```

    ![点击并拖拽以移动](data:image/gif;base64,R0lGODlhAQABAPABAP///wAAACH5BAEKAAAALAAAAAABAAEAAAICRAEAOw==)

* Linux 系统：修改

    ```
    /etc/docker/daemon.json
    ```

    文件，添加上述相同配置，然后执行以下命令重启 Docker 生效： 

    ```bash
    systemctl daemon-reload
    systemctl restart docker
    ```

    ![点击并拖拽以移动](data:image/gif;base64,R0lGODlhAQABAPABAP///wAAACH5BAEKAAAALAAAAAABAAEAAAICRAEAOw==)

## 三、Docker 三大核心组件：搞懂这三个概念，就懂了 Docker 的 80%

Docker 的整个生态，都围绕三大核心组件展开，我们用最通俗的生活类比，让新手一次性搞懂，再也不会混淆镜像和容器。

| 核心组件          | 通俗类比                            | 核心定义与用途                                               |
| ----------------- | ----------------------------------- | ------------------------------------------------------------ |
| 镜像（Image）     | 程序安装包 / 手机 APP 的安装文件    | 一个**只读的标准化模板**，包含了应用运行需要的所有内容：代码、依赖库、环境变量、配置文件、启动命令。镜像就是容器的「蓝图」，同一个镜像可以创建无数个相同的容器。 |
| 容器（Container） | 安装后运行的程序 / 手机上打开的 APP | 镜像**运行后的实例**，是一个独立的、隔离的运行环境。镜像是只读的，而容器有自己的可写层，你可以启动、停止、删除、重启容器，不同容器之间完全隔离，互不影响。 |
| 仓库（Registry）  | 应用商店 / 软件下载站               | 专门用来存储和分发 Docker 镜像的服务，分为公共仓库和私有仓库。最知名的公共仓库是 Docker Hub，国内有阿里云镜像仓库，企业内部常用 Harbor 搭建私有仓库，和 GitHub 的代码仓库逻辑完全一致。 |

这里给新手划一个核心重点：**镜像和容器的关系，就像面向对象编程里「类」和「实例」的关系**。镜像是类，定义了所有的属性和方法；容器是类的实例，是镜像运行后的具体对象，同一个类可以创建无数个实例，同一个镜像也可以创建无数个容器。

## 四、核心高频指令详解

我们把 Docker 指令分为「镜像操作」和「容器操作」两大模块，覆盖开发中 99% 的使用场景，每个指令都讲清楚用途、语法和可直接复制的实操示例，零基础也能直接套用。

### 1. 镜像操作核心指令

镜像是所有操作的基础，这部分指令用来完成镜像的拉取、查看、构建、删除、分发等操作。

| 指令               | 核心用途                           | 语法格式                                                     | 实操示例与说明                                               |
| ------------------ | ---------------------------------- | ------------------------------------------------------------ | ------------------------------------------------------------ |
| `docker pull`      | 从远程仓库拉取镜像到本地           | `docker pull 镜像名:标签`                                    | 1. 拉取最新版 nginx 镜像：`docker pull nginx:latest`；2. 拉取指定版本 node 镜像：`docker pull node:18-alpine`；⚠️ 标签不写默认拉取 latest 最新版，生产环境建议指定固定版本，避免版本不一致问题 |
| `docker images`    | 查看本地所有镜像                   | `docker images [参数]`                                       | 1. 查看所有本地镜像：`docker images`；2. 查看指定镜像：`docker images nginx`；输出内容包含镜像名、标签、镜像 ID、创建时间、镜像大小 |
| `docker rmi`       | 删除本地镜像                       | `docker rmi 镜像名/镜像ID`                                   | 1. 通过镜像名删除：`docker rmi nginx:latest`；2. 通过镜像 ID 删除：`docker rmi a1b2c3d4`；⚠️ 必须先删除使用该镜像的所有容器，才能删除镜像 |
| `docker build`     | 通过 Dockerfile 构建自定义镜像     | `docker build -t 镜像名:标签 构建上下文路径`                 | 1. 构建当前目录的 Dockerfile：`docker build -t my-blog:v1 .`；`.`代表当前目录为构建上下文，`-t`用来给镜像设置名称和版本标签 |
| `docker tag`       | 给镜像打新标签，用于推送到私有仓库 | `docker tag 原镜像名:原标签 新镜像名:新标签`                 | 给本地镜像打阿里云仓库标签：`docker tag my-blog:v1 registry.cn-beijing.aliyuncs.com/xxx/my-blog:v1` |
| `docker push`      | 把本地镜像推送到远程仓库           | `docker push 镜像名:标签`                                    | 推送镜像到阿里云仓库：`docker push registry.cn-beijing.aliyuncs.com/xxx/my-blog:v1` |
| `docker save/load` | 镜像导出与导入，用于离线环境传输   | 导出：`docker save -o 导出文件名.tar 镜像名:标签`导入：`docker load -i 导入文件名.tar` | 1. 导出镜像到本地文件：`docker save -o my-blog-v1.tar my-blog:v1`；2. 从离线文件导入镜像：`docker load -i my-blog-v1.tar` |

### 2. 容器操作核心指令

这是开发中使用频率最高的指令，用来完成容器的创建、运行、停止、进入、日志查看等全生命周期管理，其中`docker run`是核心中的核心。

| 指令                        | 核心用途                                         | 语法格式                                   | 实操示例与说明                                               |
| --------------------------- | ------------------------------------------------ | ------------------------------------------ | ------------------------------------------------------------ |
| `docker run`                | 创建并启动一个新容器，Docker 最核心的指令        | `docker run [参数] 镜像名:标签 [启动命令]` | 基础示例：`docker run -d --name nginx-demo -p 80:80 nginx:alpine`，核心参数详解：• `-d`：后台守护进程运行容器，不会占用终端；• `--name`：给容器设置唯一名称，后续操作可以直接用名称；• `-p 宿主机端口:容器端口`：端口映射，把容器内的端口映射到宿主机，外网才能访问；• `-e 环境变量名=值`：给容器注入环境变量；• `-v 宿主机路径:容器路径`：目录挂载，实现数据持久化；• `--rm`：容器停止后自动删除，适合临时测试使用 |
| `docker ps`                 | 查看容器列表                                     | `docker ps [参数]`                         | 1. 查看**运行中**的容器：`docker ps`；2. 查看**所有**容器（包括停止的）：`docker ps -a`；输出内容包含容器 ID、名称、镜像、运行状态、端口映射、创建时间 |
| `docker start/stop/restart` | 启动、停止、重启已存在的容器                     | `docker start/stop/restart 容器名/容器ID`  | 1. 停止运行中的 nginx 容器：`docker stop nginx-demo`；2. 启动已停止的容器：`docker start nginx-demo`；3. 重启容器：`docker restart nginx-demo` |
| `docker logs`               | 查看容器的运行日志，排查问题的核心指令           | `docker logs [参数] 容器名/容器ID`         | 1. 查看容器日志：`docker logs nginx-demo`；2. 实时跟踪日志：`docker logs -f nginx-demo`；3. 查看最近 100 行日志：`docker logs --tail 100 nginx-demo` |
| `docker exec`               | 进入运行中的容器内部，执行命令 / 调试            | `docker exec -it 容器名/容器ID 终端命令`   | 进入 nginx 容器的 bash 终端：`docker exec -it nginx-demo /bin/bash`；⚠️ `-it`是固定参数，`-i`保持输入流，`-t`分配伪终端，二者必须一起使用 |
| `docker rm`                 | 删除容器                                         | `docker rm 容器名/容器ID`                  | 1. 删除已停止的容器：`docker rm nginx-demo`；2. 强制删除运行中的容器：`docker rm -f nginx-demo`；3. 批量删除所有停止的容器：`docker container prune` |
| `docker inspect`            | 查看容器 / 镜像的详细信息，包括 IP、挂载、配置等 | `docker inspect 容器名/镜像名`             | 查看 nginx 容器的详细配置：`docker inspect nginx-demo`；排查网络、挂载问题时的核心指令 |

## 五、Dockerfile：自定义镜像构建，开发必备核心能力

日常开发中，我们除了使用官方镜像，更多时候需要把自己的项目打包成自定义镜像，而 Dockerfile 就是定义镜像构建规则的文本文件，Docker 会按照文件里的指令，一步步构建出标准化的镜像。

### 1. Dockerfile 核心指令详解

我们只讲开发中 90% 场景都会用到的核心指令，每个指令都讲清楚用途、语法和最佳实践，新手不会用错。

| 指令         | 核心用途                                                   | 语法格式                                | 实操示例与最佳实践                                           |
| ------------ | ---------------------------------------------------------- | --------------------------------------- | ------------------------------------------------------------ |
| `FROM`       | 指定基础镜像，必须是 Dockerfile 的第一行指令               | `FROM 基础镜像名:标签`                  | 示例：`FROM nginx:1.25-alpine`；✅ 最佳实践：优先选择官方轻量的`alpine`版本镜像，体积小、安全漏洞少，生产环境必须指定固定版本，不要用`latest` |
| `WORKDIR`    | 设置容器内的工作目录，后续所有指令都会在这个目录下执行     | `WORKDIR 目录路径`                      | 示例：`WORKDIR /app`；✅ 最佳实践：用 WORKDIR 替代`cd`命令切换目录，避免路径混乱，不要用相对路径 |
| `COPY`       | 把本地构建上下文中的文件 / 目录，复制到镜像内的指定路径    | `COPY 本地路径 镜像内路径`              | 示例：`COPY ./dist /usr/share/nginx/html`；✅ 最佳实践：优先用 COPY，不要用 ADD，ADD 会自动解压压缩包、支持远程 URL，容易出现不可预期的问题 |
| `RUN`        | 构建镜像时执行的命令，通常用来安装依赖、配置环境           | `RUN 命令`                              | 示例：`RUN apt-get update && apt-get install -y curl`；✅ 最佳实践：把多个 RUN 命令合并成一个，用`&&`连接，减少镜像分层，降低镜像体积 |
| `ENV`        | 设置容器内的环境变量，可用于配置应用参数                   | `ENV 变量名=值`                         | 示例：`ENV NODE_ENV=production`；✅ 最佳实践：用环境变量管理配置，不要把固定配置写死在代码里 |
| `EXPOSE`     | 声明容器运行时监听的端口，仅做声明，不做实际端口映射       | `EXPOSE 端口号`                         | 示例：`EXPOSE 8080`；✅ 最佳实践：明确声明应用监听的端口，提升 Dockerfile 的可读性 |
| `CMD`        | 容器启动时执行的默认命令，一个 Dockerfile 只能有一个 CMD   | `CMD ["命令", "参数1", "参数2"]`        | 示例：`CMD ["nginx", "-g", "daemon off;"]`；✅ 最佳实践：用 exec 数组格式编写，`docker run`后面的命令会覆盖 CMD 指令 |
| `ENTRYPOINT` | 容器启动时执行的固定入口命令，不会被`docker run`的参数覆盖 | `ENTRYPOINT ["命令", "参数1", "参数2"]` | 示例：`ENTRYPOINT ["java", "-jar", "app.jar"]`；✅ 最佳实践：适合固定的启动命令，和 CMD 配合使用，CMD 作为默认参数 |

### 2. 新手必学：多阶段构建，大幅减小镜像体积

很多新手构建的镜像动不动就几个 G，核心原因就是把构建依赖和运行产物都打包到了同一个镜像里。而多阶段构建，可以把「构建阶段」和「运行阶段」分离，最终镜像只保留运行应用需要的内容，体积可以缩小 90% 以上。

我们以一个前端 Vue 项目为例，写一个完整的多阶段构建 Dockerfile，新手可以直接套用：

```bash
# 构建阶段：用完整的node镜像，安装依赖、打包项目
FROM node:18-alpine AS builder
# 设置工作目录
WORKDIR /app
# 先复制package.json，利用Docker分层缓存，依赖不变就不会重新安装
COPY package*.json ./
# 安装依赖
RUN npm install
# 复制所有项目代码
COPY . .
# 执行打包命令，生成dist产物目录
RUN npm run build

# 运行阶段：用轻量的nginx镜像，只保留打包后的产物
FROM nginx:1.25-alpine
# 把构建阶段打包好的dist产物，复制到nginx的静态资源目录
COPY --from=builder /app/dist /usr/share/nginx/html
# 声明80端口
EXPOSE 80
# 启动nginx
CMD ["nginx", "-g", "daemon off;"]
```

![点击并拖拽以移动](data:image/gif;base64,R0lGODlhAQABAPABAP///wAAACH5BAEKAAAALAAAAAABAAEAAAICRAEAOw==)

这个 Dockerfile 构建出来的最终镜像，只有几十 MB，而如果不用多阶段构建，镜像体积会超过 1GB，这是生产环境构建镜像的标准最佳实践。

### 3. 镜像构建与优化避坑指南

1. 必须创建`.dockerignore`文件，和 Dockerfile 放在同一目录，排除不需要复制到镜像里的文件，比如`node_modules`、`.git`、`.env`本地配置文件，避免镜像体积过大、敏感信息泄露；
2. 合理利用 Docker 的分层缓存机制，把不变的内容（比如依赖安装）放在前面，经常变化的代码放在后面，大幅提升构建速度；
3. 不要在 Dockerfile 里存储敏感信息，比如数据库密码、API 密钥，应该通过环境变量在容器运行时注入；
4. 不要用`root`用户运行容器，生产环境应该创建普通用户，降低安全风险。

## 六、Docker 进阶核心能力：数据持久化与网络通信

很多新手踩的坑，都集中在这两个模块：容器重启后数据全丢、容器之间无法互相访问，我们一次性讲透底层逻辑和解决方法。

### 1. 数据持久化：彻底解决容器数据丢失问题

这里先给新手划一个核心重点：**容器的可写层是临时的，容器被删除、重启后，可写层的所有数据都会被清空**。比如你运行了一个 MySQL 容器，没有做数据持久化，容器删除后，所有的数据库数据都会全部丢失，这是生产环境的致命问题。

Docker 提供了两种数据持久化方案，分别适配不同的使用场景：

#### 方案一：绑定挂载（Bind Mount）

把宿主机上的一个目录 / 文件，直接挂载到容器内的指定路径，容器内对该路径的所有修改，都会实时同步到宿主机，反之亦然。

* 核心优势：配置简单、使用灵活，开发环境可以直接把本地代码挂载到容器里，修改本地代码，容器内实时生效，不用重新构建镜像；

* 核心语法：`docker run -v 宿主机绝对路径:容器内路径 镜像名`

* 实操示例：把本地的 html 目录挂载到 nginx 容器的静态资源目录 

    ```bash
    docker run -d --name nginx-demo -p 80:80 -v ./html:/usr/share/nginx/html nginx:alpine
    ```

    ![点击并拖拽以移动](data:image/gif;base64,R0lGODlhAQABAPABAP///wAAACH5BAEKAAAALAAAAAABAAEAAAICRAEAOw==)

#### 方案二：数据卷（Volume）

Volume 是 Docker 官方推荐的持久化方案，由 Docker 直接管理，生命周期和容器完全解耦，容器删除后，Volume 依然存在，不会丢失数据。

* 核心优势：性能更好、支持多种存储驱动、可以在多个容器之间共享，适合生产环境使用；

* 核心语法：`docker run -v 数据卷名称:容器内路径 镜像名`

* 实操示例：用 Volume 持久化 MySQL 的数据库数据 

    ```bash
    # 创建一个名为mysql-data的Volume
    docker volume create mysql-data
    # 运行MySQL容器，把数据目录挂载到Volume
    docker run -d --name mysql-demo -p 3306:3306 -v mysql-data:/var/lib/mysql -e MYSQL_ROOT_PASSWORD=123456 mysql:8.0
    ```

    ![点击并拖拽以移动](data:image/gif;base64,R0lGODlhAQABAPABAP///wAAACH5BAEKAAAALAAAAAABAAEAAAICRAEAOw==)

    ​	哪怕你删除了 mysql-demo 容器，重新创建容器挂载同一个 Volume，数据库数据依然完整保留。

### 2. 网络通信：解决容器之间、容器与外网的访问问题

Docker 为容器提供了完整的网络隔离能力，新手最常遇到的问题就是「容器里访问不了另一个容器的服务」，核心原因就是没有搞懂 Docker 的网络模式。

我们重点讲解开发中最常用的 3 种网络模式：

1. **bridge（桥接网络，默认模式）**Docker 默认会创建一个名为`bridge`的桥接网络，所有不指定网络的容器，都会加入这个网络。同一个桥接网络里的容器，可以通过「容器名 / 容器 ID」互相访问，不同网络的容器之间完全隔离。✅ 最佳实践：生产环境不要用默认的 bridge 网络，应该创建自定义的桥接网络，实现更好的隔离性和 DNS 解析能力。实操示例：

    ```bash
    # 1. 创建一个自定义的桥接网络
    docker network create my-net
    # 2. 运行MySQL容器，加入my-net网络
    docker run -d --name mysql-demo --network my-net -e MYSQL_ROOT_PASSWORD=123456 mysql:8.0
    # 3. 运行后端应用容器，加入同一个网络，直接用容器名mysql-demo访问数据库
    docker run -d --name backend-demo --network my-net my-backend:v1
    ```

    ![点击并拖拽以移动](data:image/gif;base64,R0lGODlhAQABAPABAP///wAAACH5BAEKAAAALAAAAAABAAEAAAICRAEAOw==)

2. **host（主机网络模式）**容器直接共享宿主机的网络命名空间，和宿主机共用同一个 IP、同一个端口，没有网络隔离，容器内监听的端口，就是宿主机的端口，不需要做端口映射。核心优势：网络性能极高，没有端口转发的性能损耗；核心劣势：隔离性差，端口不能冲突，适合对网络性能要求极高的场景；实操示例：`docker run -d --name nginx-demo --network host nginx:alpine`

3. **none（无网络模式）**容器没有任何网络接口，完全和外网、其他容器隔离，只能通过`docker exec`进入容器操作，适合对安全性要求极高、不需要网络的离线应用。

## 七、完整实操流程：从零构建并运行个人博客镜像

我们把前面所有的知识点串联起来，用一个完整的静态博客项目，走一遍从代码到镜像、从运行到持久化的全流程，和之前 K8s 的内容完美衔接。

#### 步骤 1：准备项目代码

创建一个博客项目目录，新建`index.html`作为博客首页，内容如下：

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <title>我的个人博客</title>
</head>
<body>
    <h1>欢迎来到我的个人博客</h1>
    <p>这是用Docker部署的静态博客</p>
</body>
</html>
```

![点击并拖拽以移动](data:image/gif;base64,R0lGODlhAQABAPABAP///wAAACH5BAEKAAAALAAAAAABAAEAAAICRAEAOw==)

#### 步骤 2：编写 Dockerfile

在项目根目录创建 Dockerfile，内容如下：

```bash
# 基础镜像用轻量的nginx alpine版本
FROM nginx:1.25-alpine
# 把本地的html文件复制到nginx的静态资源目录
COPY ./index.html /usr/share/nginx/html/index.html
# 声明80端口
EXPOSE 80
# 前台启动nginx
CMD ["nginx", "-g", "daemon off;"]
```

![点击并拖拽以移动](data:image/gif;base64,R0lGODlhAQABAPABAP///wAAACH5BAEKAAAALAAAAAABAAEAAAICRAEAOw==)

#### 步骤 3：构建自定义镜像

打开终端，进入项目根目录，执行构建命令：

```bash
docker build -t my-blog:v1 .
```

![点击并拖拽以移动](data:image/gif;base64,R0lGODlhAQABAPABAP///wAAACH5BAEKAAAALAAAAAABAAEAAAICRAEAOw==)

构建完成后，执行`docker images`，就能看到我们构建的`my-blog:v1`镜像，体积只有几十 MB。

#### 步骤 4：运行容器，完成端口映射与数据挂载

执行以下命令，创建并运行博客容器：

```bash
docker run -d --name my-blog -p 8080:80 -v ./index.html:/usr/share/nginx/html/index.html my-blog:v1
```

![点击并拖拽以移动](data:image/gif;base64,R0lGODlhAQABAPABAP///wAAACH5BAEKAAAALAAAAAABAAEAAAICRAEAOw==)

执行`docker ps`，看到容器处于运行状态，说明启动成功。

#### 步骤 5：访问验证

打开浏览器，输入`http://localhost:8080`，就能看到我们的博客页面，修改本地的`index.html`，刷新浏览器就能看到内容实时更新，完美实现了数据持久化。

#### 步骤 6：镜像分发

给镜像打远程仓库标签，推送到阿里云 / Docker Hub 仓库，其他服务器只需要执行`docker pull`拉取镜像，就能一键运行，彻底解决环境不一致的问题。

## 八、新手高频踩坑与避坑指南

1. **容器启动后立刻退出，状态显示 Exited**
    * 核心原因：Docker 容器的生命周期和 1 号进程绑定，1 号进程退出，容器就会退出。新手经常用后台启动命令（比如`service nginx start`），导致 1 号进程执行完成后直接退出，容器随之停止。
    * 解决方法：CMD/ENTRYPOINT 必须启动前台进程，比如 nginx 要加`-g daemon off;`，Java 项目要用`java -jar app.jar`前台运行，不要用后台启动命令。
2. **容器重启 / 删除后，数据全部丢失**
    * 核心原因：没有做数据持久化，数据存储在容器的临时可写层，容器生命周期结束，数据就会被清空。
    * 解决方法：用 Bind Mount 或 Volume，把需要持久化的数据目录挂载到宿主机，尤其是数据库、日志、用户上传文件等场景，必须做持久化。
3. **端口映射后，浏览器无法访问容器服务**
    * 排查步骤：① 用`docker ps`确认容器正常运行；② 用`docker logs`查看容器日志，确认服务正常启动，没有报错；③ 用`docker exec`进入容器，执行`curl localhost:容器端口`，确认容器内服务正常监听端口；④ 确认宿主机端口没有被其他程序占用，防火墙 / 云服务器安全组已经开放对应端口。
4. **镜像构建速度慢，体积过大**
    * 优化方法：① 配置国内镜像源，提升依赖安装速度；② 用多阶段构建，只保留运行需要的产物；③ 合并 RUN 指令，减少镜像分层；④ 用`.dockerignore`排除无用文件；⑤ 优先使用 alpine 轻量基础镜像。
5. **容器之间无法互相通信**
    * 核心原因：两个容器不在同一个 Docker 网络里，默认的 bridge 网络不支持 DNS 解析，无法通过容器名互相访问。
    * 解决方法：创建自定义的桥接网络，把需要通信的容器都加入同一个网络，就能直接通过容器名互相访问，无需硬编码 IP 地址。

## 九、核心总结

Docker 的核心价值，就是彻底解决了应用开发与部署中的「环境一致性」痛点，实现了「一次构建，到处运行」，把应用和运行环境一起打包，让开发、测试、运维的部署流程完全标准化。

同时，Docker 也是云原生技术栈的基石：它解决了**单个容器**的打包、运行、隔离问题，而我们之前学习的 K8s，解决的是**成千上百个容器**的编排、调度、故障自愈、弹性扩缩容问题，二者共同构成了现代应用部署的标准范式。


<!-- i18n:en -->

# Docker from Zero to Practice

Junior backend engineer Xiao Zhou finished deploying a blog on Kubernetes, then looked back and realized he had only ever copied Dockerfiles and typed `docker run`—without truly knowing images vs containers. Images ballooned toward 1GB, blog data vanished after restarts, and the same image failed on another host.

Ops veteran Chen put it simply: Docker is the entry stone of the cloud-native stack. Kubernetes sits on a container runtime. Without Docker’s model, orchestration stays an empty castle in the air. This guide walks from core concepts to production practice so beginners can follow step by step.

## 1. What Is Docker Solving?

Almost every beginner asks: why not just run code locally?

Start from the classic pain: **“It works on my machine—why does production crash?”** Dev / test / prod differ in OS, dependency versions, system config, and env vars. Frontends hit Node version mismatches; backends hit JDK 8 locally vs JDK 11 in prod; ops must keep dozens or hundreds of servers consistent. Every deploy feels like opening a blind box.

Two more core pains:

1. **Resource isolation**: apps on one host fight for CPU/memory; one crash can drag others down.
2. **Deploy efficiency**: manual install/config takes tens of minutes per release and must be repeated for scale-out.

Docker was built for these pains.

### 1. Core definition

Docker is an open-source **container engine**. Using Linux namespaces, cgroups, and related primitives, it packages the app plus dependencies, runtime, and config into a standard **image**—build once, run anywhere—while giving each container an isolated environment that does not interfere with peers or the host.

### 2. Docker vs virtual machines

Beginners often mix Docker and VMs. Both are virtualization, but the underlying model is totally different—that difference is why Docker spread so fast. Compare them side by side:

| Dimension | Docker container | Traditional VM |
| --- | --- | --- |
| Virtualization level | OS-level; shares host kernel | Hardware-level; full guest OS |
| Resource footprint | Tiny—MBs to hundreds of MB | Huge—often multiple GB |
| Boot speed | Milliseconds (often under 1s) | Tens of seconds to minutes |
| Isolation | Process-level; moderate | Strong hardware isolation |
| Portability | Excellent cross-platform | Heavier platform coupling |

A VM rents a whole house with its own utilities. A container rents a private room sharing utilities—cheaper, faster to start, easier to move.

## 2. Install & Configure

Installers exist on every major platform. The beginner blocker is usually **slow image pulls**—fix registry mirrors early.

### 1. Install steps

* **Windows**: download Docker Desktop from the official site, install with defaults, start it, and wait for the tray icon.
* **Mac**: pick the Apple Silicon or Intel build, drag into Applications, start Desktop.
* **Linux (CentOS/Ubuntu)**: one-line install:

```bash
    curl -fsSL https://get.docker.com | bash -s docker --mirror Aliyun
```

Then start and enable the service:

```bash
    systemctl start docker
    systemctl enable docker
```

### 2. Verify install

Open a terminal (CMD/PowerShell on Windows; system terminal on Mac/Linux) and run:

```bash
# Check Docker version — a version string means install succeeded
docker --version
# Inspect Docker details and confirm the daemon is healthy
docker info
```

### 3. Registry mirrors (China networks)

Docker Hub is often slow or fails on mainland networks—configure mirrors.

* **Windows/Mac**: Docker Desktop → Settings → Docker Engine, add mirrors, then Apply & Restart:

```bash
    {
      "registry-mirrors": [
        "https://hub-mirror.c.163.com",
        "https://mirror.baidubce.com",
        "https://docker.mirrors.ustc.edu.cn"
      ]
    }
```

* **Linux**: edit

```
    /etc/docker/daemon.json
```

with the same config, then reload:

```bash
    systemctl daemon-reload
    systemctl restart docker
```

## 3. Three Core Components (80% of Docker)

The whole ecosystem revolves around three ideas. Everyday analogies help beginners stop mixing up images and containers:

| Component | Everyday analogy | Definition & role |
| --- | --- | --- |
| Image | Installer package / app install file | A **read-only standardized template** with everything needed to run: code, libs, env vars, config, start command. The image is the blueprint; one image can spawn countless identical containers. |
| Container | The running app / an opened mobile app | A **running instance** of an image—an isolated environment. Images are read-only; containers get a writable layer. You start/stop/delete/restart them; peers stay isolated. |
| Registry | App store / download site | Stores and distributes images—public or private. Docker Hub is the well-known public registry; Aliyun registries are common in China; enterprises often run Harbor. Same mental model as a GitHub repo for code. |

Key takeaway: **image : container ≈ class : instance** in OOP. The image defines attributes and methods; the container is the concrete object after run. One class → many instances; one image → many containers.

## 4. Everyday Commands

We split commands into **image** and **container** ops—covering ~99% of day-to-day use. Each row includes purpose, syntax, and copy-paste examples.

### 1. Image commands

Images underpin everything: pull, list, build, remove, distribute.

| Command | Purpose | Syntax | Examples & notes |
| --- | --- | --- | --- |
| `docker pull` | Pull remote image locally | `docker pull image:tag` | 1. Latest nginx: `docker pull nginx:latest`; 2. Pinned Node: `docker pull node:18-alpine`. ⚠️ Omitting the tag defaults to `latest`—pin versions in production. |
| `docker images` | List local images | `docker images [opts]` | 1. All: `docker images`; 2. Filter: `docker images nginx`. Output includes name, tag, ID, created time, size. |
| `docker rmi` | Remove local image | `docker rmi name/ID` | 1. By name: `docker rmi nginx:latest`; 2. By ID: `docker rmi a1b2c3d4`. ⚠️ Remove containers using the image first. |
| `docker build` | Build from Dockerfile | `docker build -t name:tag context` | Current dir: `docker build -t my-blog:v1 .` — `.` is the build context; `-t` sets name and tag. |
| `docker tag` | Retag for private push | `docker tag old:tag new:tag` | Aliyun example: `docker tag my-blog:v1 registry.cn-beijing.aliyuncs.com/xxx/my-blog:v1` |
| `docker push` | Push to remote registry | `docker push name:tag` | `docker push registry.cn-beijing.aliyuncs.com/xxx/my-blog:v1` |
| `docker save/load` | Offline export/import | Export: `docker save -o file.tar name:tag` · Import: `docker load -i file.tar` | 1. Export: `docker save -o my-blog-v1.tar my-blog:v1`; 2. Import: `docker load -i my-blog-v1.tar` |

### 2. Container commands

Highest-frequency ops for create/run/stop/enter/logs. `docker run` is the core of the core.

| Command | Purpose | Syntax | Examples & notes |
| --- | --- | --- | --- |
| `docker run` | Create and start a container | `docker run [opts] image:tag [cmd]` | Basic: `docker run -d --name nginx-demo -p 80:80 nginx:alpine`. Flags: • `-d` detach; • `--name` unique name; • `-p host:container` publish ports; • `-e KEY=VAL` env; • `-v host:container` mounts; • `--rm` auto-remove on stop (temp tests). |
| `docker ps` | List containers | `docker ps [opts]` | 1. Running: `docker ps`; 2. All incl. stopped: `docker ps -a`. Shows ID, name, image, status, ports, created. |
| `docker start/stop/restart` | Lifecycle of existing containers | `docker start/stop/restart name/ID` | 1. `docker stop nginx-demo`; 2. `docker start nginx-demo`; 3. `docker restart nginx-demo` |
| `docker logs` | Container logs (debug) | `docker logs [opts] name/ID` | 1. `docker logs nginx-demo`; 2. Follow: `docker logs -f nginx-demo`; 3. Tail: `docker logs --tail 100 nginx-demo` |
| `docker exec` | Run cmd / shell in running container | `docker exec -it name/ID cmd` | `docker exec -it nginx-demo /bin/bash`. ⚠️ `-it` together: `-i` keep STDIN, `-t` allocate TTY. |
| `docker rm` | Delete container | `docker rm name/ID` | 1. Stopped: `docker rm nginx-demo`; 2. Force running: `docker rm -f nginx-demo`; 3. Prune stopped: `docker container prune` |
| `docker inspect` | Deep config (IP, mounts, …) | `docker inspect name` | `docker inspect nginx-demo`—core for networking/mount debugging. |

## 5. Dockerfile: Custom Images

Beyond official images, you package your own project. A Dockerfile is the text recipe Docker follows, step by step, to build a standard image.

### 1. Core instructions

These cover ~90% of real Dockerfiles—purpose, syntax, and practice so beginners do not misuse them.

| Instruction | Purpose | Syntax | Example & best practice |
| --- | --- | --- | --- |
| `FROM` | Base image; must be first | `FROM base:tag` | `FROM nginx:1.25-alpine`. Prefer official `alpine`, pin versions—never rely on `latest` in prod. |
| `WORKDIR` | Working directory for later steps | `WORKDIR path` | `WORKDIR /app`. Prefer `WORKDIR` over `cd`; avoid messy relative paths. |
| `COPY` | Copy from build context into image | `COPY local image-path` | `COPY ./dist /usr/share/nginx/html`. Prefer `COPY` over `ADD`—`ADD` auto-extracts archives and accepts remote URLs, which surprises people. |
| `RUN` | Build-time commands | `RUN cmd` | `RUN apt-get update && apt-get install -y curl`. Chain with `&&` to cut layers/size. |
| `ENV` | Env vars inside the image | `ENV KEY=VAL` | `ENV NODE_ENV=production`. Configure via env; do not hardcode secrets in code/layers. |
| `EXPOSE` | Declares listen ports (docs only) | `EXPOSE port` | `EXPOSE 8080`. Still map with `-p` at runtime; improves readability. |
| `CMD` | Default start command (one per file) | `CMD ["cmd","arg"]` | `CMD ["nginx","-g","daemon off;"]`. Use exec-form arrays; `docker run` args override `CMD`. |
| `ENTRYPOINT` | Fixed entry; not overridden by run args the same way | `ENTRYPOINT ["cmd","arg"]` | `ENTRYPOINT ["java","-jar","app.jar"]`. Pair with `CMD` as default args. |

### 2. Multi-stage builds (cut image size)

Beginner images often hit multiple GB because build toolchains ship into runtime. Multi-stage builds separate **build** and **run**—final image keeps only what the app needs, often 90%+ smaller.

Vue frontend example you can reuse:

```bash
# Build stage: full Node image — install deps and build the project
FROM node:18-alpine AS builder
# Set working directory
WORKDIR /app
# Copy package.json first to leverage layer cache when deps are unchanged
COPY package*.json ./
# Install dependencies
RUN npm install
# Copy the rest of the project
COPY . .
# Build artifacts into dist/
RUN npm run build

# Runtime stage: lightweight nginx — keep only build output
FROM nginx:1.25-alpine
# Copy dist from the builder into nginx's static root
COPY --from=builder /app/dist /usr/share/nginx/html
# Declare port 80
EXPOSE 80
# Start nginx
CMD ["nginx", "-g", "daemon off;"]
```

Final image is tens of MB; without multi-stage it often exceeds 1GB. This is the standard production pattern.

### 3. Build pitfalls

1. Add a `.dockerignore` next to the Dockerfile—exclude `node_modules`, `.git`, local `.env` so images stay small and secrets stay out.
2. Order layers for cache: stable deps first, changing source last—builds get much faster.
3. Never bake DB passwords or API keys into layers—inject at runtime via env.
4. Do not run as `root` in production—create a non-root user to reduce blast radius.

## 6. Persistence & Networking

Most beginner pain lands here: data gone after restart, containers cannot talk. Fix both with clear mental models.

### 1. Persistence: stop losing container data

Hard rule: **the container writable layer is ephemeral.** Delete/recreate without mounts and MySQL data is gone—fatal in production.

Docker offers two persistence styles for different scenarios:

#### Option A: Bind mount

Map a host directory/file into a container path. Edits sync both ways in real time.

* **Pros**: simple and flexible; mount local code for hot reload without rebuilds.
* **Syntax**: `docker run -v /absolute/host/path:/container/path image`
* **Example**: mount a local `html` folder into nginx’s static root:

```bash
    docker run -d --name nginx-demo -p 80:80 -v ./html:/usr/share/nginx/html nginx:alpine
```

#### Option B: Volume

Docker-managed storage, officially recommended. Lifecycle is decoupled from the container—delete the container and the volume remains.

* **Pros**: better performance, multiple storage drivers, shareable across containers—fits production.
* **Syntax**: `docker run -v volume-name:/container/path image`
* **Example**: persist MySQL data:

```bash
    # Create a volume named mysql-data
    docker volume create mysql-data
    # Run MySQL and mount the data directory to the volume
    docker run -d --name mysql-demo -p 3306:3306 -v mysql-data:/var/lib/mysql -e MYSQL_ROOT_PASSWORD=123456 mysql:8.0
```

Delete `mysql-demo`, recreate with the same volume—data stays intact.

### 2. Networking: containers talking to each other and the outside

Docker isolates networks. Beginners often hit “cannot reach the other container” because they do not know the modes.

Focus on the three modes you actually use:

1. **bridge (default)** — Docker creates a default `bridge` network; unspecified containers join it. Peers on the **same** bridge can reach each other by container name/ID; different networks stay isolated. ✅ Best practice: in production, create a **custom** bridge for better isolation and DNS. Example:

```bash
    # 1. Create a custom bridge network
    docker network create my-net
    # 2. Run MySQL on my-net
    docker run -d --name mysql-demo --network my-net -e MYSQL_ROOT_PASSWORD=123456 mysql:8.0
    # 3. Run the backend on the same network — reach MySQL by container name mysql-demo
    docker run -d --name backend-demo --network my-net my-backend:v1
```

2. **host** — shares the host network namespace (same IP/ports). No isolation, no `-p` needed; container listen port *is* the host port. Pros: max network performance. Cons: weak isolation, port conflicts. Example: `docker run -d --name nginx-demo --network host nginx:alpine`

3. **none** — no network interfaces; fully offline from peers and the internet. Interact only via `docker exec`. Fits high-security offline workloads.

## 7. End-to-End: Build & Run a Personal Blog Image

Wire the pieces together with a static blog—from code to image to persistence—bridging nicely into prior Kubernetes material.

#### Step 1: Project files

Create a blog directory with `index.html`:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>My Personal Blog</title>
</head>
<body>
    <h1>Welcome to My Personal Blog</h1>
    <p>This is a static blog deployed with Docker</p>
</body>
</html>
```

#### Step 2: Dockerfile

At the project root:

```bash
# Lightweight nginx alpine as the base image
FROM nginx:1.25-alpine
# Copy local HTML into nginx's static root
COPY ./index.html /usr/share/nginx/html/index.html
# Declare port 80
EXPOSE 80
# Run nginx in the foreground
CMD ["nginx", "-g", "daemon off;"]
```

#### Step 3: Build

From the project root:

```bash
docker build -t my-blog:v1 .
```

Then `docker images` should show `my-blog:v1` at only tens of MB.

#### Step 4: Run with port map + bind mount

```bash
docker run -d --name my-blog -p 8080:80 -v ./index.html:/usr/share/nginx/html/index.html my-blog:v1
```

`docker ps` should show it running.

#### Step 5: Verify

Open `http://localhost:8080`. Edit local `index.html`, refresh—content updates live via the bind mount.

#### Step 6: Distribute

Retag and push to Aliyun / Docker Hub. Other hosts only need `docker pull` and run—environment drift disappears.

## 8. Common Beginner Failures

1. **Container exits immediately (`Exited`)**
    * Cause: container lifetime follows PID 1. Background starts like `service nginx start` let PID 1 finish and the container dies.
    * Fix: CMD/ENTRYPOINT must stay foreground—e.g. nginx with `-g daemon off;`, Java with `java -jar app.jar` in the foreground.
2. **Data gone after restart/delete**
    * Cause: no persistence; data lived on the ephemeral writable layer.
    * Fix: Bind Mount or Volume for DB data, logs, uploads—mandatory in those scenarios.
3. **Port mapped but browser cannot reach the service**
    * Checklist: ① `docker ps` shows running; ② `docker logs` clean; ③ `docker exec` + `curl localhost:container-port` works inside; ④ host port free; firewall / cloud security group open.
4. **Slow builds / huge images**
    * Fixes: ① China mirrors for deps; ② multi-stage builds; ③ merge `RUN` layers; ④ `.dockerignore`; ⑤ prefer alpine bases.
5. **Containers cannot talk**
    * Cause: not on the same Docker network; default bridge DNS/name resolution is weak for name-based access.
    * Fix: create a custom bridge and attach all peers—reach by container name, no hardcoded IPs.

## 9. Summary

Docker’s core value is **environment consistency**—build once, run anywhere—by packaging app and runtime together so dev / test / ops share one deploy path.

It is also the cloud-native foundation: Docker solves **single-container** packaging, run, and isolation; Kubernetes solves **orchestrating hundreds or thousands**—scheduling, self-heal, elastic scale. Together they are the modern deploy standard.
