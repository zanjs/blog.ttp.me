---
title: windows下openssl config failed
date: 2019-03-20 16:03:81
category: openssl
---

在执行 npm 命令后 出现如下错误

```
openssl config failed: error:02001003:system library:fopen:No such process
```

检查 环境变量 `OPENSSL_CONF`


下载 [openssl](http://slproweb.com/products/Win32OpenSSL.html)


设置环境变量

```
OPENSSL_CONF = D:\OpenSSL-Win64\bin\openssl.cfg
```

