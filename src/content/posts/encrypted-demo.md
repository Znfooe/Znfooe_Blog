---
title: 密码保护与文章加密演示
published: 2026-08-20
pinned: true
description: 在 Shirone 中演示基于客户端的认证解密、会话内存持久化，以及 M3E 设计令牌的运用。
tags: [演示, 安全, 加密, Markdown]
category: 示例
lang: zh_CN
encrypted: true
password: "shirone-secret"
passwordHint: "提示：本演示文章的解锁密码是 shirone-secret"
hideHomeContent: true
---

# 受密码保护的文章

恭喜！你已成功解锁这篇加密文章。浏览器通过 **Web Crypto API（AES-256-GCM + PBKDF2）** 在本地解密了这份预编译内容。

---

## 1. 安全架构与核心特性

Shirone 的文章加密系统与受保护的相册共享同一套安全底座，为静态发布提供企业级安全保障：

1. **静态 HTML 构建零明文**  
   在 Astro SSG 构建流水线中，文章 Markdown 会被编译为 HTML，并在产出页面之前立即使用 AES-256-GCM 加密。最终发布的静态 HTML 中，受保护的正文与大纲**不含任何明文**。

2. **带 AAD 作用域绑定的认证加密**  
   - 密钥派生遵循 OWASP 建议，采用 **310,000 次 PBKDF2 迭代**（SHA-256），并搭配加密安全的随机 16 字节盐值；
   - 每次加密载荷都会生成独立的 12 字节随机 IV；
   - 绑定作用域的**附加认证数据（AAD）** `shirone-protected-content:1:post:${slug}` 可确保密文无法在不同的文章或相册之间重放。

3. **会话持久化与密码零落盘**  
   - 解密内容缓存在临时的浏览器会话存储中，30 分钟后过期；
   - 明文密码绝不会写入磁盘或任何存储；
   - 在同一会话内，解密状态可无缝延续到 Swup 客户端导航与页面刷新之后。

4. **全站防泄露**  
   - **搜索收录**：静态页面不含明文，可防止搜索引擎与 Pagefind 收录私密内容；
   - **RSS 订阅**：受保护文章会在订阅源中输出本地化占位内容，防止 RSS 聚合器抓取敏感文字；
   - **卡片摘要与字数统计**：配置 `hideHomeContent: true` 后，主页与归档卡片上的描述和字数统计会被隐藏；
   - **目录（TOC）**：标题层级在解锁前保持隐藏，解密后会动态重建，并同步应用 M3E 样式。

> 💡 **演示说明**：本演示文章的默认解锁密码是 `shirone-secret`。

---

## 2. 交互式富内容演示

文章解密后，会与运行时辅助模块协作，动态挂载语法高亮、代码折叠、交互式 Mermaid 图表、LaTeX 公式与图片灯箱。

### 2.1 代码块与语法高亮

下面的代码块用于测试 Expressive Code 的语法高亮、复制操作与行装饰：

```typescript
import { decryptProtectedContent, type ProtectedPayload } from "@/utils/password-protection";

/**
 * Client-side post decryption example
 */
async function unlockArticle(payload: ProtectedPayload, password: string): Promise<string> {
    const scope = payload.scope;
    console.log(`[Shirone] Decrypting scope: ${scope}`);
    
    // Execute AES-256-GCM decryption with AAD verification
    const decryptedHtml = await decryptProtectedContent(payload, password, scope);
    console.log("[Shirone] Decryption successful, length:", decryptedHtml.length);
    return decryptedHtml;
}
```

```bash
# Verify build and type checking
npx.cmd astro check
pnpm.cmd type-check
pnpm.cmd test
```

### 2.2 Mermaid 架构图

下面的流程图由 Mermaid 渲染，并在解密时动态绑定：

```mermaid
flowchart TD
    subgraph build["Build Pipeline"]
        A[Markdown Source] --> B[Astro Pipeline]
        B --> C[Render HTML]
        C --> D[encryptProtectedContent]
        D --> E[ProtectedPayload]
        E --> F[Static HTML with ProtectedPost]
    end

    subgraph runtime["Client Runtime"]
        G[Reader Visits Page] --> H{Valid Session?}
        H -->|Yes| K[Render Decrypted HTML]
        H -->|No| I[Display PasswordGate]
        I --> J[User Submits Password]
        J --> L[Web Crypto AES-GCM Decrypt]
        L -->|Incorrect| M[Show Error Feedback]
        L -->|Success| N[Store Session Record]
        N --> K
        K --> O[Trigger post-decryption Coordinator]
        O --> P[Initialize Copy, Mermaid, KaTeX, and TOC]
    end
```

### 2.3 LaTeX 数学公式

行内公式：欧拉恒等式 $e^{i\pi} + 1 = 0$ 与高斯积分 $\int_{-\infty}^{\infty} e^{-x^2} dx = \sqrt{\pi}$。

展示型公式支持横向滚动容器：

$$
f(x) = \frac{1}{\sigma \sqrt{2\pi}} \exp\left( -\frac{(x - \mu)^2}{2\sigma^2} \right)
$$

$$
\mathcal{L}_{\text{AES-GCM}} = \text{GHASH}_H(A \parallel C \parallel L) \oplus \text{AES}_K(J_0)
$$

### 2.4 提示块

:::note 架构说明
该加密系统遵循原子设计原则与最小化补丁约定，同时不会影响 SSR 稳定性。
:::

:::tip 主题联动
解锁后，可以试试切换浅色/深色模式或更改主色调；解密后的组件会动态适配当前的设计令牌。
:::

:::important 安全边界
静态客户端加密旨在防止未经授权的浏览与自动化收录。对于至关重要的商业机密，建议采用服务端认证方案。
:::

:::warning 密码找回
静态加密没有集中的服务端数据库。一旦忘记密码，加密内容将无法恢复。
:::

### 2.5 GitHub 仓库卡片

::github{repo="withastro/astro"}

---

## 3. 配置参考

| 参数 | 类型 | 必填 | 默认值 | 说明 |
| :--- | :--- | :--- | :--- | :--- |
| `encrypted` | `boolean` | 否 | `false` | 明确将文章标记为加密。若设置了 `password`，则隐式为 `true`。 |
| `password` | `string` | 是 | 无 | 用于构建时加密与运行时解锁的明文密码。 |
| `passwordHint` | `string` | 否 | `""` | 显示在密码输入框下方的可选提示文字。 |
| `hideHomeContent` | `boolean` | 否 | `true` | 在主页卡片、归档与 RSS 订阅源中隐藏文章描述与字数统计。 |

---

## 4. 总结

本演示覆盖了 Shirone 中加密的完整生命周期：静态产物零明文、可靠的密码学校验、跨导航与刷新的会话持久化，以及运行时的动态水合。
