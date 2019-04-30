---
title: IOC 编程思想
date: 2019-04-30 09:04:83
category: 编程思想
---


你有没有过这样一个经历，一个项目立项之时，什么模块化啊，什么抽象啊，什么解耦啊，什么可复用组件啊什么的，哪个高端用哪个，可是项目发展到中期，随着模块的增加，什么可复用，能用就行，什么模块化，载入就行，久而久之，项目越来越大，随之也越来越臃肿，越来越难以维护，改一处看似简单的模块，却发现八杆子打不着的地方居然也被影响了，真真是写时一时爽，维护时更加爽！

那项目大了，维护成了难题，如何优化呢，怎么解决呢！

## IOC (InversionofControl 控制反转)

看英文缩写，是不是有点高大上，其实这个理念在后端是非常常见的，而前端很少涉及到。不过现代前端也可以在项目中实践了，而且很契合。

### 三个准则

- 高层次的模块不应该依赖于低层次的模块，它们都应该依赖于抽象
- 抽象不应该依赖于具体实现，具体实现应该依赖于抽象
- 面向接口编程而不是面向实现编程

### 一个案例

放着这些个准则不说，先用我们熟悉的macbook来案例来说明下吧！

我们都知道，mac电脑里面都是一个个模块组合成的，换算成代码就是这样样子的：

```js
// screen.ts
export default class Screen {
  name = "Retina";
}

// cpu.ts
export default class Cpu {
  name = "i5";
}

// battery
// 电池模式，普通模式，低电量，高电量
type TMode = "normal" | "low" | "high";
export default class Battery {
  mode: string;
  constructor(option: { mode: TMode } = { mode: "normal" }) {
    this.mode = option.mode;
  }
}


// mac.ts

import Screen from "./screen";
import Cpu from "./cpu";
import Battery from "./battery";

export default class MacBook {
  cpu: Cpu;
  screen: Screen;
  battery: Battery;
  constructor() {
    this.cpu = new Cpu();
    this.screen = new Screen();
    this.battery = new Battery();
  }
  start() {
    console.log(
      `your mac screen is battery mode is ${this.battery.mode}, screen is ${
        this.screen.name
      } and cpu is ${this.cpu.name}`
    );
  }
}


// index.ts

import MacBook from "./mac";

let mac = new MacBook();

mac.start();
```

首先建立一个`index.ts`启动文件，mac壳子 mac.ts，它内部有三个模块，cpu ，screen 和 battery ，这个三个属性分别引用的是文件外的模块。

代码这样写，其实没有什么问题的，执行 index 就能看到结果，查看到这个mac类的配置，那么，如果说我要设置mac电池配置 mode 为低电量，那么我就不得不去 mac.ts 主模块里修改电池的配置。

```js
this.battery = new Battery({mode: "low"});
```

这样改，其实是没有什么问题的，但是，mac其中的一个模块修改了，为什么壳子 mac.ts 这个文件也要跟着动呢，而且这个壳子里有mac所有的模块依赖，之前测试通过了，这次修改了，能不能保证一定没有出错呢，所以这次的模块改动就是我上面说到的问题，那如何改动呢？


#### 第一次优化

```js
// mac.ts

import Screen from "./screen";
import Cpu from "./cpu";
import Battery from "./battery";

interface IMac {
  cpu: Cpu;
  screen: Screen;
  battery: Battery;
}

export default class MacBook {
  cpu: Cpu;
  screen: Screen;
  battery: Battery;
  constructor(option: IMac) {
    this.cpu = option.cpu;
    this.screen = option.screen;
    this.battery = option.battery;
  }
  start() {
    console.log(
      `your mac screen is battery mode is ${this.battery.mode}, screen is ${
        this.screen.name
      } and cpu is ${this.cpu.name}`
    );
  }
}


// index.ts

import MacBook from "./mac";
import Battery from "./battery";
import Cpu from "./cpu";
import Screen from "./screen";

let mac = new MacBook({
  cpu: new Cpu(),
  screen: new Screen(),
  battery: new Battery()
});

mac.start();
```

