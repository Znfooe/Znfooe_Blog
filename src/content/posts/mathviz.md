---
title: 数学之美 · MathViz
published: 2026-09-04
description: 交互式数学可视化平台：65+ 数学实验，参数实时调控、全屏演示与 AI 语音讲解，面向课堂教学与自主探索。
tags: [React, 数学可视化, 教育, Plotly]
category: Web
lang: zh_CN
draft: false
---

**数学之美 · MathViz** 是一个面向课堂教学与自主探索的交互式数学实验平台：把抽象的数学概念，全部变成可以亲手调参、实时变化的图形与动画。

## 目标人群

| 人群 | 使用场景 |
| --- | --- |
| 数学教师（中小学/大学） | 课堂大屏演示：全屏模式 + 实时调参 |
| 学生 | 课后自主探索：拖动滑块观察函数变化 |
| 科普创作者 | 欣赏数学之美，制作演示素材 |
| 开发者 / 教育技术团队 | GPL-3.0 协议下二次开发共建 |

## 平台功能

- **65+ 个交互式数学实验**，覆盖极坐标曲线、三角函数、泰勒展开、线性代数、矩阵分解、PCA、蒙特卡洛、马尔可夫链、拉普拉斯变换、小波分析、黄金分割、博弈论等
- **参数实时调控**：每个实验配滑块 + 数字输入框
- **坐标系智能锁定**：调参时坐标系不动，曲线超出视野才自动扩大
- **全屏演示模式**：图表撑满屏幕，内置可折叠参数面板，ESC 退出
- **AI 语音讲解**：双音色普通话旁白，随实验同步播放
- **防误触设计**：全屏时滚轮不误缩放图表，适配课堂翻页笔

## 技术栈

```text
React 19 + TypeScript + Vite + Tailwind CSS + Plotly.js
后端：Express + LowDB（仅用于缺陷反馈收集，非核心）
```

## 快速开始

```bash
# 1. 克隆仓库
git clone https://github.com/Znfooe/mathviz.git
cd mathviz

# 2. 安装全部依赖
npm run install:all

# 3. 启动开发环境（前端 5173 + 后端 3001）
npm run dev
```

构建生产版本：

```bash
cd client
npm run build   # 产物输出到 client/dist/
```

## 部署

平台构建产物是**纯静态网站**，部署极其简单：将 `web/` 目录上传到任意静态服务器（nginx、宝塔、Vercel、Netlify、GitHub Pages 均可），无需 Node.js、后端或数据库。

:::note 协议说明
本项目基于 zhangifonly（zhangzhen）的开源项目二次开发，以 **GPL-3.0** 发布。任何衍生作品都必须以 GPL-3.0 开源并保留原作者署名，且遵循原项目 PolyForm Noncommercial 协议、禁止商业用途。
:::

---

项目已开源，欢迎前往 GitHub 仓库查看完整文档：

[github.com/Znfooe/mathviz](https://github.com/Znfooe/mathviz)
