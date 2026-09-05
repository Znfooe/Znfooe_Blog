---
title: ReactionPro Client
published: 2026-07-01
description: 基于 Flutter 的反应力与击杀时间测试客户端，支持 Web、Windows、Android、iOS、macOS 与 Linux 多端。
tags: [Flutter, Dart, 客户端, 反应力测试]
category: 应用
lang: zh_CN
draft: false
---

**ReactionPro Client** 是一个使用 Flutter 构建的反应力与击杀时间测试客户端，一套代码覆盖 Web、Windows、Android、iOS、macOS 和 Linux 六个平台。

## 功能一览

- **反应力测试**：逐回合记录详细数据，量化你的反应速度
- **击杀时间测试**：支持 2D / 3D 兼容模式与 Raw Input，贴近真实电竞环境
- **外观自定义**：准星、目标、网格、开屏均可按个人习惯调整
- **账号体系**：登录、成绩历史与排行榜（客户端侧）
- **多端构建**：Flutter Web 与 Windows 桌面端

## 技术栈与环境

```text
Flutter 3.44.3
Dart    3.12.2
Windows 桌面构建需 Visual Studio 2022「使用 C++ 的桌面开发」
```

## 快速开始

Web 端本地运行：

```powershell
Set-Location .\frontend
flutter pub get
flutter run -d chrome
```

Windows 桌面端：

```powershell
Set-Location .\frontend
flutter run -d windows --dart-define=API_BASE_URL=http://localhost:3000/api/v1
```

:::note 关于后端
反应力与击杀时间测试可在本地独立运行；登录、成绩同步与排行榜需要兼容 ReactionPro `/api/v1` 契约的 API。本仓库只包含公开客户端，API 服务器与后台不在其中。
:::

## 配置与安全

客户端配置会被编译进应用（用户可读取），因此**只允许放公开值**：

```text
API_BASE_URL
OAUTH_GITHUB_CLIENT_ID
OAUTH_GOOGLE_CLIENT_ID
SENTRY_DSN
```

:::caution
禁止在客户端放入 OAuth Client Secret、数据库连接串、JWT 私钥、Resend Key 等任何 Secret。
:::

---

项目使用 Apache License 2.0 开源，详情见仓库：

[github.com/Znfooe/ReactionPro-Client](https://github.com/Znfooe/ReactionPro-Client)
