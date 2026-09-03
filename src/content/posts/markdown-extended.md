---
title: Markdown 扩展功能
published: 2024-05-01
updated: 2024-11-29
description: '了解更多 Fuwari 中的 Markdown 功能'
image: ''
tags: [演示, 示例, Markdown, Fuwari]
category: '示例'
draft: false 
---

## GitHub 仓库卡片
你可以添加链接到 GitHub 仓库的动态卡片，页面加载时，仓库信息会从 GitHub API 拉取。

::github{repo="Fabrizz/MMM-OnSpotify"}

使用代码 `::github{repo="<owner>/<repo>"}` 创建 GitHub 仓库卡片。

```markdown
::github{repo="saicaca/fuwari"}
```

## Mermaid 图表

围栏 `mermaid` 代码块会被渲染成图表，并跟随当前配色方案显示。

```mermaid
flowchart LR
    accTitle: Markdown rendering pipeline
    accDescr: Markdown source is transformed into semantic HTML and then enhanced as a themed SVG diagram.
    A[Markdown source] --> B[Astro content pipeline]
    B --> C[Semantic HTML]
    C --> D[Themed diagram]
```

## 提示框（Admonitions）

支持以下类型的提示框：`note` `tip` `important` `warning` `caution`

:::note
用于突出显示用户应当留意（即使是快速略读时）的信息。
:::

:::tip
用于帮助用户更顺利地使用本产品的可选信息。
:::

:::important
用户要想成功所必不可少的关键信息。
:::

:::warning
因潜在风险而需要用户立即关注的关键内容。
:::

:::caution
某个操作可能带来的负面后果。
:::

### 基本语法

```markdown
:::note
Highlights information that users should take into account, even when skimming.
:::

:::tip
Optional information to help a user be more successful.
:::
```

### 自定义标题

提示框的标题可以自定义。

:::note[我的自定义标题]
这是一个带自定义标题的 note 提示框。
:::

```markdown
:::note[MY CUSTOM TITLE]
This is a note with a custom title.
:::
```

### GitHub 语法

> [!TIP]
> [GitHub 语法](https://github.com/orgs/community/discussions/16925)同样受支持。

```
> [!NOTE]
> The GitHub syntax is also supported.

> [!TIP]
> The GitHub syntax is also supported.
```

### 剧透内容

你可以为文本添加剧透遮挡。文本同样支持 **Markdown** 语法。

这句话的内容 :spoiler[被隐藏了 **诶嘿嘿**]！

```markdown
The content :spoiler[is hidden **ayyy**]!

```

## 图片宽度与标题

一张独立的图片可以在其 alt 文本中接受可选的 `w-N%` 宽度标记，并把 Markdown title 渲染为图片下方居中的说明文字：

![专辑示例图片 w-50%](/images/albums/AcgExample/07.webp "带说明的半宽图片")

```markdown
![Image description w-50%](./image.webp "Visible caption")
```

有效宽度范围为 `w-1%` 到 `w-100%`；无效的标记会保留在 alt 文本中。宽度与说明彼此独立——仅提供 title 也可以生成说明文字：

![专辑示例图片 w-75%](/images/albums/AcgExample/08.webp)

![专辑示例图片](/images/albums/AcgExample/09.webp "不带宽度标记的说明文字")
