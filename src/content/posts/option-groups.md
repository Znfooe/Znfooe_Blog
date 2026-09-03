---
title: Markdown 选项组
published: 2026-08-28
description: 以紧凑、可同步的 M3E 选项组呈现相互等效的 Markdown 备选内容。
tags: [演示, Markdown, 标签页, Shirone]
category: 指南
lang: zh_CN
draft: false
---

选项组把等价的说明聚在一起，而不必重复周围的解释。每个选项都接受完整的块级 Markdown，同时选中的值可与同页的另一组保持同步。

## 选择包管理器

使用 `@tab:active` 选定初始选项。`#` 之后的后缀提供一个稳定的值，而不改变可见标题。

::: tabs#package-manager

@tab npm

使用 npm 安装该包：

```powershell
npm install astro
```

@tab:active **pnpm**#pnpm

使用 pnpm 安装该包：

```powershell
pnpm.cmd add astro
```

@tab Bun#bun

使用 Bun 安装该包：

```powershell
bun add astro
```

:::

## 运行项目

该组与上方共用 `package-manager` 这个 id。在上方选择某个选项，会更新下方对应的命令，并记住这一选择以便下次访问。

::: tabs#package-manager

@tab npm

```powershell
npm run dev
```

@tab pnpm

```powershell
pnpm.cmd dev
```

@tab Bun#bun

```powershell
bun run dev
```

:::

## 多种备选

较长的选项行保持单行显示，在窄屏上会在各自的导航区内滚动。

::: tabs

@tab 本地工作站

在开发某个功能时使用本地工具链。

@tab 托管预览环境

发布临时预览供他人审阅。

@tab 持续集成

对每次变更运行确定性校验。

@tab 生产环境部署

将已验证的构建产物提升到生产环境。

@tab 离线恢复工作流

当网络不可用时，从本地产物进行恢复。

:::

## 作者语法

````markdown
::: tabs#package-manager

@tab npm

Use npm instructions here.

@tab:active **pnpm**#pnpm

Use pnpm instructions here.

:::
````

每个组至少需要两个 `@tab` 小节，且每个小节都需要有正文内容，并用空行与标记分隔。无效或不完整的组会作为普通 Markdown 保持可读。
