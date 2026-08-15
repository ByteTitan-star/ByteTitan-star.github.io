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
