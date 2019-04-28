---
title: 简要总结microtask和macrotask
date: 2019-04-28 11:04:67
category: javascript
---

我是在做前端面试题中看到了`setTimeout`和`Promise`的比较,
然后第一次看到了`microtask`和`macrotask`的概念,
在阅读了一些文章之后发现没有一个比较全面易懂的文章,所以我尝试做一个梳理性的总结.

这道经典的面试题引起了我的兴趣

```js
console.log('script start');

setTimeout(function() {
  console.log('setTimeout');
}, 0);

Promise.resolve().then(function() {
  console.log('promise1');
}).then(function() {
  console.log('promise2');
});

console.log('script end');
```

## JavaScript的事件循环机制

首先我们先弄清楚 `setTimeout` 和 `Promise`的共同点,
也就是我第一次的看到那道面试题的疑惑点.

`JavaScript` 主线程拥有一个 执行栈 以及一个 任务队列，主线程会依次执行代码，
当遇到函数时，会先将函数 入栈，函数运行完毕后再将该函数 出栈，直到所有代码执行完毕。


上面的例子的执行栈执行顺序应该是这样的

```js
console.log('script start');
console.log('script end');
Promise.resolve();
```

而任务队列的执行顺序应该是这样的

```js
Promise.then(function() {
  console.log('promise1');
});
Promise.then(function() {
  console.log('promise2');
});
setTimeout(function() {
  console.log('setTimeout');
}, 0);
```

而主线程则会在 清空当前执行栈后，按照先入先出的顺序读取任务队列里面的任务。

众所周知 `setTimeout`和 `Promise.then()` 都属于上述异步任务的一种,
那到底为什么`setTimeout`和 `Promise.then()` 会有顺序之分,这就是我想分析总结的问题所在了.

## macrotasks(tasks) 和 microtasks

### tasks

`tasks`的作用是为了让浏览器能够从内部获取javascript / dom的内容并确保执行栈能够顺序进行。

`tasks`的调度是随处可见的,例如解析HTML,获得鼠标点击的事件回调等等,在这个例子中,我们所迷惑的setTimeout也是一个tasks.

### microtasks

`microtasks`通常用于在当前正在执行的脚本之后直接发生的事情，比如对一系列的行为做出反应，或者做出一些异步的任务，而不需要新建一个全新的tasks。

只要执行栈没有其他javascript在执行，在每个tasks结束时，`microtasks`队列就会在回调后处理。
在`microtasks`期间排队的任何其他`microtasks`将被添加到这个队列的末尾并进行处理。

`microtasks`包括`mutation` `observer` `callbacks`，就像上例中的`promise callbacks`一样。

## 所以上面的例子执行顺序的实质是

- tasks =>start end以及resolve
- microtasks =>promise1和promise2
- tasks =>setTimeout

## 具体应用

需要注意的是,在两个`tasks`之间，浏览器会重新渲染。
这也是我们需要了解`tasks`和 `microtasks`的一个非常重要的原因.


根据 HTML Standard，在每个 task 运行完以后，UI 都会重渲染，那么在 microtask 中就完成数据更新，当前 task 结束就可以得到最新的 UI 了。反之如果新建一个 task 来做数据更新，那么渲染就会进行两次。

[Vue 中如何使用 MutationObserver 做批量处理？ - 顾轶灵的回答 - 知乎](https://www.zhihu.com/question/55364497/answer/144215284)

## 浏览器兼容问题

在__Microsoft Edge__, Firefox 40__, __iOS Safari 以及 desktop Safari 8.0.8 中setTimeout会先于Promise


```html
<div class="outer">
  <div class="inner"></div>
</div>
```

```js
// Let's get hold of those elements
var outer = document.querySelector('.outer');
var inner = document.querySelector('.inner');

// Let's listen for attribute changes on the
// outer element
new MutationObserver(function() {
  console.log('mutate');
}).observe(outer, {
  attributes: true
});

// Here's a click listener…
function onClick() {
  console.log('click');

  setTimeout(function() {
    console.log('timeout');
  }, 0);

  Promise.resolve().then(function() {
    console.log('promise');
  });

  outer.setAttribute('data-random', Math.random());
}

// …which we'll attach to both elements
inner.addEventListener('click', onClick);
outer.addEventListener('click', onClick);
```

在这个例子中,不同浏览器的log是不同的

事实上Chrome是正确的,而且由此可发现microtasks并不是在tasks的结束阶段开始执行,而是在tasks中回调结束之后(只要没有正在执行的JavaScript代码)


## 总结

tasks会顺序执行,浏览器会在执行间隔重新渲染

microtasks会顺序执行,执行时机为

>在没有JavaScript代码执行的callback之后
>在每一个tasks之后