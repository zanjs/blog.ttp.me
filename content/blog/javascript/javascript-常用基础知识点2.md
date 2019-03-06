---
title: javascript-常用基础知识点2
date: 2019-03-05 13:03:96
category: javascript
---


## 引起内存泄漏的操作有哪些

1. 全局变量引起
2. 闭包引起
3. dom清空，事件未清除
4. 被遗忘的计时器
5. 子元素存在引用

参考

[【译】JavaScript 内存泄漏问题](http://octman.com/blog/2016-06-28-four-types-of-leaks-in-your-javascript-code-and-how-to-get-rid-of-them/)
[JavaScript 常见的内存泄漏原因](https://juejin.im/entry/58158abaa0bb9f005873a843)


## 如何实现ajax请求

1. 通过实例化一个 `XMLHttpRequest` 对象得到一个实例, 调用实例的 `open` 方法为这次 `ajax`请求设定相应的`http`方法
   、相应的地址和以及是否异步,当然大多数情况下我们都是选异步, 以异步为例，之后调用send方法ajax请求，这个方法可以设定需要发送的报文主体，然后通过 监听 `readystatechange` 事件，通过这个实例的 `readyState` 属性来判断这个`ajax` 请求的状态，其中分为`0,1,2,3,4`这四种 状态，当状态为4的时候也就是接收数据完成的时候，这时候可以通过实例的`status` 属性判断这个请求是否成功

```js
var xhr = new XMLHttpRequest();
xhr.open('get', 'api.com', true);
xhr.send(null);
xhr.onreadystatechange = function() {
  if(xhr.readyState==4) {
    if(xhr.status==200) {
      console.log(xhr.responseText);
    }
  }
}
```

## 对 JavaScript 原型的理解

我们知道在 `es6` 之前，`js` 没有类和继承的概念。

原型是`JavaScript` 中一个比较难理解的概念，原型相关的属性也比较多，对象有 `[[prototype]]` 属性，
函数对象有 `prototype` 属性，原型对象有 `constructor` 属性。

### 认识原型

在 `JavaScript` 中，原型也是一个对象，通过原型可以实现对象的属性继承,
`JavaScript` 的对象中都包含了一个 `Prototype` 内部属性，这个属性所对应的就是该对象的原型。

`Prototype` 作为对象的内部属性,是不能被直接访问的。
所以为了方便查看一个对象的原型，`Firefox` 和 `Chrome` 中提供了"__proto__"这个非标准（不是所有浏览器都支持）
的访问器, `ECMA` 引入了标准对象原型访问器 `Object.getPrototype(object)`）。
