---
title: Project Harness Builder
published: 2026-06-25
description: 面向大型长期项目的 AI 工程规范生成器：通过交互式问答，增量式生成 spec、ADR、设计令牌等完整工程规范体系。
tags: [AI Skill, 工程规范, 工具, 脚手架]
category: 工具
lang: zh_CN
draft: false
---

**Project Harness Builder** 是一个面向 AI 编程助手的工作流 Skill：当你从零启动一个大型长期项目时，它通过一轮轮交互式问答，帮你把整套工程规范体系（harness）搭建起来，避免"想到哪写到哪"的混乱开局。

## 它解决什么问题

大型项目的工程规范通常包括功能规格（spec）、架构决策记录（ADR）、技术栈总览、设计令牌、开发提示词等几十份文档。一次性让 AI 全生成，往往因为上下文过长导致后半段质量下降、甚至遗漏关键项。

Harness Builder 的核心思路是**增量式生成**：

- 每轮只问一件事，回答后**立即落盘**对应文档
- 文档写完后，后续轮次无需重复记忆前面的细节
- 从根本上规避上下文窗口溢出带来的质量滑坡

## 工作流程

整套流程分为两个阶段：

```text
Phase 1  增量问答与生成
  Round 1  项目基础        → 技术栈 / CONTEXT / spec 骨架
  Round 2  技术选型        → 架构、依赖、部署形态
  Round 3  交互与体验      → 设计令牌、动效、无障碍规范
  ...      （逐轮推进，共 51 项规范清单）

Phase 2  生成开发提示词
  产出「提示词」文件夹，供后续分段开发使用
```

## 使用方式

它被打包成一个标准 AI Skill，目录结构如下：

```text
project-harness-builder/
├── SKILL.md            # Skill 主入口（工作流定义）
├── checklist.md        # 大项目规范完整清单（51 项）
└── spec-templates.md   # 各类规范的模板结构
```

触发方式也遵循 Skill 的语义约定，例如对 AI 说"构建项目规范""初始化 harness""搭建工程框架"，即会启动交互式问答流程。

## 适用与不适用

:::tip 适用场景
从零启动的新项目、需要完整工程文档体系的长期项目、希望规范先行的大型协作项目。
:::

:::warning 不适用场景
已有完整规范体系的项目（运行会覆盖现有文件），以及小型、临时性脚本项目（属于过度工程化）。
:::

---

项目已开源，欢迎前往 GitHub 仓库查看完整工作流与模板：

[github.com/Znfooe/project-harness-builder](https://github.com/Znfooe/project-harness-builder)
