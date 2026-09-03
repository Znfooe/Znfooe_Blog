---
title: Mermaid 图表集锦
published: 2024-05-02
description: 汇集流程、交互、数据模型、计划与项目历史等多种 Mermaid 图表演示。
tags: [演示, 示例, Markdown, Mermaid]
category: 示例
lang: zh_CN
draft: false
---

Mermaid 能将 Markdown 中的文字描述转换为图表。下面的示例借助 Shirone 的内容工作流，展示了技术文章和项目笔记中常见的各类图表。

## 流程图

流程图用于描述某个过程，包括判断分支，以及回到上一步的路径。

```mermaid
flowchart TD
    accTitle: Article publishing workflow
    accDescr: An article moves through writing, validation, preview, and build before publication. Failed validation returns it for revision.
    Draft[Write Markdown] --> Check{Validation passed?}
    Check -->|No| Revise[Revise article]
    Revise --> Check
    Check -->|Yes| Preview[Preview locally]
    Preview --> Build[Build static page]
    Build --> Publish[Publish]
```

## 时序图

时序图按时间顺序展示参与者之间的协作。本示例跟踪了一次 Swup 页面导航，从发起请求到最终由 Mermaid 完成渲染。

```mermaid
sequenceDiagram
    accTitle: Diagram rendering after in-site navigation
    accDescr: A reader starts navigation, Swup replaces the article content, and the Mermaid renderer enhances diagrams on the new page.
    actor Reader
    participant Browser
    participant Swup
    participant Content as Article region
    participant Renderer as Mermaid renderer
    Reader->>Browser: Open another article
    Browser->>Swup: Start in-site navigation
    Swup->>Content: Replace page content
    Swup-->>Renderer: Emit content:replace
    Renderer->>Content: Find Mermaid containers
    Renderer-->>Browser: Insert themed SVGs
```

## 实体关系图

实体关系图用于为结构化数据建模，展示作者、文章、标签与评论之间的关联关系。

```mermaid
erDiagram
    accTitle: Blog content relationships
    accDescr: Authors write posts, posts receive comments, and join records connect posts to multiple tags.
    AUTHOR ||--o{ POST : writes
    POST ||--o{ COMMENT : receives
    POST ||--o{ POST_TAG : classified_by
    TAG ||--o{ POST_TAG : groups
    AUTHOR {
        string id PK
        string display_name
    }
    POST {
        string slug PK
        string title
        datetime published_at
        string author_id FK
    }
    COMMENT {
        string id PK
        string post_slug FK
        string body
    }
    TAG {
        string id PK
        string label
    }
    POST_TAG {
        string post_slug FK
        string tag_id FK
    }
```

## 类图

类图用于表达软件设计中各类的职责、公开方法以及依赖方向。

```mermaid
classDiagram
    accTitle: Markdown rendering modules
    accDescr: The content pipeline uses a Mermaid plugin to create fallback markup, which the client renderer later enhances into an SVG.
    class ContentPipeline {
        +render(markdown)
        +collectMetadata()
    }
    class MermaidPlugin {
        +transform(codeFence)
        +createFallback()
    }
    class DiagramRenderer {
        +initialize()
        +renderAll()
        +refreshTheme()
    }
    class ThemeTokens {
        +primary
        +surface
        +outline
    }
    ContentPipeline --> MermaidPlugin : uses
    DiagramRenderer --> MermaidPlugin : enhances output
    DiagramRenderer --> ThemeTokens : reads
```

## 状态图

状态图用于呈现对象的生命周期，以及驱动它在不同状态间流转的事件。

```mermaid
stateDiagram-v2
    accTitle: Article lifecycle
    accDescr: An article moves from draft to review and publication. It may return for revision or eventually be archived.
    [*] --> Draft
    Draft --> InReview : submit
    InReview --> Draft : request changes
    InReview --> Published : approve
    Published --> Draft : retract
    Published --> Archived : archive
    Archived --> [*]
```

## XY 图表

XY 图表将柱状图与折线图结合在同一坐标轴上，便于比较数值与趋势。

