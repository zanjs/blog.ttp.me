---
title: 深度解析 Vue 响应式原理
date: 2019-03-06 13:03:92
category: Vue
---

## Vue 初始化

在 `Vue` 的初始化中，会先对 `props` 和 `data` 进行初始化

```js
Vue.prototype._init = function(options?: Object) {
  // ...
  // 初始化 props 和 data
  initState(vm)
  initProvide(vm)
  callHook(vm, 'created')

  if (vm.$options.el) {
    // 挂载组件
    vm.$mount(vm.$options.el)
  }
}
```

接下来看下如何初始化 `props` 和 `data`

```js
export function initState(vm: Component) {
  // 初始化 props
  if (opts.props) initProps(vm, opts.props)
  if (opts.data) {
    // 初始化 data
    initData(vm)
  }
}
function initProps(vm: Component, propsOptions: Object) {
  const propsData = vm.$options.propsData || {}
  const props = (vm._props = {})
  // 缓存 key
  const keys = (vm.$options._propKeys = [])
  const isRoot = !vm.$parent
  // 非根组件的 props 不需要观测
  if (!isRoot) {
    toggleObserving(false)
  }
  for (const key in propsOptions) {
    keys.push(key)
    // 验证 prop
    const value = validateProp(key, propsOptions, propsData, vm)
    // 通过 defineProperty 函数实现双向绑定
    defineReactive(props, key, value)
    // 可以让 vm._props.x 通过 vm.x 访问
    if (!(key in vm)) {
      proxy(vm, `_props`, key)
    }
  }
  toggleObserving(true)
}

function initData(vm: Component) {
  let data = vm.$options.data
  data = vm._data = typeof data === 'function' ? getData(data, vm) : data || {}
  if (!isPlainObject(data)) {
    data = {}
    process.env.NODE_ENV !== 'production' &&
      warn(
        'data functions should return an object:\n' +
          'https://vuejs.org/v2/guide/components.html#data-Must-Be-a-Function',
        vm
      )
  }
  // proxy data on instance
  const keys = Object.keys(data)
  const props = vm.$options.props
  const methods = vm.$options.methods
  let i = keys.length
  while (i--) {
    const key = keys[i]
    if (props && hasOwn(props, key)) {
    } else if (!isReserved(key)) {
      // 可以让 vm._data.x 通过 vm.x 访问
      proxy(vm, `_data`, key)
    }
  }
  // 监听 data
  observe(data, true /* asRootData */)
}
export function observe(value: any, asRootData: ?boolean): Observer | void {
  // 如果 value 不是对象或者使 VNode 类型就返回
  if (!isObject(value) || value instanceof VNode) {
    return
  }
  let ob: Observer | void
  // 使用缓存的对象
  if (hasOwn(value, '__ob__') && value.__ob__ instanceof Observer) {
    ob = value.__ob__
  } else if (
    shouldObserve &&
    !isServerRendering() &&
    (Array.isArray(value) || isPlainObject(value)) &&
    Object.isExtensible(value) &&
    !value._isVue
  ) {
    // 创建一个监听者
    ob = new Observer(value)
  }
  if (asRootData && ob) {
    ob.vmCount++
  }
  return ob
}
export class Observer {
  value: any
  dep: Dep
  vmCount: number // number of vms that has this object as root $data

  constructor(value: any) {
    this.value = value
    this.dep = new Dep()
    this.vmCount = 0
    // 通过 defineProperty 为对象添加 __ob__ 属性，并且配置为不可枚举
    // 这样做的意义是对象遍历时不会遍历到 __ob__ 属性
    def(value, '__ob__', this)
    // 判断类型，不同的类型不同处理
    if (Array.isArray(value)) {
      // 判断数组是否有原型
      // 在该处重写数组的一些方法，因为 Object.defineProperty 函数
      // 对于数组的数据变化支持的不好，这部分内容会在下面讲到
      const augment = hasProto ? protoAugment : copyAugment
      augment(value, arrayMethods, arrayKeys)
      this.observeArray(value)
    } else {
      this.walk(value)
    }
  }
  // 遍历对象，通过 defineProperty 函数实现双向绑定
  walk(obj: Object) {
    const keys = Object.keys(obj)
    for (let i = 0; i < keys.length; i++) {
      defineReactive(obj, keys[i])
    }
  }
  // 遍历数组，对每一个元素进行观测
  observeArray(items: Array<any>) {
    for (let i = 0, l = items.length; i < l; i++) {
      observe(items[i])
    }
  }
}

```


