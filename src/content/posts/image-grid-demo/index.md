---
title: "图片画廊网格：语法与完整示例"
published: 2026-07-13
description: "一份关于图片画廊网格语法、参数、裁剪、响应式行为、图注与灯箱导航的完整指南。"
tags: [Markdown, 画廊, 图片网格, Demo]
category: "示例"
lang: zh_CN
draft: false
---

`:::grid` 是本博客的图片画廊容器指令。它会把普通的 Markdown 图片排布为统一宽高比的响应式网格，并自动启用灯箱预览。适合用于文章配图、截图、作品集或小型相册。

同一画廊中的图片使用相同的卡片比例。默认采用居中裁剪填满每张卡片，让每一行都保持整齐；点击图片即可在灯箱中查看完整原图。每个画廊拥有独立的灯箱分组，不会与文章中的其他图片混在一起。

> 本文既是功能文档，也是可视化测试页。请分别在桌面、平板与手机宽度下查看示例，再点击任意图片来验证灯箱分组行为。

## 最小语法

在 `:::grid` 与闭合的 `:::` 之间直接书写 Markdown 图片：

````markdown
:::grid
![Image description](./image-1.webp)

![Image description](./image-2.webp)
:::
````

每张图片必须独占一个段落，图片之间留空行。画廊中只放图片；段落、列表与代码块请写在容器之外。

以下是最小语法的效果。在不带任何参数时，网格默认使用三列、`16/10` 比例与 `cover` 模式。

:::grid
![Minimal syntax result: first image](./landscape-1.webp)

![Minimal syntax result: second image](./landscape-2.webp)
:::

## 参数速览

在开始指令之后用花括号书写全部参数：`:::grid{parameter="value"}`。

| 参数 | 允许的值 | 默认值 | 用途 |
| --- | --- | --- | --- |
| `columns` | 从 `1` 到 `6` 的整数 | `3` | 桌面端每行的列数。无效值会回退到 `3`。 |
| `aspect` | 正比例，例如 `16/9`、`3/4` 或 `1/1` | `16/10` | 卡片的显示比例，而非原图比例。 |
| `fit` | `cover`、`contain` | `cover` | 图片的适配模式。`cover` 会裁剪以填满卡片；`contain` 保留完整图片，可能会留下空白。 |

完整示例：

````markdown
:::grid{columns="3" aspect="16/9" fit="cover"}
![First image](./image-1.webp "Optional caption")

![Second image](./image-2.webp "Optional caption")

![Third image](./image-3.webp "Optional caption")
:::
````

下面这个效果使用了上文的三列横图语法。请对比卡片比例、列数，以及标题优先于 alt 文本成为图注的规则：

:::grid{columns="3" aspect="16/9" fit="cover"}
![Parameter example: first landscape image](./landscape-1.webp "Landscape caption 1")

![Parameter example: second landscape image](./landscape-2.webp "Landscape caption 2")

![Parameter example: third landscape image](./landscape-3.webp "Landscape caption 3")
:::

## 图注与 Alt 文本

图片的 alt 文本既是无障碍替代文本，也是默认的图注。当图片带有可选的 title（标题）时，则会改用 title 作为图注：

```markdown
![Text used for accessibility](./image.webp "Caption shown below the image")
```

同一行内，图注会与每张卡片的底部对齐。某条图注换行时，不会让其他卡片悬浮在参差不齐的高度上。类似 `3:4`、`16:9` 的比例文字可以直接写在正文、标题与 alt 文本中，无需转义。

本示例演示默认的 alt 文本图注、显式 title 图注，以及较长图注的底部对齐：

:::grid{columns="3" aspect="1/1"}
![This image has no title, so its alt text is the caption](./square-1.webp)

![Second square image with accessible alt text](./square-2.webp "This title is displayed as the caption")

![Accessible description of a 3:4 poster](./square-3.webp "This is a longer caption for checking that every caption remains aligned to the bottom of its card when it wraps")
:::

## 布局与裁剪

