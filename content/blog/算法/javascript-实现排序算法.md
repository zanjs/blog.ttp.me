---
title: JavaScript 实现排序算法
date: 2019-03-11 10:03:45
category: 算法
---

将主要讲解以下十个经典排序算法

- 冒泡排序
- 选择排序
- 插入排序
- 归并排序
- 堆排序
- 快速排序
- 桶排序
- 基数排序
- 希尔排序
- 计数排序

## 开张

- 排序算法的稳定性： 排序前后两个相等的数相对位置不变，则算法稳定。
- **时间复杂度**: 简单的理解为一个算法执行所耗费的时间，一般使用大O符号表示法，详细解释见[时间复杂度](https://zh.wikipedia.org/wiki/%E6%97%B6%E9%97%B4%E5%A4%8D%E6%9D%82%E5%BA%A6)
- 空间复杂度: 运行完一个程序所需内存的大小。

### 常见算法的复杂度

![](./images/tem.webp)

以下算法最频繁的操作就是交换数组中两个元素的位置（按照正序或者是逆序），简单抽出一个函数如下：

```js
/**
 * 按照正序比较并交换数组中的两项
 *
 * @param {Array} ary
 * @param {*} x
 * @param {*} y
 */
function swap(ary, x, y) {
  if (x === y) return
  var temp = ary[x]
  ary[x] = ary[y]
  ary[y] = temp
}
```


## 冒泡排序（Bubble-Sort）

**冒泡排序**是一种简单的排序算法。
它重复地走访过要排序的数列，一次比较两个元素，如果他们的顺序错误就把他们交换过来。
走访数列的工作是重复地进行直到没有再需要交换，也就是说该数列已经排序完成。
这个算法的名字由来是因为越小的元素会经由交换慢慢“浮”到数列的顶端。

![](./images/Bubble-Sort.gif)

**算法步骤:** 假设我们最终需要的是依次递增的有序数组

1. 从数组的第一位开始，依次向后比较相邻元素的大小，如果前一个比后一个小，那么交换二者位置，直至数组末尾。
2. 下一轮比较的起始位置加1
3. 重复1~2，直至排序结束。

```js
function bubbleSort1(ary) {
  var l = ary.length
  for (var i = 0; i < l; i++) {
    for (var j = 0; j < l; j++) {
      if (ary[j] > ary[j + 1]) {
        swap(ary, j, j + 1)
      }
    }
  }
  return ary
}
```

> 优化： 上述排序对于一个长度为 `n` 的数组排序需要进行 `n * n` 次排序。（内外两层循环次数都是 n ） 可以预见到的是，每进行一轮冒泡，从数组末尾起有序部分长度就会加一，这就意味着数组末尾的有序数组进行比较的操作是无用的。

改进后的算法如下：

```js
function bubbleSort2(ary) {
  var l = ary.length
  for (var i = l - 1; i >= 0; i--) {
    // 优化的部分 arr[i]及之后的部分都是有序的
    for (var j = 0; j < i; j++) {
      if (ary[j] > ary[j + 1]) {
        swap(ary, j, j + 1)
      }
    }
  }
  return ary
}
```

优化后的代码如下：

```js
/**
 * 冒泡排序 优化
 *
 * @param {Array} ary
 * @returns
 */
function bubbleSort3(ary) {
  var l = ary.length
  var swapedFlag
  for (var i = l - 1; i >= 0; i--) {
    swapedFlag = false
    for (var j = 0; j < i; j++) {
      if (ary[j] > ary[j + 1]) {
        swapedFlag = true
        swap(ary, j, j + 1)
      }
    }
    if (!swapedFlag) {
      break
    }
  }
  return ary
}
```

## 选择排序（Selection-Sort）

![](./images/Selection-Sort.gif)

**选择排序**是先在数据中找出最大或最小的元素，放到序列的起始；
然后再从余下的数据中继续寻找最大或最小的元素，依次放到排序序列中，直到所有数据样本排序完成。

**复杂度分析：**
很显然，选择排序也是一个费时的排序算法，无论什么数据，都需要 `O(n*n)` 的时间复杂度，不适宜大量数据的排序。

**算法步骤：**

初始状态为`n`的无序区（数组）可经过`n-1`趟直接选择排序得到有序结果

- 初始状态：无序区为R[0..n]，有序区为空；
- 第i趟排序 `(i=0,1,2,3…n-1)` 开始时，当前有序区和无序区分别为 `R[0..i]和R(i+1..n）`。该趟排序从当前无序区中选出关键字最小的记录的位置(下标 minPos)，将 `R[minPos]` 与无序区的第1个记录 `R[i]` 交换，所以有序区长度加 1 无序区长度减 1 。然后进行 i 加 1 并进行下一趟排序。
- `n-1`趟结束，数组排序完成

```js
function selectSort(ary) {
  var l = ary.length
  var minPos
  for (var i = 0; i < l - 1; i++) {
    minPos = i
    for (var j = i + 1; j < l; j++) {
      if (ary[j] - ary[minPos] < 0) {
        minPos = j
      }
    }
    swap(ary, i, minPos)
  }
  return ary
}
```

## 插入排序（Insertion-Sort）

**插入排序**

是先将待排序序列的第一个元素看做一个有序序列，把第二个元素到最后一个元素当成是未排序序列；
然后从头到尾依次扫描未排序序列，将扫描到的每个元素插入有序序列的适当位置，
直到所有数据都完成排序；如果待插入的元素与有序序列中的某个元素相等，则将待插入元素插入到相等元素的后面。

![](./images/Insertion-Sort.gif)

注：动图对应的是最为原始的插入排序，没有在网上找到二分法对应的动图，大家见谅。

**算法步骤：**

- 从第一个元素开始，该元素可以认为已经被排序
- 取出下一个元素，在已经排序的元素序列中从后向前扫描
- 如果该元素（已排序）大于新元素，将该元素移到下一位置
- 重复步骤 `3`，直到找到已排序的元素小于或者等于新元素的位置
- 将新元素插入到该位置后
- 重复步骤 `2~5`

```js
function insertionSort1(arr) {
    var l = arr.length;
    var preIndex, current;
    for (var i = 1; i < l; i++) {
        preIndex = i - 1;
        current = arr[i];
        while (preIndex >= 0 && arr[preIndex] > current) {
            arr[preIndex + 1] = arr[preIndex];
            preIndex--;
        }
        arr[preIndex + 1] = current;
    }
    return arr;
}
```

**优化思路：**

- 二分法：即在将新增的数值插入到有序数组中时，通过二分法减少查找次数。
- 链表：将有序数组部分转为链表结构，那么插入的时间复杂度变为`O(1)`,查找复杂度变为`O(n)`（因为不方便使用二分法）
- 排序二叉树`（BST）`： 将有序数组部分转化为排序二叉树结构, 然后中序遍历该二叉树。利用排序二叉树可以兼顾插入方便以及查找的效率。但是需要占用额外空间。所以 `BST` 是比较平衡的一种思路， 也是空间换时间思路的体现。


#### 简单介绍下二分法

二分查找法，是一种在有序数组中查找某一特定元素的搜索算法。搜素过程从数组的中间元素开始，如果中间元素正好是要查找的元素，则搜素过程结束；如果某一特定元素大于或者小于中间元素，则在数组大于或小于中间元素的那一半中查找,而且跟开始一样从中间元素开始比较。如果在某一步骤数组为空，则代表找不到。这种搜索算法每一次比较都使搜索范围缩小一半。


使用二分法优化拆入排序的思路：

```js
/**
 * 插入排序
 *
 * @param {*} ary
 * @returns {Arrray} 排序完成的数组
 */
function insertSort2(ary) {
  return ary.reduce(insert, [])
}

/**
 * 使用二分法完成查找插值位置，并完成插值操作。
 * 时间复杂度 logN
 * @param {*} sortAry 有序数组部分
 * @param {*} val
 * @returns
 */
function insert(sortAry, val) {
  var l = sortAry.length
  if (l == 0) {
    sortAry.push(val)
    return sortAry
  }

  var i = 0,
    j = l,
    mid
  //先判断是否为极端值
  if (val < sortAry[i]) {
    return sortAry.unshift(val), sortAry
  }
  if (val >= sortAry[l - 1]) {
    return sortAry.push(val), sortAry
  }

  while (i < j) {
    mid = ((j + i) / 2) | 0
    //结束条件 等价于j - i ==1
    if (i == mid) {
      break
    }
    if (val < sortAry[mid]) {
      j = mid
    }
    if (val == sortAry[mid]) {
      i = mid
      break
    }
    //结束条件 统一c处理对外输出i
    if (val > sortAry[mid]) {
      i = mid
    }
  }
  var midArray = [val]
  var lastArray = sortAry.slice(i + 1)
  sortAry = sortAry
    .slice(0, i + 1)
    .concat(midArray)
    .concat(lastArray)
  return sortAry
}
```

## 归并排序（Merge-Sort）

**归并排序**

是利用归并的思想实现的排序方法，该算法采用经典的分治`（divide-and-conquer）`策略（分治法将问题分(`divide`)成一些小的问题然后递归求解，
而治(`conquer`)的阶段则将分的阶段得到的各答案"修补"在一起，即分而治之)。

