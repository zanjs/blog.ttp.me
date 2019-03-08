---
title: 数组排序算法 sort
date: 2019-03-08 09:03:09
category: javascript
---

## 排序算法

排序也是程序员中经常用到的算法，
无论使用冒泡排序还是快速排序，
排序的核心是比较两个元素的大小。

如果是数字，我们可以直接比较，但如果是字符串或者两个对象呢？
直接比较数学上的大小是没有意义的，因此，比较的过程必须通过函数抽象出来。

通常规定，对于两个元素 `x` 和 `y`，
如果认为`x < y`，则返回 `-1`，如果认为`x == y`，则返回`0`，
如果认为`x > y`，则返回 `1`，这样，排序算法就不用关心具体的比较过程，而是根据比较结果直接排序。


`JavaScript`的 `Array` 的 `sort()`方法就是用于排序的，
但是排序结果可能让你大吃一惊：

```js
// 看上去正常的结果:
['Google', 'Apple', 'Microsoft'].sort(); // ['Apple', 'Google', 'Microsoft'];

// apple排在了最后:
['Google', 'apple', 'Microsoft'].sort(); // ['Google', 'Microsoft", 'apple']

// 无法理解的结果:
[10, 20, 1, 2].sort(); // [1, 10, 2, 20]

```

第二个排序把`apple`排在了最后，是因为字符串根据`ASCII` 码进行排序(根据字符串Unicode码点)，而小写字母`a`的`ASCII`码在大写字母之后。

第三个排序结果是什么鬼？简单的数字排序都能错？

这是因为`Array`的 `sort()` 方法默认把所有元素先转换为`String`再排序，结果'10'排在了'2'的前面，因为字符'1'比字符'2'的`ASCII`码小。

![](./images/douwo.png)

如果不知道`sort()`方法的默认排序规则，直接对数字排序，绝对栽进坑里！

幸运的是，`sort()`方法也是一个高阶函数，它还可以接收一个比较函数来实现自定义的排序。

要按数字大小排序，我们可以这么写：

```js
var arr = [10, 20, 1, 2];
arr.sort(function (x, y) {
    if (x < y) {
        return -1;
    }
    if (x > y) {
        return 1;
    }
    return 0;
});
console.log(arr); // [1, 2, 10, 20]

```

如果要倒序排序，我们可以把大的数放前面：

```js
var arr = [10, 20, 1, 2];
arr.sort(function (x, y) {
    if (x < y) {
        return 1;
    }
    if (x > y) {
        return -1;
    }
    return 0;
}); // [20, 10, 2, 1]
```

默认情况下，对字符串排序，是按照 `ASCII` 的大小比较的，
现在，我们提出排序应该忽略大小写，按照字母序排序。
要实现这个算法，不必对现有代码大加改动，只要我们能定义出忽略大小写的比较算法就可以：

```js
var arr = ['Google', 'apple', 'Microsoft'];
arr.sort(function (s1, s2) {
    x1 = s1.toUpperCase();
    x2 = s2.toUpperCase();
    if (x1 < x2) {
        return -1;
    }
    if (x1 > x2) {
        return 1;
    }
    return 0;
}); // ['apple', 'Google', 'Microsoft']
```

忽略大小写来比较两个字符串，实际上就是先把字符串都变成大写（或者都变成小写），再比较。

从上述例子可以看出，高阶函数的抽象能力是非常强大的，而且，核心代码可以保持得非常简洁。


最后友情提示，`sort()` 方法会直接对 `Array` 进行修改，它返回的结果仍是当前 `Array`：

```js
var a1 = ['B', 'A', 'C'];
var a2 = a1.sort();
a1; // ['A', 'B', 'C']
a2; // ['A', 'B', 'C']
a1 === a2; // true, a1和a2是同一对象
```

## 案例排序

### 按照数值的大小对数字进行排序

```js
function sortNumber(a,b)
{
    return a - b
}

var arr = new Array(6)
arr[0] = "10"
arr[1] = "5"
arr[2] = "40"
arr[3] = "25"
arr[4] = "1000"
arr[5] = "1"

arr.sort(sortNumber)
```

### 升序排列

```js
function sortNumber(a,b)
{
    return a - b
}
```

### 降序排列

```js
function sortNumber(a,b)
{
    return b - a
}
```

### 组对象中的某个属性值进行排序

`sort` 方法接收一个函数作为参数，这里嵌套一层函数用来接收对象属性名
其他部分代码与正常使用`sort`方法相同。

```js
var arr = [
    {name:'zopp',age:0},
    {name:'gpp',age:18},
    {name:'yjj',age:8}
];

function compare(property){
    return function(a,b){
        var value1 = a[property];
        var value2 = b[property];
        return value1 - value2;
    }
}

console.log(arr.sort(compare('age')))
```

如何根据参数不同，来确定是升序排列，还是降序排序呢？

```js
sortBy: function(attr,rev){
    //第二个参数没有传递 默认升序排列
    if(rev ==  undefined){
        rev = 1;
    }else{
        rev = (rev) ? 1 : -1;
    }
    return function(a,b){
        a = a[attr];
        b = b[attr];
        if(a < b){
            return rev * -1;
        }
        if(a > b){
            return rev * 1;
        }
        return 0;
    }
}
```

使用方式：

```js
newArray.sort(sortBy('number',false)) 
```


`V8` 引擎 `sort` 函数只给出了两种排序 
`InsertionSort` 和 `QuickSort`，数量小于10的数组使用 `InsertionSort`，
比10大的数组则使用 `QuickSort`。