将模块的依赖全都放在了启动文件 index.ts 处，无论模块如何改动，壳子模块 mac.ts 是不是都不用改了，模块之间的耦合度也降低了。

简单来说，`mac.ts` 是高层模块，`battery.ts` 是底层模块，优化之前 mac.ts 依赖了 battery.ts ，是不是违背了 IOC 的第一条准则呢，优化后的代码是将高层次的模块所需要的依赖通过参数传递到模块内部，这个方法有一个专业术语 - 依赖注入（Dependency Injection）。

**所需要传入的参数类型 IMac 就是所定义的抽象，壳子模块 mac.ts 就是依赖了这个抽象，而这个抽象也没有依赖于某个具体的实现。**

那么问题又来了，如果我想给这个mac实例再增加一个触摸板模块 touchpad.ts 呢，是不是又要修改壳子模块 mac.ts 了，难道新增一个就要修改一次，就没有一个通用方案么？


#### 第二次优化

```js
// mac.ts

type IModule<T> = T | T[];

export default class MacBook {
  private modules: any[];

  use<T>(module: IModule<T>) {
    Array.isArray(module)
      ? module.map(item => this.use(item))
      : this.modules.push(module);
    return this;
  }

  start() {
    console.log(this.modules);
  }
}


// index.ts

import MacBook from "./mac";
import Battery from "./battery";
import Cpu from "./cpu";
import Screen from "./screen";
import Touchpad from "./touchpad";

let mac = new MacBook();

mac
  .use(new Cpu())
  .use(new Screen())
  .use([new Battery({mode: "high"}), new Touchpad()])
  .start();
```

模仿 `koa` 载入模块的 `use` 方法，可以链式，这样壳子模块 mac.ts 就完全与低层次模块解藕了，无论mac新增多少个模块它都不会发生修改。`mac.ts` 内部已经看不到什么业务代码了，所有的配置都放在了最外层，即便修改添加也及其方便。

#### 第三次优化

那么问题又来了，mac.ts 对模块可是有要求的，不是任何一个牌子的模块就能安装到我的mac上，得按照一定的标准是执行，也就是依照一定的 约定，这也就是第三个准册，面向接口编程而不是面向实现编程，下面就用代码来展示这个准则：

```ts
// mac.ts
type IModule<T> = T | T[];

export default class MacBook {
  private modules: any[] = [];

  use<T>(module: IModule<T>) {
    Array.isArray(module)
      ? module.map(item => this.use(item))
      : this.modules.push(module);
    return this;
  }

  start() {
    this.modules.map(
      module =>
        module.init && typeof module.init === "function" && module.init()
    );
  }
}
```

在 `mac.ts` 的启动方法中，我们看到了，对接的模块内部，一定要有一个 init 属性，且这个属性一定是一个可执行方法，那么所对接的模块要如何处理呢：

```ts
// cpu.ts
export default class Cpu {
  name = "i5";
  init() {
    console.log(`${this.name} start`);
  }
}
```

类似于这样的，要对接这个壳子，就必须在模块内部实现一个init方法，这样这个模块才能在壳子内部起作用。

`init` 方法对于 `mac.ts` 来说，只是一个抽象方法，一个约定的接口，将实现交给了所来对接的各个模块，这不就是 面向接口编程 而不要面向实现编程 最好的诠释么！

## 总结

其实在 `IOC` 的术语中，`mac.ts` 更应该称作为 容器(Container) ，上面称它为壳子比较贴近现实好理解，它跟业务实现其实没有太大的关联，仅仅是做一些初始化的操作，所以壳子不应该随着它所依赖的模块的改变也跟着改变。
所以就需要一种 IOC 的编程思想去优化它，依赖注入只是这种思想的一种实现。

最后说一句，思想才是提高编程的最佳手段，而不是学习怎么用框架！