## Object.defineProperty

无论是对象还是数组，需要实现双向绑定的话最终都会执行这个函数，
该函数可以监听到 `set` 和 `get` 的事件。

```js
export function defineReactive(
  obj: Object,
  key: string,
  val: any,
  customSetter?: ?Function,
  shallow?: boolean
) {
  // 创建依赖实例，通过闭包的方式让
  // set get 函数使用
  const dep = new Dep()
  // 获得属性对象
  const property = Object.getOwnPropertyDescriptor(obj, key)
  if (property && property.configurable === false) {
    return
  }

  // 获取自定义的 getter 和 setter
  const getter = property && property.get
  const setter = property && property.set
  if ((!getter || setter) && arguments.length === 2) {
    val = obj[key]
  }
  // 如果 val 是对象的话递归监听
  let childOb = !shallow && observe(val)
  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    // 拦截 getter，当取值时会触发该函数
    get: function reactiveGetter() {
      const value = getter ? getter.call(obj) : val
      // 进行依赖收集
      // 初始化时会在初始化渲染 Watcher 时访问到需要双向绑定的对象
      // 从而触发 get 函数
      if (Dep.target) {
        dep.depend()
        if (childOb) {
          childOb.dep.depend()
          if (Array.isArray(value)) {
            dependArray(value)
          }
        }
      }
      return value
    },
    // 拦截 setter，当赋值时会触发该函数
    set: function reactiveSetter(newVal) {
      const value = getter ? getter.call(obj) : val
      // 判断值是否发生变化
      if (newVal === value || (newVal !== newVal && value !== value)) {
        return
      }
      if (process.env.NODE_ENV !== 'production' && customSetter) {
        customSetter()
      }
      if (setter) {
        setter.call(obj, newVal)
      } else {
        val = newVal
      }
      // 如果新值是对象的话递归监听
      childOb = !shallow && observe(newVal)
      // 派发更新
      dep.notify()
    },
  })
}
```

在 `Object.defineProperty` 中自定义 `get` 和 `set` 函数，
并在 `get` 中进行依赖收集，在 `set` 中派发更新。接下来我们先看如何进行依赖收集。

## 依赖收集

依赖收集是通过 `Dep` 来实现的，但是也与 `Watcher` 息息相关

```js
export default class Dep {
  static target: ?Watcher;
  id: number;
  subs: Array<Watcher>;

  constructor () {
    this.id = uid++
    this.subs = []
  }
  // 添加观察者
  addSub (sub: Watcher) {
    this.subs.push(sub)
  }
  // 移除观察者
  removeSub (sub: Watcher) {
    remove(this.subs, sub)
  }

  depend () {
    if (Dep.target) {、
      // 调用 Watcher 的 addDep 函数
      Dep.target.addDep(this)
    }
  }
  // 派发更新
  notify () {
    const subs = this.subs.slice()
    for (let i = 0, l = subs.length; i < l; i++) {
      subs[i].update()
    }
  }
}
// 同一时间只有一个观察者使用，赋值观察者
Dep.target = null
```

对于 `Watcher` 来说，分为两种 `Watcher`，
分别为渲染 `Watcher` 和用户写的 `Watcher`。
渲染 `Watcher` 是在初始化中实例化的。

```js
export function mountComponent(
  vm: Component,
  el: ?Element,
  hydrating?: boolean
): Component {
  // ...
  let updateComponent
  if (process.env.NODE_ENV !== 'production' && config.performance && mark) {
  } else {
    // 组件渲染，该回调会在初始化和数据变化时调用
    updateComponent = () => {
      vm._update(vm._render(), hydrating)
    }
  }
  // 实例化渲染 Watcher
  new Watcher(
    vm,
    updateComponent,
    noop,
    {
      before() {
        if (vm._isMounted) {
          callHook(vm, 'beforeUpdate')
        }
      },
    },
    true /* isRenderWatcher */
  )
  return vm
}
```


