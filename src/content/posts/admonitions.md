---
title: Markdown 提示框
published: 2026-08-27
description: 使用 Shirone 的 M3E Markdown 容器呈现注释、警告与可选折叠详情。
tags: [演示, Markdown, 提示框, Shirone]
category: 指南
lang: zh_CN
draft: false
---

提示框（Admonition）让辅助信息在视觉上保持区分度，同时不破坏文章的阅读节奏。每种形态都在服务器端渲染，并使用同一套紧凑的 M3E 组件。

## 语义化变体

::: note 部署场景
带空格的写法可接受一个纯文本的自定义标题，同时与参考语法保持兼容。
:::

:::info
信息块适合放置中性的背景说明，帮助读者理解所在小节的上下文。
:::

:::tip[既有的 **label** 语法]
原始的方括号标签依旧可用，并且可包含行内的 Markdown 强调。
:::

> [!IMPORTANT]
> GitHub Alert 语法会进入同一个渲染器，让既有文章保持统一的视觉语言。

:::warning
在运行生产构建之前，请检查环境变量。
:::

:::caution
请勿将凭据、本地配置或私钥随示例一起发布。
:::

## 可选折叠区

::: details 查看完整命令
该折叠区使用原生浏览器语义，无需客户端 JavaScript 也能通过键盘访问。

```powershell
npx.cmd astro check
pnpm.cmd build
```

- 它默认处于收起状态。
- 较长的代码可在其自身的代码块内部滚动。
- 在窄屏上，容器仍保持在文章宽度之内。
:::

## 作者语法

```markdown
:::note[Existing title syntax]
Content
:::

::: warning Plume-compatible title syntax
Content
:::

> [!TIP]
> GitHub Alert syntax

::: details Optional content
Hidden until the reader opens it.
:::
```
