---
title: function星号* 表达式
date: 2019-03-05 11:03:97
category: javascript
---


`function*` 关键字可以在表达式内部定义一个生成器函数。

```js
function* foo() {
  yield 'a';
  yield 'b';
  yield 'c';
}

var str = "";
for (let val of foo()) {
  str = str + val;
}

console.log(str);
// expected output: "abc"

```