---
title: "音频阅读器：日式动漫的神秘语音"
published: 2026-08-29
description: 一小批带着神秘气息的日式动漫语音片段，可用音频阅读器按需播放。
tags: [示例, 音频阅读器]
category: 示例
draft: false
---

这些简短的日语语音片段，仿佛是动漫场景边缘拾取而来的声音：一句挑逗的呼喊、一声明快的问候、一丝轻笑，还有几句来历不明的台词。它们是氛围样本，而非对白文本，所以请让声音来承载其中的含义。

音频阅读器让它们保持安静，直到你选择收听。每个发声按钮只会在被按下之后，才加载并播放对应的片段。

```markdown
:audio-reader[Clip title]{src="/assets/audio/filename.wav"}
```

## 语音片段

- **Baka**：:audio-reader[バカ]{src="/assets/audio/Baka.wav"}
- **Ciallo**：:audio-reader[Ciallo！！]{src="/assets/audio/Ciallo.wav"}
- **Ehe**：:audio-reader[玩笑般的语气]{src="/assets/audio/Ehe.wav"}
- **Imoi**：:audio-reader[イモい]{src="/assets/audio/Imoi.wav"}
- **Zako**：:audio-reader[雑魚じゃん、雑魚雑魚]{src="/assets/audio/Zako.wav"}

`src` 必须使用站点根路径或 HTTPS URL，且指令标签不能为空。无效或不完整的指令会作为普通 Markdown 保留，并且不会加载音频阅读器资源。
