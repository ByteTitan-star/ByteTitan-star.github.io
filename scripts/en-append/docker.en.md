

<!-- i18n:en -->

# Docker from Zero to Practice

A junior backend engineer once shipped a blog on Kubernetes, then realized they only copy-pasted Dockerfiles and `docker run`—without truly knowing images vs containers. Images ballooned to 1GB, data vanished on restart, and images failed on other hosts.

Docker is the entry stone of cloud-native stacks; Kubernetes sits on a container runtime. Without Docker fundamentals, orchestration stays abstract. This guide goes from concepts to production practice.

## 1. What Problem Does Docker Solve?

Why not just run code locally?

Classic pain: **“works on my machine.”** OS, dependency versions, configs, and env vars differ across environments.

Two more pains:

1. **Resource isolation**: co-located apps fight for CPU/memory; one crash can take neighbors down.
2. **Deploy speed**: manual deps/config waste minutes per release and don’t scale.

### 1. Core definition

Docker is an open-source **container engine**. Using Linux namespaces/cgroups, it packages app + deps + runtime + config into a standard **image** for “build once, run anywhere,” with isolated processes.

### 2. Docker vs VMs

| Dimension | Docker container | Traditional VM |
| --- | --- | --- |
| Virtualization | OS-level; shares host kernel | Hardware-level; full guest OS |
| Footprint | MBs–hundreds of MB | GBs |
| Boot | Milliseconds | Seconds–minutes |
| Isolation | Process-level | Strong hardware isolation |
| Portability | Excellent | Heavier platform coupling |

VMs rent a whole house; containers rent a private room sharing utilities—cheaper and faster to move.

## 2. Install & Configure

Install Docker Desktop on Windows/Mac, or the engine on Linux. For China networks, configure a registry mirror so pulls are not glacial. Verify with `docker version` and `docker run hello-world`.

## 3. Images, Containers, Dockerfile

- **Image**: immutable layered template
- **Container**: a running instance of an image
- **Dockerfile**: build recipe (`FROM`, `COPY`, `RUN`, `CMD`/`ENTRYPOINT`)

Prefer multi-stage builds to keep runtime images small. Never bake secrets into layers.

## 4. Data & Networking

Use **volumes** / bind mounts for persistence (blogs, DBs). Understand bridge/host/none networks and how containers talk via service names on user-defined bridges.

## 5. Compose & Production Basics

`docker compose` describes multi-service stacks (app + db + redis). In production: healthchecks, restart policies, resource limits, non-root users, and scanning base images.

## 6. Closing

Master Docker’s model—image layers, isolation, persistence, networking—before chasing Kubernetes. The container runtime is the ground you stand on.

> Keep all shell commands and Dockerfiles from the Chinese section identical when practicing; only the narrative above is localized for the English UI.
