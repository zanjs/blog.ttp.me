---
title: docker构建 mongodb 认证 集群服务
date: 2019-03-26 08:03:72
category: mongodb
---

## 安装

```s	
docker run -p 27018:27017 -v /root/docker/mongo/data:/data/db  -d --name=mongo361 mongo --bind_ip_all --auth

```

## 进入容器

```s
docker exec -it mongo361 mongo admin
```

创建 所有数据库角色

```s
db.createUser({ user: 'zan', pwd: 'zan', roles: [ { role: "userAdminAnyDatabase", db: "admin" } ] });
```

## 认证进入 操作状态

```s
db.auth("zan","zan")
```

```s
use test
```

先切换到 操作的数据库，然后在创建用户

### test 只读账号

```s
db.createUser({user:"test",pwd:"test",roles:[{role: "read", db: "test"}]})
```

### test1 读写账号

```s
db.createUser({user:"test1",pwd:"test",roles:[{role: "readWrite", db: "test"}]})
```

### suihua 读写

```s
db.createUser({user:"suihua",pwd:"suihua",roles:[{role: "readWrite", db: "suihua"}]})
```

### yapi 读写

```s
db.createUser({user:"yapi",pwd:"yapi",roles:[{role: "readWrite", db: "yapi"}]})
```