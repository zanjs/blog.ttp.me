---
title: docker 部署基础设施服务
date: 2019-04-23 09:04:07
category: docker
---

## docker 安装姿势

### 官方

```
curl -sSL https://get.docker.com/ | sh
```

[详情](https://docs.docker.com/install/)


### 第三方加速

daocloud

```
curl -sSL https://get.daocloud.io/docker | sh
```

[详情](https://www.daocloud.io/)


## docker redis

```
docker run -v /root/docker/redis/redisOpen.conf:/usr/local/etc/redis/redis.conf -p 6380:6379 --name redisOpen redis
```

redisOpen.conf

```
bind 0.0.0.0
# daemonize yes
requirepass xxxx
```


## 容器开机自动启动

```
docker update --restart=always redisOpen
```


docker run启动容器 使用–restart参数来设置


```
docker run -m 512m --memory-swap 1G -it -p 6379:6379 --restart=always 
--name redis -d redis
```

1. –restart具体参数值详细信息
   1. no - 容器退出时，不重启容器
   2. on-failure - 只有在非0状态退出时才从新启动容器
   3. always - 无论退出状态是如何，都重启容器

还可以在使用 `on-failure` 策略时，指定 `Docker` 将尝试重新启动容器的最大次数。
默认情况下，`Docker` 将尝试永远重新启动容器。

```
sudo docker run --restart=on-failure:10 redis
```