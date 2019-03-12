---
title: JavaScript 中的高阶函数
date: 2019-03-12 13:03:42
category: javascript
---

## 定义

高阶函数是指至少满足下列条件之一的函数：

- 函数可以作为参数被传递；
- 函数可以作为返回值输出。

`JavaScript` 语言中的函数显然满足高阶函数的条件，在实际开发中，无论是将函数当作参数传递，还是让函数的执行结果返回另外一个函数，
这两种情形都有很多应用场景。

要完全理解高阶函数这个概念， 首先必须了解函数式编程以及一等函数`（First-Class Functions）`的概念。

## 什么是函数式编程

在大多数简单的术语中，函数式是一种编程形式，你可以将函数作为参数传递给其他函数，并将它们作为值返回。 在函数式编程中，我们以函数的形式思考和编程。

`JavaScript`，`Haskell`，`Clojure`，`Scala` 和 `Erlang` 是部分实现了函数式编程的语言。

## 一等函数

如果你在学习 `JavaScript`，你可能听说过 `JavaScript` 将函数视为一等公民。 那是因为在 `JavaScript` 及其他函数式编程语言中，**函数是对象**。


在 `JavaScript` 中，函数是一种特殊类型的对象。 它们是 `Function objects`。例如：

为了证明 `JavaScript` 中函数是对象，我们可以这样做：

```js
function greeting() {
  console.log('hello word')
}

greeting();
```

为了证明 `JavaScript` 中函数是对象，我们可以这样做：

```js
greeting.lang = 'china';
console.log(greeting.lang)
```

**注意** - 虽然这在 `JavaScript` 中完全有效，但这被认为是 `harmful` 的做法。 你不应该向函数对象添加随机属性，如果不得不这样做，请使用对象。

在 `JavaScript` 中，你对其他类型（如对象，字符串或数字）执行的所有操作都可以对函数执行。 你可以将它们作为参数传递给其他函数（回调函数），将它们分配给变量并传递它们等等。这就是 `JavaScript` 中的函数被称为一等函数的原因。

**将函数赋值给变量**

我们可以在 `JavaScript` 中将函数赋值给变量。

```js
const square = function(x) {
  return (x * x)
}

square(5)
```

我们也可以传递给他们：

```js
const foo = square;
foo(6);
```


**将函数作为参数传递**


我们可以将函数作为参数传递给其他函数。 例如：

```js
function formaGreeting(){
  console.log('Are you read')
}
function casualGreeting() {
  console.log('what up')
}

function greet(type, greetFormal, greetCasual){
  if (type === 'formal') {
    greetFormal()
  } else (type === 'casual') {
    greetCasual()
  }
}

greet('casual',formaGreeting, casualGreeting)
```


既然我们已经知道一等函数是什么了，那就让我们开始学习 `JavaScript` 中的高阶函数叭


## 高阶函数

高阶函数是对其他函数进行操作的函数，操作可以是将它们作为参数，或者是返回它们。
简单来说，高阶函数是一个接收函数作为参数或将函数作为输出返回的函数。

例如，`Array.prototype.map`，`Array.prototype.filter` 和 `Array.prototype.reduce` 是语言中内置的一些高阶函数。

## 动手实践高阶函数

让我们看看一些内置高阶函数的例子，看看它与不使用高阶函数的方案对比如何。

**`Array.prototype.map`**

`map()` 方法通过调用对输入数组中每个元素调用回调函数来创建一个新数组。

`map()` 方法将获取回调函数中的每个返回值，并使用这些值创建一个新数组。

传递给 `map()` 方法的回调函数接受 `3` 个参数：`element`，`index` 和 `array`。

### 例 1：

假设我们有一个数字数组，我们想要创建一个新数组，其中包含第一个数组中每个值的两倍。 让我们看看如何使用和不使用高阶函数来解决问题。

#### 不使用高阶函数

```js
const a1 = [1,2,3]
const a2 = []
for (let i=0; i < a1.length; i++) {
  a2.push(a1[i] * 2)
}
console.log(a2)
```

#### 使用高阶函数 map

```js
const a1 = [1,2,3]
const a2 = a1.map(function(item) {
  return item * 2
})

console.log(a2)
```

使用箭头函数语法将更简短：

```js
const a1 = [1,2,3]
const a2 = a1.map(item => item * 2)
console.log(a2)
```


### 例 2：

假设我们有一个包含不同人的出生年份的数组，我们想要创建一个包含其年龄的数组。 例如：

**不使用高阶函数**

```js
const persons = [
  {
    name: 'peter', age:  16
  },
  {
    name: 'mark', age:  18
  },
]

const fullAge = [];
for (let i= 0; i<persons.length; i++) {
  if(persons[i].age >= 18) {
    fullAge.push(persons[i])
  }
}
```


