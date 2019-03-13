---
title: 为什么我用 JavaScript 来编写CSS
date: 2019-03-13 15:03:33
category: css
---

三年来，我设计的 `Web` 应用程序都没有使用 `.css` 文件。作为替代，我用 `JavaScript` 编写了所有的 `CSS`。

我知道你在想什么：“为什么有人会用 `JavaScript` 编写 `CSS` 呢？！” 这篇文章我就来解答这个问题。

## `CSS-in-JS` 长什么样


开发者们已经创建了不同风格的 [CSS-in-JS](https://github.com/michelebertoli/css-in-js)。迄今为止最受欢迎的，是我和他人共同开发的一个叫做 [styled-components](https://www.styled-components.com/) 的库，在 `GitHub` 上有超过 `20,000` 颗星。


如下是它与 `React` 一起使用的例子：

```jsx
import styled from 'styled-components'

const Title = styled.h1`
  color: palevioletred;
  font-size: 18px;
`

const App = () => (
  <Title>Hello World!</Title>
)

```

## 为什么我喜欢 CSS-in-JS？

主要是 `CSS-in-JS` 增强了我的信心。我可以在不产生任何意外后果的情况下，添加、更改和删除 `CSS`。我对组件样式的更改不会影响其他任何内容。
如果删除组件，我也会删除它的 CSS。不再是只增不减的样式表了！ ✨

**信心**：在不产生任何意外后果的情况下，添加、更改和删除 **CSS**，并避免无用代码。

**易维护**： 再也不需要寻找影响组件的 `CSS` 了。

尤其是我所在的团队从中获取了很大的信心。

我不能指望所有团队成员，特别是初级成员，对 `CSS` 有着百科全书般的理解。最重要的是，截止日期还可能会影响质量。

使用 `CSS-in-JS`，我们会自动避开 `CSS` 常见的坑，比如类名冲突和权重大战`（specificity wars）`。
这使我们的代码库整洁，并且开发更迅速。 😍

**提升的团队合作**：无论经验水平如何，都会避开 CSS 常见的坑，以保持代码库整洁，并且开发更迅速。

关于性能，`CSS-in-JS` 库跟踪我在页面上使用的组件，只将它们的样式注入 `DOM` 中。虽然我的 `.js` 包稍大，但我的用户下载了尽可能小的有效 `CSS` 内容，并避免了对 `.css` 文件的额外网络请求。

这导致交互时间稍微长一点，但是首次有效绘制却会快很多！

**高性能**：仅向用户发送关键 `CSS` 以快速进行首次绘制。

我还可以基于不同的状态`（variant="primary" vs variant="secondary"）`或全局主题轻松调整组件的样式。
当我动态更改该上下文时，该组件将自动应用正确的样式。 💅

**动态样式**：基于全局主题或不同状态设置组件样式。

`CSS-in-JS` 还提供 `CSS` 预处理器的所有重要功能。所有库都支持 `auto-prefixing`，`JavaScript` 原生提供了大多数其他功能，如 `mixins`（函数）和变量。