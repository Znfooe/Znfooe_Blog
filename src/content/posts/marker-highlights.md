---
title: Markdown 标记高亮
published: 2026-08-28
description: 在 Shirone Markdown 中，用基于令牌（token）的标记语法高亮关键短语。
tags: [演示, Markdown, 排版, Shirone]
category: 指南
lang: zh_CN
draft: false
---

标记高亮可以让某个特定短语更醒目，而无需把所在段落改造成独立组件。构建时它们会渲染为原生 `<mark>` 元素，并继承当前 M3E 色彩体系。

## 默认强调

当强调应由文章的主色来承载时，请使用 `==text==`。当读者需要继续阅读一段普通文字时，用这种写法来标出 ==读者应当记住的一个决定== 会很有用。

当短语需要更强的层级结构时，标记中可以包含 ==嵌套的 **Markdown 强调**==。

## 语义化颜色

当含义需要不同的色调角色时，请使用后缀。可用的变体为 `primary`、`secondary`、`tertiary`、`error` 和 `tip`。

- ==Primary 将短语与当前主题联系起来=={.primary}
- ==Secondary 让辅助性的区分保持低调=={.secondary}
- ==Tertiary 补充独立的编辑信号=={.tertiary}
- ==Error 标识需要修正的状况=={.error}
- ==Tip 突出实用的指导建议=={.tip}

## 作者语法

```markdown
==Primary marker==

==Secondary marker=={.secondary}
==Tertiary marker=={.tertiary}
==Error marker=={.error}
==Tip marker=={.tip}
```

`==literal marker syntax==` 之类的行内代码以及围栏示例保持字面原样，这样文档既能解释语法，又不会触发它。