接下来看一下 `Watcher` 的部分实现

```js
export default class Watcher {
  constructor(
    vm: Component,
    expOrFn: string | Function,
    cb: Function,
    options?: ?Object,
    isRenderWatcher?: boolean
  ) {
    // ...
    if (this.computed) {
      this.value = undefined
      this.dep = new Dep()
    } else {
      this.value = this.get()
    }
  }

  get() {
    // 该函数用于缓存 Watcher
    // 因为在组件含有嵌套组件的情况下，需要恢复父组件的 Watcher
    pushTarget(this)
    let value
    const vm = this.vm
    try {
      // 调用回调函数，也就是 updateComponent 函数
      // 在这个函数中会对需要双向绑定的对象求值，从而触发依赖收集
      value = this.getter.call(vm, vm)
    } catch (e) {
      if (this.user) {
        handleError(e, vm, `getter for watcher "${this.expression}"`)
      } else {
        throw e
      }
    } finally {
      // "touch" every property so they are all tracked as
      // dependencies for deep watching
      if (this.deep) {
        traverse(value)
      }
      // 恢复 Watcher
      popTarget()
      // 清理依赖，判断是否还需要某些依赖，不需要的清除
      // 这是为了性能优化
      this.cleanupDeps()
    }
    return value
  }
  // 在依赖收集中调用
  addDep(dep: Dep) {
    const id = dep.id
    if (!this.newDepIds.has(id)) {
      this.newDepIds.add(id)
      this.newDeps.push(dep)
      if (!this.depIds.has(id)) {
        // 调用 Dep 中的 addSub 函数
        // 将当前 Watcher push 进数组
        dep.addSub(this)
      }
    }
  }
}
export function pushTarget(_target: ?Watcher) {
  // 设置全局的 target
  if (Dep.target) targetStack.push(Dep.target)
  Dep.target = _target
}
export function popTarget() {
  Dep.target = targetStack.pop()
}
```