桌面布局使用 `columns` 指定的列数。低于 `768px` 时，网格最多两列；低于 `480px` 时切换为一列。卡片容器固定 `aspect` 比例并裁切圆角，图片填满卡片，且不带主题默认的图片外边距。

- 选择 `cover`：这是推荐的默认模式。图片从中心向外裁剪以填满卡片，让画廊整体观感一致。
- 选择 `contain`：显示完整原图而不裁剪。当图片比例与卡片不同时，会露出主题背景；适合不能裁剪的图片。
- 若希望在无空白的情况下保留完整图片，可将 `aspect` 设为接近原图的比例，或把图片单独放进一个网格。

以下示例把同一组竖图分别放进 `cover` 与 `contain` 的 `16/9` 卡片中。前者对图片进行了裁剪；后者保留完整图片并留下背景空白。

````markdown
:::grid{columns="3" aspect="16/9" fit="cover"}
![Image description](./image-1.webp "Optional caption")

![Image description](./image-2.webp "Optional caption")
:::

:::grid{columns="3" aspect="16/9" fit="contain"}
![Image description](./image-1.webp "Optional caption")

![Image description](./image-2.webp "Optional caption")
:::
````

:::grid{columns="3" aspect="16/9" fit="cover"}
![First cover result](./default-portrait-1.webp "Cover: center crop")

![Second cover result](./default-portrait-2.webp "Cover: fill the card")

![Third cover result](./default-portrait-3.webp "Cover: a more consistent layout")
:::

:::grid{columns="3" aspect="16/9" fit="contain"}
![First contain result](./default-portrait-1.webp "Contain: preserve the complete original")

![Second contain result](./default-portrait-2.webp "Contain: empty space may appear")

![Third contain result](./default-portrait-3.webp "Contain: suitable for edge details")
:::

## 默认配置

不带任何属性时，默认使用三列、`16/10` 比例与 `cover` 裁剪。下面这三张竖图用于验证默认裁剪与图注。

````markdown
:::grid
![Image description](./image-1.webp)

![Image description](./image-2.webp)

![Image description](./image-3.webp)
:::
````

:::grid
![Default configuration: portrait image one](./default-portrait-1.webp)

![Default configuration: portrait image two](./default-portrait-2.webp)

![Default configuration: portrait image three](./default-portrait-3.webp)
:::

## 三列竖图：3:4

使用 `aspect="3/4"` 时，三张竖图会填满比例一致的竖向卡片。如果原图比例不同，`cover` 会从中心向外裁剪其边缘。

````markdown
:::grid{columns="3" aspect="3/4"}
![Portrait image description](./portrait-1.webp)

![Portrait image description](./portrait-2.webp)

![Portrait image description](./portrait-3.webp)
:::
````

:::grid{columns="3" aspect="3/4"}
![3:4 test image one](./default-portrait-1.webp "Portrait 1")

![3:4 test image two](./default-portrait-2.webp "Portrait 2")

![3:4 test image three](./default-portrait-3.webp "Portrait 3")
:::

## 三列横图：16:9

这组图片展示三列布局中常见的视频封面比例。当横图与卡片比例接近时，裁剪幅度最小。

````markdown
:::grid{columns="3" aspect="16/9"}
![Landscape image description](./landscape-1.webp)

![Landscape image description](./landscape-2.webp)

![Landscape image description](./landscape-3.webp)
:::
````

:::grid{columns="3" aspect="16/9"}
![16:9 test image one](./feature-landscape-1.webp)

![16:9 test image two](./feature-landscape-2.webp)

![16:9 test image three](./feature-landscape-3.webp)
:::

## 两列方形图：1:1

当需要更大的预览卡片时，两列布局效果很好。第三张图片会移到下一行。最后一行保持网格轨道的宽度，而不是拉伸图片去填满整行。

````markdown
:::grid{columns="2" aspect="1/1"}
![Square image description](./square-1.webp)

![Square image description](./square-2.webp)

![Square image description](./square-3.webp)
:::
````

:::grid{columns="2" aspect="1/1"}
![1:1 test image one](./mixed-square-1.webp)

![1:1 test image two](./mixed-square-2.webp)

