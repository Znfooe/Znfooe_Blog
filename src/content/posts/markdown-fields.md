---
title: Markdown 字段卡片
description: API 与组件参数的文档卡片。
published: 2026-08-30
draft: true
---

当多个相关选项同属于某个 API 或组件时，可以使用 `field-group`。把字段名写在起始行，然后在描述文字之前添加元数据标记。

:::: field-group

::: field tex
@type object
@optional

TeX 解析器选项。
:::

::: field output
@type `'svg' | 'chtml'`
@default `'svg'`
@optional

输出格式，可以是 SVG 或通用 HTML。
:::

::::

## 基本字段

必填、可选与已弃用等状态可以在同一个分组中混用。默认值保持独立，方便快速浏览。

:::: field-group

::: field title
@type string
@required

组件的可见标题。该值会显示在页面标题中，应当足够简短，便于快速浏览。
:::

::: field disabled
@type boolean
@default `false`
@optional

控件是否以禁用状态启动。
:::

::: field locale
@type `'en' | 'zh-CN' | 'ja-JP'`
@default `'en'`
@optional

用于格式化日期、数字和无障碍标签的区域设置。
:::

::::

## 富描述

描述文字是普通的 Markdown。元数据行之后仍可正常使用链接、强调、列表与行内代码。

:::: field-group

::: field render
@type `(value: unknown) => string`
@required

把某个值渲染到最终输出中。该回调应返回一个**安全字符串**，并且可以使用 `formatValue` 辅助函数。

- 保持渲染结果具有确定性。
- 避免在回调内发起网络请求。
:::

::: field retries
@type number
@default `3`
@optional

在请求被判定为失败之前，最大尝试次数。
:::

::: field legacyMode
@type boolean
@deprecated

仅为向后兼容而保留。新的集成请改用 `compatibility`。
:::

::::

## 独立字段

在某个选项紧邻示例或代码块进行说明时，单个字段也可以不依赖分组直接使用。

::: field format
@type `'short' | 'long'`
@default `'short'`
@optional

控制结果的格式化方式。
:::

## 编写说明

- `@type` 与 `@default` 的值会被渲染为代码标记。
- `@required`、`@optional` 与 `@deprecated` 会添加状态徽章。
- 元数据之后的任意常规 Markdown 都会成为字段描述。
- 未知的 `@标记` 会作为描述文字保留可见，而不会被丢弃。