**稳定性分析**

归并排序严格遵循从左到右或从右到左的顺序合并子数据序列, 它不会改变相同数据之间的相对顺序, 因此归并排序是一种稳定的排序算法.

**算法步骤**:

- 把长度为n的输入序列分成两个长度为n/2的子序列；
- 对这两个子序列分别采用归并排序；
- 将两个排序好的子序列合并成一个最终的排序序列。

```js
// 采用自上而下的递归方法
function mergeSort(ary) {
  if (ary.length < 2) {
    return ary.slice()
  }

  var mid = Math.floor(ary.length / 2)
  var left = mergeSort(ary.slice(0, mid))
  var right = mergeSort(ary.slice(mid))
  var result = []

  while (left.length && right.length) {
    if (left[0] <= right[0]) {
      result.push(left.shift())
    } else {
      result.push(right.shift())
    }
  }

  result.push(...left, ...right)

  return result
}

```

## 堆排序（Heapsort）

**堆排序**是指利用堆这种数据结构所设计的一种排序算法。
堆积结构具有如下特点：
即子结点的键值总是小于（或者大于）它的父节点，据此可分为以下两类：

- 最大堆：每个节点的值都大于或等于其子节点的值，在堆排序算法中用于升序排列；
- 最小堆：每个节点的值都小于或等于其子节点的值，在堆排序算法中用于降序排列；

