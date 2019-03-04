---
title: 'JS 对象创建的几种方式'
date: 2019-03-04 12:03:01
category: javascript
---

1. new 操作符 + Object 创建对象

```js
const person = new Object();
person.name = "zanjs";
person.age = 18;
person.family = ["zanjs","tang","li"];
person.say = function(){
  console.log(this.name);
}
```

2. 字面式创建对象

```js
var person ={
    name: "zanjs",
    age: 18,
    family: ["zanjs","tang","li"],
    say: function(){
        console.log(this.name);
    }
};
```

以上两种方法在使用同一接口创建多个对象时, 会产生大量重复代码,
为了解决此问题，工厂模式被开发。


3. 工厂模式


```js
function createPerson(name,age,family) {
    const o = new Object();
    o.name = name;
    o.age = age;
    o.family = family;
    o.say = function(){
        console.log(this.name);
    }
    return o;
}

const person1 = createPerson("zanjs",21,["zanjs","tang","li"]);
//instanceof无法判断它是谁的实例，只能判断他是对象，构造函数都可以判断出

const person2 = createPerson("moqi",18,["moqi","xiaoqi","xiaoba"]);
console.log(person1 instanceof Object);
//true
```

> 解析:

工厂模式解决了重复实例化多个对象的问题, 但没有解决对象识别的问题,
工厂模式却无从识别对象的类型，因为全部都是Object，不像Date、Array等，本例中，得到的都是o对象，对象的类型都是Object，
因此出现了构造函数模式


4. 构造函数模式

```js
function Person(name,age,family) {
    this.name = name;
    this.age = age;
    this.family = family;
    this.say = function(){
        console.log(this.name);
    }
}
const person1 = new Person("zanjs",21,["zanjs","tang","li"]);
const person2 = new Person("moqi",18,["moqi","xiaoqi","xiaoba"]);
console.log(person1 instanceof Object); //true
console.log(person1 instanceof Person); //true
console.log(person2 instanceof Object); //true
console.log(person2 instanceof Person); //true
console.log(person1.constructor);      
//constructor 属性返回对创建此对象的数组、函数的引用
```

对比工厂模式有以下不同之处

- 没有显式地创建对象
- 直接将属性和方法赋给了 `this` 对象
- 没有 return 语句


以此方法调用构造函数步骤

- 创建一个新对象
- 将构造函数的作用域赋给新对象（将this指向这个新对象）
- 执行构造函数代码（为这个新对象添加属性）
- 返回新对象 ( 指针赋给变量 person* )

可以看出，构造函数知道自己从哪里来
（通过 `instanceof` 可以看出其既是 `Object` 的实例，又是 `Person` 的实例）

构造函数也有其缺陷, 每个实例都包含不同的Function实例,
（ 构造函数内的方法在做同一件事，但是实例化后却产生了不同的对象，方法是函数 ，函数也是对象）详情见构造函数详解

因此产生了原型模式

5. 原型模式


```js
function Person() {}

Person.prototype.name = "zanjs";
Person.prototype.age = 18;
Person.prototype.family = ["zanjs","tang","li"];
Person.prototype.say = function(){
    alert(this.name);
};
console.log(Person.prototype);
//Object{name: 'zanjs', age: 18, family: Array[3]}

const person1 = new Person();   
//创建一个实例person1
console.log(person1.name);
//zanjs

const person2 = new Person();
//创建实例person2
person2.name = "moqi";
person2.family = ["moqi","xiaoqi","xiaoba"];
console.log(person2);
//Person {name: "moqi", family: Array[3]}
// console.log(person2.prototype.name); //报错
console.log(person2.age);              //18
```

> 解析

原型模式的好处是所有对象实例共享它的属性和方法（即所谓的共有属性），
此外还可以如代码第16,17行那样设置实例自己的属性（方法）（即所谓的私有属性），可以覆盖原型对象上的同名属性（方法）。
具体参见原型模式详解。


6. 混合模式 （构造函数模式+原型模式）

构造函数模式用于定义实例属性，原型模式用于定义方法和共享的属性

```js
function Person(name,age,family){
    this.name = name;
    this.age = age;
    this.family = family;
}

Person.prototype = {
    constructor: Person,  
    // 每个函数都有prototype属性，指向该函数原型对象，原型对象都有constructor属性，
    // 这是一个指向prototype属性所在函数的指针
    say: function(){
        alert(this.name);
    }
}

const person1 = new Person("zanjs",18,["zanjs","tang","li"]);
console.log(person1);
const person2 = new Person("moqi",21,["moqi","xiaoqi","xiaoba"]);
console.log(person2);
```

可以看出，混合模式共享着对相同方法的引用，又保证了每个实例有自己的私有属性。
最大限度的节省了内存开销。



>> 高程中还提到了**动态原型模式**、**寄生构造函数模式**、**稳妥构造函数模式**。