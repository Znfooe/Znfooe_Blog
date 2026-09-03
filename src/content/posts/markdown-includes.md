---
title: "Markdown 文件引入"
published: 2026-08-28
description: "构建时引入 Markdown 文件及其安全切片。"
tags: [Markdown, Shirone]
category: 指南
draft: false
---

Shirone 可以引入一个本地 Markdown 文件，或该文件的某个安全切片。

<!-- @include: src/content/snippets/include-example.md#public-api -->

同时也支持完整文件与行号区间的写法：

```markdown
<!-- @include: src/content/snippets/include-example.md -->
<!-- @include: src/content/snippets/include-example.md{1-4} -->
<!-- @include: src/content/snippets/include-example.md{5-} -->
<!-- @include: src/content/snippets/include-example.md{-4} -->
```

位于代码围栏内部的引入注释仍会以字面形式保留。