**算法步骤：**

- 创建一个堆 `H[0……n-1]`；
- 把堆首（最大值）和堆尾互换；
- 把堆的尺寸缩小 1，并调用 reheap 方法重新聚堆，目的是把新的数组顶端数据调整到相应位置，重新变为最大堆。

```js
/**
 * 聚堆：将数组中的某一项作为堆顶，调整为最大堆。
 * 把在堆顶位置的一个可能不是堆，但左右子树都是堆的树调整成堆。
 *
 * @param {*} ary 待排序数组
 * @param {*} topIndex 当前处理的堆的堆顶
 * @param {*} [endIndex=ary.length - 1] 数组的末尾边界
 */
function reheap(ary, topIndex, endIndex = ary.length - 1) {
  if (topIndex > endIndex) {
    return
  }

  var largestIndex = topIndex
  var leftIndex = topIndex * 2 + 1
  var rightIndex = topIndex * 2 + 2

  if (leftIndex <= endIndex && ary[leftIndex] > ary[largestIndex]) {
    largestIndex = leftIndex
  }
  if (rightIndex <= endIndex && ary[rightIndex] > ary[largestIndex]) {
    largestIndex = rightIndex
  }

  if (largestIndex != topIndex) {
    swap(ary, largestIndex, topIndex)
    reheap(ary, largestIndex, endIndex)
  }
}

/**
 * 将数组调整为最大堆结构
 *
 * @param {*} ary
 * @returns
 */
function heapify(ary) {
  for (var i = ary.length - 1; i >= 0; i--) {
    reheap(ary, i)
  }
  return ary
}

/**
 * 堆排序
 *
 * @param {*} ary
 * @returns
 */
function heapSort(ary) {
  heapify(ary)
  for (var i = ary.length - 1; i >= 1; i--) {
    swap(ary, 0, i)
    reheap(ary, 0, i - 1)
  }
  return ary
}

```


