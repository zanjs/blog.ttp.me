---
title: Javascript 的forEach和map方法的区别
date: 2019-03-08 12:03:77
category: javascript
---


`forEach()` 和 `map()` 两个方法都是`ECMA5`中`Array`引进的新方法，
主要作用是对数组的每个元素执行一次提供的函数，但是它们之间还是有区别的。

## `forEach` 和 `map` 语法

### 语法

```js
var arr = ['a','b','c','d'];
arr.forEach(function(item,index,arr){
  //item表示数组中的每一项，index标识当前项的下标，arr表示当前数组
    console.log(item);
    console.log(index);
    console.log(arr);
    console.log(this);
},123);
//这里的123参数，表示函数中的this指向，可写可不写，如果不写，则this指向window

arr.map(function(item,index,arr){
  //参数含义同forEach
  console.log(item);
  console.log(index);
  console.log(arr);
  console.log(this);
},123);
```

运行之后，可以看出两者参数没有任何的区别，除此之外两者之间还有一个特性，
就是不能停止里面的遍历，除非程序报错，那么两者之间的区别在那里呢？？？

在于返回值！

```js
var a = arr.forEach(function(item,index,arr){　
    return 123
});

var b = arr.map(function(item,index,arr){
    return 123
});　

console.log(a);    //undefined
console.log(b);    //[123,123,123,123]
```

- `forEach()`返回值是 `undefined`，不可以链式调用。
- `map()`返回一个新数组，原数组不会改变。
- 没有办法终止或者跳出`forEach()`循环，除非抛出异常，所以想执行一个数组是否满足什么条件，返回布尔值，可以用一般的for循环实现，或者用`Array.every()`或者`Array.some()`;




我们可以利用`map` 的这个特性做哪些事情呢，比如

```js
var b = arr.map(function(item,index,arr){
    return item+'a';
});　

console.log(b); //["aa", "ba", "ca", "da"]
```

## 一个笔试题

```js
["1", "2", "3"].map(parseInt);  //结果  [1, NaN, NaN]　　
```

如果想得到 `[1, 2,3]` 应该这么做

```js
function returnInt(element){
  return parseInt(element,10);
}
 
["1", "2", "3"].map(returnInt);
```

这主要是因为　`parseInt()`默认有两个参数，第二个参数是进制数。
当`parsrInt`没有传入参数的时候，而`map()`中的回调函数时候，会给它传三个参数，第二个参数就是索引，明显不正确，所以返回`NaN`了。
