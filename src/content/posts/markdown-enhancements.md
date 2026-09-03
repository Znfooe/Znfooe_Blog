---
title: Shirone Markdown 增强
published: 2026-08-19
pinned: true
description: 探索 Shirone 的自定义 Markdown 扩展、富有表现力的组件与写作语法。
tags: [演示, Markdown, 扩展, 主题, Shirone]
category: 指南
lang: zh_CN
draft: false
---

Shirone 提供了一批主题专属的 Markdown 扩展与自定义语法容器。这些扩展构建在我们原生的 unified AST 处理流水线之上，所有扩展都会在站点构建期渲染成可访问、语义化的 HTML，**零客户端 JavaScript 水合开销**，并且**与 M3E 设计令牌 100% 对齐**。

## 文件树

文件树能把多层级项目结构、源码层级关系以及终端输出的目录内容，变成紧凑的交互式树形视图，并自带扩展名图标、差异高亮与可折叠分支。

### 1. 嵌套列表语法（`:::file-tree`）

当你想直接用 Markdown 嵌套列表书写文件层级时，请使用 `:::file-tree` 块指令。

```markdown
:::file-tree{title="Shirone source tree"}
- src
  - components/
    - ++ Navigation.svelte # added component
    - -- Button.astro # removed component
  - content
    - posts/
      - markdown-enhancements.md
  - layouts/
    - PostLayout.astro
  - plugins
    - markdown/
      - rehype-file-tree.mjs
  - styles
    - markdown/
      - trees.css
  - **content.config.ts** # important file
- public/
  - favicon.svg
- package.json
:::
```

:::file-tree{title="Shirone source tree"}
- src
  - components/
    - ++ Navigation.svelte # added component
    - -- Button.astro # removed component
  - content
    - posts/
      - markdown-enhancements.md
  - layouts/
    - PostLayout.astro
  - plugins
    - markdown/
      - rehype-file-tree.mjs
  - styles
    - markdown/
      - trees.css
  - **content.config.ts** # important file
- public/
  - favicon.svg
- package.json
:::

#### 编写规则与标记

- **差异状态**：在条目前加 `++`（绿色背景并带徽章）或 `--`（红色背景加删除线），用于高亮改动。
- **注释**：`#` 之后的任意文本会渲染为弱化的、右对齐的行内注释。
- **强调**：用 `**粗体**` 包裹文件名，让关键文件获得醒目的视觉权重。
- **可折叠文件夹**：由嵌套列表项推断出的目录默认展开。添加尾部斜杠（如 `components/`）可创建折叠状态的目录，读者可通过点击或键盘导航将其展开。

---

### 2. 终端输出语法（```` ```file-tree ````）

当你已经拥有由 `tree` 之类的命令行工具生成的目录树文本时，可以直接把它粘贴到 `file-tree` 围栏代码块中。Unicode 分支字符（`├──`、`└──`、`│`）与 ASCII 分支均会被自动解析。

````markdown
```file-tree title="Build output" icon="simple"
dist
├── _astro/
│   ├── index.css
│   └── page.js
└── favicon.ico
```
````

```file-tree title="Build output" icon="simple"
dist
├── _astro/
│   ├── index.css
│   └── page.js
└── favicon.ico
```

#### 配置选项

- `title="string"`：为文件树设置自定义标题与无障碍标签。
- `icon="colored" | "simple"`：在多色扩展名图标（`colored`，默认）与极简单色图标（`simple`）之间选择。

---

## 代码树

交互式代码树把左侧的多级文件层级浏览面板与右侧的即时代码面板切换结合起来，为多文件示例、模块或整个目录的走读提供类似 IDE 的阅读体验。

### 1. 容器语法（`:::code-tree`）

在 `:::code-tree` 块指令中组合多个围栏代码块。每个代码块通过 `title="path/to/file"` 指定自身路径。

````markdown
:::code-tree{title="Shirone Component Demo" height="380px" entry="src/Button.svelte"}
```svelte title="src/Button.svelte"
<script lang="ts">
  let { label = "Click me" } = $props();
</script>

<button class="m3-btn">{label}</button>
```

```stylus title="src/styles/button.styl"
.m3-btn
  background: var(--primary)
  color: var(--on-primary)
  border-radius: var(--shape-corner-m)
```

```json title="package.json"
{
  "name": "button-demo",
  "version": "1.0.0"
}
```
:::
````

:::code-tree{title="Shirone Component Demo" height="380px" entry="src/Button.svelte"}
```svelte title="src/Button.svelte"
<script lang="ts">
  let { label = "Click me" } = $props();
</script>

<button class="m3-btn">{label}</button>
```

```stylus title="src/styles/button.styl"
.m3-btn
  background: var(--primary)
  color: var(--on-primary)
  border-radius: var(--shape-corner-m)
```

```json title="package.json"
{
  "name": "button-demo",
  "version": "1.0.0"
}
```
:::

#### 配置与标记

- `title="string"`：设置代码树的标题与无障碍标签。
- `height="string"`：设置桌面视图的高度（默认 `420px`，例如 `380px`、`26rem`）。
- `entry="filepath"`：指定首次加载时处于激活状态的文件。
- `icon="colored" | "simple"`：在彩色与极简单色文件图标之间切换。
- `:active`：在任意围栏代码块上放置 `:active`，即可将其指定为默认激活的标签页。

---

### 2. 本地目录自动导入（`@[code-tree]`）

直接指向工作区内任意本地目录路径，构建时会自动扫描并生成交互式代码树，无需手动复制文件内容。

```markdown
@[code-tree title="Anime Utilities" entry="status.ts"](/src/utils/anime)
```

@[code-tree title="Site Configuration" entry="siteConfig.ts"](/src/config)