## 快速排序 （Quicksort）

**快速排序**使用分治法策略来把一个数组分为两个子数组。首先从数组中挑出一个元素，并将这个元素称为「基准」，英文`pivot`。
重新排序数组，所有比基准值小的元素摆放在基准前面，所有比基准值大的元素摆在基准后面（相同的数可以到任何一边）。在这个分区结束之后，该基准就处于数组的中间位置。这个称为分区`（partition）`操作。之后，在子序列中继续重复这个方法，直到最后整个数据序列排序完成。


注意: 在 js 中实现快排中最耗费时间的就是交换，本例子中哨兵的元素是随机取得的，而上面动图中总是的取数组中的第一个值作为哨兵（pivot），那么考虑一种极限情况，在 `[9,8,7,6,5,4,3,2,1]` 重中例子中使用就地排序就算法复杂度就会变成 n*n。
本例中的哨兵是从数组中随机抽取的，个人认为比取首元素的方案更优。

应用： 取前K大元素、求中位数 

嗯，先整一个粗暴版本稍微了解下快排的基本思路：

```js
//快排粗暴版本
function quickSort1(ary) {
  if (ary.length < 2) {
    return ary.slice()
  }
  var pivot = ary[Math.floor(Math.random() * ary.length)]
  var left = []
  var middle = []
  var right = []
  for (var i = 0; i < ary.length; i++) {
    var val = ary[i]
    if (val < pivot) {
      left.push(val)
    }
    if (val === pivot) {
      middle.push(val)
    }
    if (val > pivot) {
      right.push(val)
    }
  }

  return quickSort1(left).concat(middle, quickSort(right))
}


```

这个是推荐掌握的，很重要（敲黑板）

**算法步骤**

- 从数列中挑出一个元素，称为 "哨兵"（pivot）；
- 重新排序数列，所有元素比哨兵值小的摆放在哨兵前面，所有元素比哨兵值大的摆在哨兵的后面（相同的数可以到任一边）。在这个分区退出之后，该哨兵就处于数列的中间位置。这个称为分区（partition）操作；
- 递归地把小于哨兵值元素的子数列和大于哨兵值元素的子数列排序。

```js
function quickSort2(ary, comparator = (a, b) => a - b) {
  return partition(ary, comparator)
}
function partition(ary, comparator, start = 0, end = ary.length - 1, ) {
  if (start >= end) {
    return
  }

  var pivotIndex = Math.floor(Math.random() * (end - start + 1) + start)
  var pivot = ary[pivotIndex]

  swap(ary, pivotIndex, end)

  for (var i = start - 1, j = start; j < end; j++) {
    if (comparator(ary[j], pivot) < 0) {
      i++
      swap(ary, i, j)
    }
  }

  swap(ary, i + 1, end)
  partition(ary, comparator, start, i)
  partition(ary, comparator, i + 2, end)
  return ary
}

```