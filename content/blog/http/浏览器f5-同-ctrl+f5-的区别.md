---
title: 浏览器F5 同 Ctrl+F5 的区别
date: 2019-03-11 10:03:59
category: http
---

我们第一次打开网站的 `Network` 界面,
由于是第一次打开，所以全部资源是从服务器请求的，`Status` 都是 `200`。

接下来我们按一下 `F5`，看看效果；

发现静态资源的 `Size` 都是 `from disk cache`

说明此时的静态资源是从缓存中取的。具体为什么 `Size` 是 `from disk cache` 我先按下不表。我先来说说 `size` 选项的`4` 种情况。

## size 选项的 4 种情况

- 资源的大小
- from disk cache
- from memory cache
- from ServiceWorker

### from memory cache

表示此资源是取自内存，不会请求服务器。已经加载过该资源且缓存在内存当中；
关闭该页面此资源就被内存释放掉了，再次打开相同页面时不会出现 `from memory cache` 的情况。

### from disk cache

表示此资源是取自磁盘，不会请求服务器。
已经在之前的某个时间加载过该资源，但是此资源不会随着该页面的关闭而释放掉，因为是存在硬盘当中的，下次打开仍会 `from disk cache`。


### 资源本身大小数值

当 `http` 状态为 `200` 是实实在在从浏览器获取的资源，当 `http` 状态为 `304` 时该数字是与服务端通信报文的大小，并不是该资源本身的大小，该资源是从本地获取的。

### from ServiceWorker

表示此资源是取自 `from ServiceWorker`。

## 现在我们再按下 Ctrl+F5，看看效果

发现 `Size` 显示的又是资源自身的大小，说明 `Ctrl+F5` 后的资源又是重新从服务器中请求得到的。

## F5 同 Ctrl+F5 的区别

为什么 `F5` 后请求的是缓存，而 `Ctrl+F5` 就重新请求资源呢？

答案就是这两种方式发送的请求头不一样（不同的浏览器发送的请求头也有一些区别）。


在 `chrome` 浏览器中按 `F5` 后，看到资源的请求头中有 `provisional headers are show` 字样。这是为什么呢？

> 原因：未与服务端正确通信。该文件是从缓存中获取的并未进行通信，所以详细标头并不会显示。强缓存 from disk cache 或者 from memory cache ，都不会正确的显示请求头。

下面看看按 `F5` 后在 `firefox` 浏览器中的表现。

返回的状态码是 `304 Not Modified`。

这是因为按 `F5` 进行页面刷新时请求头会添加 `If-Modify-Since` 字段，如果资源未过期，命中缓存，服务器就直接返回 `304` 状态码，客户端直接使用本地的资源。

可以看出 `chrome` 和 `firefox` 在按下 `F5` 后，其内部使用的缓存机制不同。`firefox` 使用的是协商缓存，而 `chrome` 使用的是强缓存。

### Ctrl+F5

我们还是先看看在 `chrome` 中 `Ctrl+F5` 的表现。

我们发现在请求头中多了两个 `Cache-Control:no-cache`，`Pragma:no-cache` 参数，这两个参数什么意思呢？

> 在请求头中的 `Cache-Control:no-cache` 表示客户端不接受本地缓存的资源，需要到源服务器进行资源请求，其实可以使用缓存服务器的资源，不过需要到源服务器进行验证，验证通过就可以将缓存服务器的资源返回给客户端。

那么在 `firefox` 中的表现是怎样的呢？

请求头中同样多了两个 `Cache-Control:no-cache，Pragma:no-cache` 参数。

可以看出 `chrome` 和 `firefox` 在按下 `Ctrl+F5` 后，都不会使用本地缓存，并且对缓存服务器的资源会再验证。