![1:1 test image three](./mixed-square-3.webp)
:::

## 四列加 `contain`

`fit="contain"` 不会裁剪原图。当图片比例与卡片比例不一致时，会露出主题背景。这是有意为之，并非布局问题。它同时验证了四列网格与相互独立的灯箱分组互不干扰。

````markdown
:::grid{columns="4" aspect="16/9" fit="contain"}
![Image description](./image-1.webp)

![Image description](./image-2.webp)

![Image description](./image-3.webp)
:::
````

:::grid{columns="4" aspect="16/9" fit="contain"}
![Contain: portrait image one](./default-portrait-1.webp)

![Contain: portrait image two](./default-portrait-2.webp)

![Contain: portrait image three](./default-portrait-3.webp)
:::

## 单列细节图

当图片需要更大的阅读尺寸时，单列布局更为合适。它无论在桌面、平板还是手机上始终保持单列，原图仍可在灯箱中查看。

````markdown
:::grid{columns="1" aspect="16/9"}
![Image description](./detail.webp)
:::
````

:::grid{columns="1" aspect="16/9"}
![Single-column test image](./feature-landscape-1.webp)
:::

## 稀疏五列布局

五列用于验证更高的列数支持。当只有三张图片时，最后一行保持左对齐，而不会拉伸图片。

````markdown
:::grid{columns="5" aspect="1/1"}
![Thumbnail description](./thumb-1.webp)

![Thumbnail description](./thumb-2.webp)

![Thumbnail description](./thumb-3.webp)
:::
````

:::grid{columns="5" aspect="1/1"}
![Five-column test image one](./mixed-square-1.webp)

![Five-column test image two](./mixed-square-2.webp)

![Five-column test image three](./mixed-square-3.webp)
:::

## 六列混合图片

六列是目前支持的最大列数。横图与竖图混排，可以检验 `cover` 裁剪、窄卡片上的图注，以及高密度的桌面布局。对于追求可读性的文章内容，通常两到四列更合适。

````markdown
:::grid{columns="6" aspect="1/1"}
![Image description](./image-1.webp)

![Image description](./image-2.webp)

![Image description](./image-3.webp)

![Image description](./image-4.webp)

![Image description](./image-5.webp)

![Image description](./image-6.webp)
:::
````

:::grid{columns="6" aspect="1/1"}
![Six-column test image one](./default-portrait-1.webp)

![Six-column test image two](./default-portrait-2.webp)

![Six-column test image three](./default-portrait-3.webp)

![Six-column test image four](./feature-landscape-1.webp)

![Six-column test image five](./feature-landscape-2.webp)

![Six-column test image six](./feature-landscape-3.webp)
:::

## 四列方形图：1:1

四张同比例的方形图是典型的四列布局。桌面端一行显示全部四张；平板端收为两列，移动端收为一列。

````markdown
:::grid{columns="4" aspect="1/1"}
![Square image description](./square-1.webp)

![Square image description](./square-2.webp)

![Square image description](./square-3.webp)

![Square image description](./square-4.webp)
:::
````

:::grid{columns="4" aspect="1/1"}
![Square image one](./square-1.webp)

![Square image two](./square-2.webp)

![Square image three](./square-3.webp)

![Square image four](./square-4.webp)
:::

## 六列横图：16:9

六列横图非常适合缩略图预览、作品集与截图索引。即便原图比例略有差异，`cover` 也能让每张 `16/9` 卡片保持一致的填满效果。

````markdown
:::grid{columns="6" aspect="16/9"}
![Landscape image description](./landscape-1.webp)

![Landscape image description](./landscape-2.webp)

![Landscape image description](./landscape-3.webp)

![Landscape image description](./landscape-4.webp)

![Landscape image description](./landscape-5.webp)

![Landscape image description](./landscape-6.webp)
:::
````

:::grid{columns="6" aspect="16/9"}
![Landscape image one](./landscape-1.webp)

![Landscape image two](./landscape-2.webp)

![Landscape image three](./landscape-3.webp)

![Landscape image four](./landscape-4.webp)

