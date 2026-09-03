---
title: 内容标注
published: 2026-08-27
description: 在不打断阅读节奏的前提下，为 Shirone 文章添加紧凑、可访问的补充注释。
tags: [演示, Markdown, 标注, Shirone]
category: 指南
lang: zh_CN
draft: false
---

内容标注把补充性说明贴近某一句话，却又不直接插入阅读主线。点击小小的注释标记即可展开其中的内容。

## 基本语法

在普通行文中添加一个 `[+label]` 引用，然后在同一篇文章的别处定义与之匹配的注释。

```markdown
Astro renders most of a page ahead of time and hydrates **interactive islands** [+islands] only when they need to become interactive.

[+islands]:
  An island is an interactive UI component surrounded by static HTML. This keeps the default page lightweight while preserving focused interactivity.
```

Astro 会在构建阶段预先渲染页面的大部分内容，并且只在需要交互时才水合这些**交互式岛屿（interactive islands）**[+islands]。

[+islands]:
  岛屿是被静态 HTML 环绕的交互式 UI 组件。这样既让页面默认保持轻量，又保留了聚焦的交互能力。

## 富内容

定义里可以包含段落、强调、链接、列表与行内代码 [+rich-note]，而周围的句子仍能正常继续。

[+rich-note]:
  **写作指引**

  - 让第一句话自成一体、表述完整。
  - 当读者可能需要一手来源时，附上链接。
  - 尽量使用简洁的示例，例如 `client:visible`。

  完整的机制模型参见 [Astro 岛屿文档](https://docs.astro.build/en/concepts/islands/)。

## 多重定义

可以重复使用同一个标签 [+review]，把一小组相关的注释呈现在同一个标记之后。

[+review]: 从那个能改变读者下一步行动的结论说起。
[+review]: 把实现依据与背景信息分开叙述。
[+review]: 删掉那些应属于正文而不是注释的细节。

未定义的引用（如 `[+missing]`）会保持为普通文本，因此未完成的定义永远不会产生一个空控件。