```mermaid
xychart-beta
    accTitle: Six weeks of content performance
    accDescr: Bars show normalized weekly publishing volume, while the line shows normalized reading completion.
    title "Six weeks of content performance"
    x-axis "Week" [1, 2, 3, 4, 5, 6]
    y-axis "Relative score" 0 --> 100
    bar [36, 52, 44, 68, 76, 84]
    line [48, 55, 62, 61, 73, 81]
```

## 饼图

饼图以紧凑的方式直观比较各分类在整体中的占比。

```mermaid
pie showData
    accTitle: Article topics by share
    accDescr: Engineering accounts for forty percent, design systems for twenty-five percent, and the remainder is split between guides and essays.
    title Article topics by share
    "Engineering" : 40
    "Design systems" : 25
    "Guides" : 20
    "Essays" : 15
```

## 甘特图

甘特图将任务、依赖关系和里程碑沿日历时间线排列展示。

```mermaid
gantt
    accTitle: Theme release plan
    accDescr: The release plan moves from requirements and interaction design through component development, testing, and release.
    title Theme release plan
    dateFormat YYYY-MM-DD
    axisFormat %m/%d
    section Design
    Confirm requirements :done, brief, 2024-05-06, 2d
    Refine interactions :done, interaction, after brief, 3d
    section Implementation
    Develop components :active, components, after interaction, 6d
    Write examples :examples, after interaction, 4d
    section Validation
    Automated tests :tests, after components, 3d
    Release :milestone, release, after tests, 0d
```

## 思维导图

思维导图围绕一个中心主题展开，扩展出相关的领域与支撑性概念。

```mermaid
mindmap
  root((Shirone))
    Content experience
      Markdown
      Search
      Diagrams
    Interface system
      M3E tokens
      Responsive layout
      Color schemes
    Engineering quality
      Astro Check
      Playwright
      Accessibility
```

## 时间线

时间线用于概述重要的事件或阶段，无需提供精确的日历时长。

```mermaid
timeline
    title Mermaid support evolution
    Pipeline design : Detect Mermaid fences
                    : Preserve source fallback
    Client enhancement : Load the runtime on demand
                       : Apply theme tokens
    Reliability : Support Swup navigation
                : Verify responsive and accessible output
```

## 用户旅程图

用户旅程图将某个任务各阶段中的操作、参与方与体验评分整合在一起。

```mermaid
journey
    accTitle: A reader understanding a technical article
    accDescr: The reader discovers an article, combines prose with diagrams to understand it, and then explores related topics.
    title A reader understanding a technical article
    section Discover
      Browse the article list: 4: Reader
      Choose a topic: 5: Reader
    section Understand
      Read the article: 4: Reader
      Inspect a relationship diagram: 5: Reader
    section Continue
      Open a related article: 4: Reader
      Bookmark the page: 3: Reader
```

## Git 图

Git 图展示一个功能分支在被合并回主干之前，工作是如何逐步推进的。

```mermaid
gitGraph
    accTitle: Mermaid feature branch history
    accDescr: A feature branch adds the renderer and tests before merging into the main branch for release.
    commit id: "base"
    branch mermaid
    checkout mermaid
    commit id: "add-renderer"
    commit id: "add-tests"
    checkout main
    merge mermaid id: "merge-mermaid"
    commit id: "release"
```

## 看板

看板按工作流状态对任务进行分组，让当前进度一目了然。

```mermaid
kanban
  backlog[Backlog]
    docs[Write author documentation]
    examples[Expand example data]
  active[In progress]
    themes[Verify theme adaptation]
  complete[Complete]
    fallback[Source fallback]
    rendering[Client rendering]
```

## 桑基图

桑基图通过连线的宽度来表现流量或其他数值在各节点之间的流动。

```mermaid
sankey-beta
Landing,Reading,720
Discovery,Reading,430
Reading,Explore,360
Reading,Topics,210
Reading,Outbound,140
```

以上每个示例都使用标准的 `mermaid` 代码围栏。服务端会保留可读的源代码标记，浏览器再将其增强为跟随当前主题的 SVG。当主题切换，或通过 Swup 导航回到本文时，图表都会重新渲染。
