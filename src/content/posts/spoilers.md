---
title: Markdown 剧透内容
published: 2026-08-28
description: 在 Shirone Markdown 中隐藏行内答案，同时让剧透内容保持可访问。
tags: [演示, Markdown, 可访问性, Shirone]
category: 指南
lang: zh_CN
draft: false
---

剧透内容可以在不将文字从文档中删除的前提下，隐藏某个简短的答案或情节细节。将鼠标悬停、聚焦或激活原生控件，即可显示内容。

## 行内 details

答案是 :spoiler[**42**]，而这句话其余部分仍是普通的 Markdown。

剧透内容中可以包含 `inline code` 以及 :spoiler[带 **强调** 的较长细节]。

## 作者语法

```markdown
The answer is :spoiler[42].
```

生成的 HTML 使用带 `aria-expanded` 状态的原生按钮。在无 JavaScript 的情况下，悬停和聚焦仍可显示文字；可选的运行时脚本还会补充点击与键盘切换功能。
