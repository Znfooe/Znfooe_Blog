import type { ProfileConfig } from "@/types/config";
import { withUserConfig } from "../utils/config-overlay.ts";

/**
 * 博主资料：头像 / 名称 / 简介 / 社交链接（侧栏 Profile 卡片、页脚、RSS 作者等消费）。
 * 类型见 src/types/config.ts。
 */
export const profileConfig: ProfileConfig = withUserConfig("profile", {
	avatar: "assets/images/demo-avatar.webp", // Relative to the /src directory. Relative to the /public directory if it starts with '/'
	name: "Shirone",
	bio: "The rain remembers what the sky forgot to say.",
	links: [
		{
			name: "GitHub",
			icon: "fa6-brands:github", // Visit https://icones.js.org/ for icon codes
			// You will need to install the corresponding icon set if it's not already included
			// `pnpm add @iconify-json/<icon-set-name>`
			url: "https://github.com/Znfooe",
		},
		{
			name: "Bilibili",
			icon: "fa6-brands:bilibili",
			url: "https://space.bilibili.com/1385099245?spm_id_from=333.1007.0.0",
		},
	],
	/**
	 * 联系方式：QQ 与 WhatsApp 走纯文字行（不渲染图标按钮），
	 * 由 Profile 组件消费：在社交图标下方逐行展示。
	 */
	contacts: [
		{ name: "QQ", value: "3274098996" },
		{ name: "WhatsApp", value: "+86 131 8481 8420" },
	],
});
