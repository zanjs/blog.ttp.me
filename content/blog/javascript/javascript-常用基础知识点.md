---
title: javascript 常用基础知识点
date: 2019-03-04 17:03:52
category: javascript
---

## script 引入方式

- `html` 静态 `<script>`引入
- `js` 动态插入 `<script>`
- `<script defer>`: 异步加载，元素解析完成后执行
- `<script async>`: 异步加载，但执行时会阻塞元素渲染

## new 运算符的执行过程

- 新生成一个对象
- 链接到原型: obj.__proto__ = Con.prototype
- 绑定this: apply
- 返回新对象(如果构造函数有自己 retrun 时，则返回该值)


## [instanceof](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/instanceof) 原理

能在实例的 原型对象链 中找到该构造函数的 `prototype` 属性所指向的 原型对象，就返回 `true`。即:


```js
// __proto__: 代表原型对象链
instance.[__proto__...] === instance.constructor.prototype

// return true
```

`instanceof` 运算符用来检测 `constructor.prototype` 是否存在于参数 `object` 的原型链上。

```js
// 定义构造函数
function C(){} 
function D(){} 

let o = new C();

o instanceof C; // true，因为 Object.getPrototypeOf(o) === C.prototype

o instanceof D; // false，因为 D.prototype不在o的原型链上

o instanceof Object; // true,因为Object.prototype.isPrototypeOf(o)返回true
C.prototype instanceof Object // true,同上

C.prototype = {};
let o2 = new C();

o2 instanceof C; // true

o instanceof C; // false,C.prototype指向了一个空对象,这个空对象不在o的原型链上.

D.prototype = new C(); // 继承
let o3 = new D();
o3 instanceof D; // true
o3 instanceof C; // true 因为C.prototype现在在o3的原型链上
```


## 代码的复用

当你发现任何代码开始写第二遍时，就要开始考虑如何复用。一般有以下的方式:

- 函数封装
- 继承
- 复制 `extend`
- 混入 `mixin`
- 借用 `apply/call`

## 继承

在 `JS` 中，继承通常指的便是 原型链继承，也就是通过指定原型，并可以通过原型链继承原型上的属性或者方法。

- 最优化: 圣杯模式
```js
const inherit = (function(c,p){
	let F = function(){};
	return function(c,p){
		F.prototype = p.prototype;
		c.prototype = new F();
		c.uber = p.prototype;
		c.prototype.constructor = c;
	}
})();
```

- 使用 `ES6` 的语法糖 `class / extends`

## 类型转换

大家都知道 `JS` 中在使用运算符号或者对比符时，会自带隐式转换，规则如下:

- `-、*、/、%` ：一律转换成数值后计算
- `+` : 
  - 数字 + 字符串 = 字符串， 运算顺序是从左到右
  - 数字 + 对象， 优先调用对象的 `valueOf` -> `toString`
  - 数字 + `boolean/null` -> 数字
  - 数字 + `undefined` -> `NaN`


- `[1].toString() === '1'`
- `{}.toString() === '[object object]'`
- `NaN !== NaN 、+undefined 为 NaN`


## 类型判断

判断 `Target` 的类型, 单单用 `typeof` 并无法完全满足，这其实并不是 `bug`

本质原因是 `JS` 的万物皆对象的理论。因此要真正完美判断时，我们需要区分对待: