---
title: delete 操作符
date: 2019-03-05 09:03:97
category: javascript
---

`delete` 操作符用于删除对象的某个属性；如果没有指向这个属性的引用，那它最终会被释放。


```js
const Employee = {
  firstname: "John",
  lastname: "Doe"
}

console.log(Employee.firstname);
// expected output: "John"

delete Employee.firstname;

console.log(Employee.firstname);
// expected output: undefined
```

## 