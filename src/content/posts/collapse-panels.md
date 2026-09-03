---
title: Markdown 折叠面板
published: 2026-08-28
description: 将可选的 Markdown 内容归入紧凑、可访问的 M3E 折叠面板中。
tags: [演示, Markdown, 折叠, Shirone]
category: 指南
lang: zh_CN
draft: false
---

折叠面板把彼此相关的可选细节收拢在一个紧凑的分组里。标题与正文均支持行内及块级 Markdown，而原生的展开/收起（disclosure）语义让每个面板无需客户端 JavaScript 即可使用。

## 独立面板

默认情况下，各条目彼此独立展开。在标题前加 `:+` 前缀可让该项默认展开，加 `:-` 前缀则可在分组使用 `expand` 时保持该项收起。

::: collapse
- **环境要求**

  在安装软件包之前，请使用 Node.js 22 或更高版本，并启用 Corepack。

- :+ 安装依赖

  在仓库根目录运行工作区软件包命令。

  ```powershell
  pnpm.cmd install
  ```

- 校验命令

  在构建生产产物之前，先检查内容流水线。

  - `pnpm.cmd check:manifest`
  - `npx.cmd astro check`
:::

## 手风琴模式

当只希望同时展开一个答案时，可以添加 `accordion`。浏览器会直接把原生 disclosure 分组，因此展开另一项时会自动收起前一项，全程无需水合。

::: collapse accordion expand
- 这里的 `expand` 有什么作用？

  当没有任何条目带 `:+` 标记时，它会默认展开第一项。

- 标题里可以包含 Markdown 吗？

  可以。标题支持行内**强调**与 `代码`，而面板正文则支持完整的块级 Markdown。

- 在窄屏上会怎样？

  内容内边距会变得紧凑，长文本自动换行，内嵌代码则保留自身的横向滚动区域。
:::

## 写作语法

````markdown
::: collapse accordion
- :+ First title

  First panel content.

- Second title with `code`

  Second panel content.
:::
````

容器内必须恰好包含一个顶层无序列表。每个条目都需要一个标题段落、一个空行和正文内容。无效或混合的输入会退化为普通、可读的 Markdown 列表。
