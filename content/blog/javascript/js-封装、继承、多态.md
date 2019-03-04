---
title: JS 封装、继承、多态
date: 2019-03-04 14:03:17
category: javascript
---

面向对象的编程语言中有类的概念，而JS是基于对象的语言，JS中没有类，
但是JS可以模拟面向对象的思想编程，JS通过构造函数模拟类的概念。

>> **封装：** 一系列属性放在对象中或者一系列实现某种功能的方法放在对象，就是封装。
>> **继承：** 继承属于类与类之间的关系，JS通过构造函数模拟类，通过原型来实现继承，继承的目的是为了实现数据共享。
>> **多态：** 一个对象有不同的行为，或者同一个行为针对不同的对象，产生不同的结果，要想有多态，就要先有继承，JS中可以模拟多态。


### JS 继承方式

1. 借用构造函数继承：构造函数的名字.call( 当前对象，属性，属性....)

> 解决了属性继承问题，但是不能继承父级的方法。　　

```js
function Person(name,age){
    this.name = name;
    this.age = age;
}

function Student(name,age,score) {
    Person.call(this,name,age);
    this.score = score;
}

const ZanJS = new Student('zanjs'，'18'，'100');
```

2. 组合继承：原型继承 + 借用构造函数继承

```js
function Person(name,age){
    this.name = name;
    this.age = age;
}

Person.prototype.introduce = function(){
    console.log('hello,everybody,my name is ' + this.name);
}

function Student(name,age,score) {
    Person.call(this,name,age)；
    this.score = score;
}

Student.prototype = new Person();
const ZanJS = new Student('zanjs'，'18'，'100');
```

3. 寄生组合继承：寄生式继承 + 借用构造函数继承　


```js
function inheritObject(o){
    function F(){};
    F.prototype = o;
    return new F();
}
function inheritPrototype(subclass,superclass){
    let p = inheritObject(superclass.prototype);
    p.constructor = subclass;
    subclass.prototype = p;
}

//定义父类
function SuperClass(name){
    this.name = name;
    this.colors = [red,blue]
}
SuperClass.prototype.getName = function(){
    console.log(this.name);
}    
//定义子类
function SubClass(name,time){
    //构造函数式继承
    SuperClass.call(this,name);
    this.time = time;
}
//寄生式继承父类原型
inheritPrototype(SubClass,SuperClass);
//子类新增原型方法
SubClass.prototype.getTime = function(){
    console.log(this.time);
}

```

4. 模拟多继承

```js
Object.prototype.mix = function(){
    let i = 0,                //从第一个参数起为被继承对象
        len = arguments.length,   //获取参数长度
        arg;                  //缓存参数对象
    for(;i < len; i++){
        //缓存当前对象
        arg = arguments[i];
        for(let property in arg){
            this[property] = arg[property];
        }
    }
}
```