以上就是依赖收集的全过程。
核心流程是先对配置中的 `props 和 `data` 中的每一个值调用 `Obeject.defineProperty()` 来拦截 `set` 和 `get` 函数，
再在渲染 `Watcher` 中访问到模板中需要双向绑定的对象的值触发依赖收集。

## 派发更新

改变对象的数据时，会触发派发更新，调用 `Dep` 的 `notify` 函数

```js
notify () {
  // 执行 Watcher 的 update
  const subs = this.subs.slice()
  for (let i = 0, l = subs.length; i < l; i++) {
    subs[i].update()
  }
}
update () {
  if (this.computed) {
    // ...
  } else if (this.sync) {
    // ...
  } else {
  // 一般会进入这个条件
    queueWatcher(this)
  }
}
export function queueWatcher(watcher: Watcher) {
// 获得 id
  const id = watcher.id
  // 判断 Watcher 是否 push 过
  // 因为存在改变了多个数据，多个数据的 Watch 是同一个
  if (has[id] == null) {
    has[id] = true
    if (!flushing) {
    // 最初会进入这个条件
      queue.push(watcher)
    } else {
      // 在执行 flushSchedulerQueue 函数时，如果有新的派发更新会进入这里
      // 插入新的 watcher
      let i = queue.length - 1
      while (i > index && queue[i].id > watcher.id) {
        i--
      }
      queue.splice(i + 1, 0, watcher)
    }
    // 最初会进入这个条件
    if (!waiting) {
      waiting = true
      // 将所有 Watcher 统一放入 nextTick 调用
      // 因为每次派发更新都会引发渲染
      nextTick(flushSchedulerQueue)
    }
  }
}
function flushSchedulerQueue() {
  flushing = true
  let watcher, id

  // 根据 id 排序 watch，确保如下条件
  // 1. 组件更新从父到子
  // 2. 用户写的 Watch 先于渲染 Watch
  // 3. 如果在父组件 watch run 的时候有组件销毁了，这个 Watch 可以被跳过
  queue.sort((a, b) => a.id - b.id)

  // 不缓存队列长度，因为在遍历的过程中可能队列的长度发生变化
  for (index = 0; index < queue.length; index++) {
    watcher = queue[index]
    if (watcher.before) {
    // 执行 beforeUpdate 钩子函数
      watcher.before()
    }
    id = watcher.id
    has[id] = null
    // 在这里执行用户写的 Watch 的回调函数并且渲染组件
    watcher.run()
    // 判断无限循环
    // 比如在 watch 中又重新给对象赋值了，就会出现这个情况
    if (process.env.NODE_ENV !== 'production' && has[id] != null) {
      circular[id] = (circular[id] || 0) + 1
      if (circular[id] > MAX_UPDATE_COUNT) {
        warn(
          'You may have an infinite update loop ' +
            (watcher.user
              ? `in watcher with expression "${watcher.expression}"`
              : `in a component render function.`),
          watcher.vm
        )
        break
      }
    }
  }
    // ...
}
```


以上就是派发更新的全过程。
核心流程就是给对象赋值，触发 `set` 中的派发更新函数。将所有 `Watcher` 都放入 `nextTick` 中进行更新，
`nextTick` 回调中执行用户 `Watch` 的回调函数并且渲染组件。

## Object.defineProperty 的缺陷

以上已经分析完了 `Vue` 的响应式原理，接下来说一点 `Object.defineProperty` 中的缺陷。

如果通过下标方式修改数组数据或者给对象新增属性并不会触发组件的重新渲染,
因为 `Object.defineProperty` 不能拦截到这些操作，
更精确的来说，对于数组而言，大部分操作都是拦截不到的，只是 `Vue` 内部通过重写函数的方式解决了这个问题。

对于第一个问题，`Vue` 提供了一个 `API` 解决

```ts
export function set(target: Array<any> | Object, key: any, val: any): any {
  // 判断是否为数组且下标是否有效
  if (Array.isArray(target) && isValidArrayIndex(key)) {
    // 调用 splice 函数触发派发更新
    // 该函数已被重写
    target.length = Math.max(target.length, key)
    target.splice(key, 1, val)
    return val
  }
  // 判断 key 是否已经存在
  if (key in target && !(key in Object.prototype)) {
    target[key] = val
    return val
  }
  // const ob = (target: any).__ob__
  if (target._isVue || (ob && ob.vmCount)) {
    process.env.NODE_ENV !== 'production' &&
      warn(
        'Avoid adding reactive properties to a Vue instance or its root $data ' +
          'at runtime - declare it upfront in the data option.'
      )
    return val
  }
  // 如果对象不是响应式对象，就赋值返回
  if (!ob) {
    target[key] = val
    return val
  }
  // 进行双向绑定
  defineReactive(ob.value, key, val)
  // 手动派发更新
  ob.dep.notify()
  return val
}
```

对于数组而言，`Vue` 内部重写了以下函数实现派发更新

```js
// 获得数组原型
const arrayProto = Array.prototype
export const arrayMethods = Object.create(arrayProto)
// 重写以下函数
const methodsToPatch = [
  'push',
  'pop',
  'shift',
  'unshift',
  'splice',
  'sort',
  'reverse',
]
methodsToPatch.forEach(function(method) {
  // 缓存原生函数
  const original = arrayProto[method]
  // 重写函数
  def(arrayMethods, method, function mutator(...args) {
    // 先调用原生函数获得结果
    const result = original.apply(this, args)
    const ob = this.__ob__
    let inserted
    // 调用以下几个函数时，监听新数据
    switch (method) {
      case 'push':
      case 'unshift':
        inserted = args
        break
      case 'splice':
        inserted = args.slice(2)
        break
    }
    if (inserted) ob.observeArray(inserted)
    // 手动派发更新
    ob.dep.notify()
    return result
  })
})
```