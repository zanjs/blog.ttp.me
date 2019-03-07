---
title: async await 处理报错的方式
date: 2019-03-07 17:03:42
category: Async
---

使用 `async/await` 时处理报错的方法


## 报错拦截器方法

```js
function awaitInterceptor(promise){
  if (!promise || !Promise.prototype.isPrototypeOf(promise)) {
    return new Promise((resolve, reject) => {
      reject(new Error("requires promises as the param"));
    }).catch((err) => {
      return [err, null];
    });
  }
  return promise.then(function () {
    console.log(arguments,'arguments')
    return [null, ...arguments];
  }).catch(err => {
    return [err, null];
  });
}
```


## 实战演练

```js
var p1 = function () {
  return new Promise(function (resolve, reject) {
    setTimeout(function () {
      console.log('p1')
      resolve('p1 success');
    }, 2000)
  })
}
var p2 = function () {
  return new Promise(function (resolve, reject) {
    setTimeout(function () {
      console.log('p2')
      reject('p2 fail');
    }, 1000)
  })
}
var p3 = function () {
  console.log('p3')
}
```

## 用 `promise` 控制执行流程

```js
var test = function () {
  p1()
    .then(function () {
      p2()
        .then(function () {
          p3()
        }).catch(function (e) {
        console.log('p2失败了', e)
      })
    }).catch(function (e) {
    console.log('p1失败了', e)
  })
}
```

## 用`promise.all`控制执行流程

```js
var test1 = function () {
    Promise.all([p1(), p2()])
      .then(function () {
        p3();
      }).catch(function (e) {
      console.log('p1或者p2失败了', e)
    })
  }
```

## 用 `await` 来控制流程

> 着比用promise控制要优雅简介许多，但是并没有处理错误

```js
var test2 = async function () {
  await p1();
  await p2();
  p3();
}
```

## 用 `await` 来控制流程, 用try，catch处理报错

> 但是try catch用多了会影响性能，并且这样写也很不美观

```js
var test3 = async function () {
  try {
    await p1();
    await p2();
    p3();
  } catch (e) {
    console.log('p1失败了', e)
  }
}
```

## `awaitInterceptor` 使用

> 用 `awaitInterceptor` 方法处理错误信息，代码也比较看着整洁易懂

```js
var test4 = async function () {
  var err,res;
  [err, res] =await awaitInterceptor(p1());
  if (err) {
    console.log('p1失败了', err);
    return false;
  }
  [err,res] =await awaitInterceptor(p2());
  if(err){
    console.log('p2失败了',err);
    return false;
  }
  p3();
}
```


使用 `async/await` 会更加美观地编写异步代码，
加上 `awaitInterceptor` 的处理错误的方式，就能更完美地处理错误场景了。