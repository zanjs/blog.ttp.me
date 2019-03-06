---
title: 从__proto__和prototype来深入理解JS对象和原型链
date: 2019-03-06 11:03:26
category: javascript
---

## 象与原型链

`__proto__` 和 `prototype`

### __proto__


引用《JavaScript权威指南》的一段描述：

>> Every JavaScript object has a second JavaScript object (or null ,but this is rare) associated with it. This second object is known as a prototype, and the first object inherits properties from the prototype.

翻译出来就是每个JS对象一定对应一个原型对象，并从原型对象继承属性和方法。好啦，既然有这么一个原型对象，那么对象怎么和它对应的？


对象 `__proto__` 属性的值就是它所对应的原型对象: 

```js
var one = {x: 1};
var two = new Object();
one.__proto__ === Object.prototype // true
two.__proto__ === Object.prototype // true
one.toString === one.__proto__.toString // true
```

上面的代码应该已经足够解释清楚 `__proto__` 了, 好吧，显然还不够，或者说带来了新的问题：
Object.prototype 是什么？ 凭什么说one和two的原型就是 `Object.prototype` ？

### prototype

首先来说说 `prototype` 属性, 不像每个对象都有 `__proto__` 属性来标识自己所继承的原型,
只有函数才有 `prototype` 属性。

为什么只有函数才有 `prototype` 属性？ES规范就这么定的。

其实函数在`JS` 中真的很特殊，是所谓的_一等公民_。

`JS` 不像其它面向对象的语言，它没有类（`class`，`ES6` 引进了这个关键字，但更多是语法糖）的概念。
`JS` 通过函数来模拟类。

当你创建函数时，`JS`会为这个函数自动添加 `prototype` 属性，值是一个有 `constructor` 属性的对象，不是空对象。

而一旦你把这个函数当作构造函数（`constructor`）调用（即通过`new`关键字调用）, 那么`JS`就会帮你创建该构造函数的实例、
实例继承构造函数 `prototype` 的所有属性和方法 （实例通过设置自己的 `__proto__` 指向承构造函数的 `prototype` 来实现这种继承）。
