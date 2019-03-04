---
title: javascript 的 instanceof 详解
date: 2019-03-04 17:03:43
category: javascript
---


`instanceof` 运算符用于测试构造函数的 `prototype` 属性是否出现在对象的原型链中的任何位置

#### 演示

`mycar` 属于 `Car` 类型的同时又属于 `Object` 类型

```js
function Car(make, model, year) {
  this.make = make;
  this.model = model;
  this.year = year;
}
let mycar = new Car("Honda", "Accord", 1998);
let a = mycar instanceof Car;    // 返回 true
let b = mycar instanceof Object; // 返回 true
```