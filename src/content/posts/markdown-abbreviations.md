---
title: Markdown 缩写
published: 2026-08-28
description: 一次性定义常用缩写，让普通文章正文中始终能查到其完整含义。
tags: [演示, Markdown, 排版, Shirone]
category: 指南
lang: zh_CN
draft: false
---

缩写让技术写作保持简洁，同时为需要的读者保留完整的术语。已定义的术语会渲染为原生 `abbr` 元素，悬停时以及辅助技术中均可获取其含义。

## 实际语境

基于 SSR 优先的输出方式，让初始文档在 JavaScript 运行之前即可见。在衡量其阅读体验时，LCP 与 CLS 能揭示首批可见内容是否既快速又稳定。

缩写也可以出现在普通 Markdown 旁，例如 **SSR** 指南；但 `SSR` 之类的字面代码与 [LCP documentation](https://web.dev/articles/lcp) 这样的链接仍保持原样。

## 定义术语

可在同一 Markdown 文档的任意位置放置定义。它们不会渲染为可见段落，且只有该文章中匹配的术语才会获得这种语义化的缩写处理。

```markdown
*[SSR]: Server-Side Rendering
*[LCP]: Largest Contentful Paint
*[CLS]: Cumulative Layout Shift

SSR makes an HTML response available before client code runs.
```

*[SSR]: Server-Side Rendering
*[LCP]: Largest Contentful Paint
*[CLS]: Cumulative Layout Shift

## 编写边界

术语必须以字母或数字开头，且只能包含字母、数字、句点、下划线、加号和连字符。每个定义仅适用于当前文章；无效或重复的定义会作为普通 Markdown 处理，而不是静默地替换其他术语。
