import type { OpeningConfig } from "@/types/openingConfig";
import { withUserConfig } from "../utils/config-overlay.ts";

/**
 * 开场提示弹窗（OpeningNotice）。
 *
 * 展示本项目二开出处（fork 自 Shirone）并感谢上游作者，同时声明站点仍在开发中，
 * 以及动态壁纸来源与背景模式切换提示。
 * 「我已阅读」按钮在 `acknowledgeDelay`（默认 3000ms）后解锁；
 * 默认每次整页加载都弹出，仅当访客勾选「不再显示」后（localStorage 持久化）才不再出现。
 * `enable: false` 时零 DOM、零请求、零运行时。
 */
export const openingConfig: OpeningConfig = withUserConfig("opening", {
	enable: true,
	title: "欢迎",
	repoUrl: "https://github.com/LyraVoid/Shirone",
	repoAuthor: "LyraVoid",
	acknowledgeDelay: 3000,
	// 动态壁纸来源声明（每款壁纸一条；旧版单条 wallpaperCredit 字段仍兼容，合并去重）
	wallpaperCredits: [
		{
			up: "星雨布丁channel",
			uid: "286441820",
			videoText: "【动态壁纸】愿星空与花海长存~",
			videoUrl:
				"https://www.bilibili.com/video/BV1PaQHBaEsg?vd_source=283e195a935ac84c1f35e592f68dda71",
		},
		{
			up: "某一夏莱的纸鸢kite",
			videoText: "【『蔚蓝档案』动态壁纸——(๑•̀ω•́๑)白洲梓的注视呦(ゝω・★)】",
			videoUrl:
				"https://www.bilibili.com/video/BV1s7RFBVEY1?vd_source=283e195a935ac84c1f35e592f68dda71",
		},
	],
});