![Landscape image five](./landscape-5.webp)

![Landscape image six](./landscape-6.webp)
:::

## 三列竖图：3:4

这组六张竖图展示了人像、海报或手机截图的常见布局。图片排成两行三列，图注与底部对齐。

````markdown
:::grid{columns="3" aspect="3/4"}
![Portrait image description](./portrait-1.webp)

![Portrait image description](./portrait-2.webp)

![Portrait image description](./portrait-3.webp)

![Portrait image description](./portrait-4.webp)

![Portrait image description](./portrait-5.webp)

![Portrait image description](./portrait-6.webp)
:::
````

:::grid{columns="3" aspect="3/4"}
![Portrait image one](./portrait-1.webp)

![Portrait image two](./portrait-2.webp)

![Portrait image three](./portrait-3.webp)

![Portrait image four](./portrait-4.webp)

![Portrait image five](./portrait-5.webp)

![Portrait image six](./portrait-6.webp)
:::

## 边缘关键内容：`cover` 与灯箱

这些图片在靠近边缘处带有重要的文字或细节。`cover` 能保持网格整齐，但也可能裁掉这些边缘；点击图片即可在灯箱中查看未裁剪的原图。对边缘敏感的图片请使用清晰的图注，或改用下方的 `contain`。

````markdown
:::grid{columns="3" aspect="16/9" fit="cover"}
![Edge-critical content](./critical-1.webp "Open the lightbox to view the complete edge content")

![Edge-critical content](./critical-2.webp "Open the lightbox to view the complete edge content")

![Edge-critical content](./critical-3.webp "Open the lightbox to view the complete edge content")
:::
````

:::grid{columns="3" aspect="16/9" fit="cover"}
![First edge-critical image](./critical-1.webp "Open the lightbox to view the complete edge content")

![Second edge-critical image](./critical-2.webp "Open the lightbox to view the complete edge content")

![Third edge-critical image](./critical-3.webp "Open the lightbox to view the complete edge content")
:::

## 极端比例下的 `contain`

对于横幅、长截图及其他极端比例的图片，`contain` 会显示完整原图。与 `cover` 不同，它可能会露出主题背景，但绝不会裁剪内容。

````markdown
:::grid{columns="3" aspect="16/9" fit="contain"}
![Complete screenshot description](./wide-1.webp)

![Complete screenshot description](./wide-2.webp)

![Complete screenshot description](./wide-3.webp)
:::
````

:::grid{columns="3" aspect="16/9" fit="contain"}
![Extreme-ratio image one](./extreme-1.webp)

![Extreme-ratio image two](./extreme-2.webp)

![Extreme-ratio image three](./extreme-3.webp)
:::

## 透明图片

透明图片会透出卡片的主题背景。这个单列 `contain` 示例便于观察透明区域、原图边缘与灯箱行为。

````markdown
:::grid{columns="1" aspect="16/9" fit="contain"}
![Transparent image description](./transparent.webp)
:::
````

:::grid{columns="1" aspect="16/9" fit="contain"}
![Transparent-background test image](./transparent-1.webp)
:::

## 灯箱导航

点击网格中的任意图片即可打开 Fancybox 灯箱。在灯箱中可以缩放、旋转、进入全屏、查看缩略图，并用方向键切换。导航范围仅限当前的 `:::grid` 容器：例如，点击 "16:9 test image one" 只会打开该小节中的另外两张横图。

同一篇文章中普通的 Markdown 图片仍会被单独处理，不会并入任何画廊网格。

## 检查清单

1. 每个网格中的图片尺寸一致，图注位于卡片下方。
2. 图片在悬停时会轻微缩放；点击后可用键盘进行缩放、旋转与切换。
3. 点击 "16:9 test image one" 后，灯箱只会浏览该小节中的另外两张横图。
4. 低于 `768px` 时网格最多两列；低于 `480px` 时为一列。
5. "Four Columns with `contain`" 小节中的竖图完整可见，留有空白且不裁剪。
6. 五列与六列网格在宽屏下保持指定的列数，随后按响应式规则收为两列或一列。
