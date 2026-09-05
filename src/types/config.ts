export type { PermalinkConfig } from "./permalinkConfig.ts";

import type { AUTO_MODE, DARK_MODE, LIGHT_MODE } from "@constants/constants";
import type { TextureConfig } from "./textureConfig";

export type WallpaperMode = "banner" | "none" | "video";

export type TopAppBarContentAlign = "left" | "center";

/**
 * 单个可选动态视频壁纸（显示设置面板「动态壁纸」选择器的条目）。
 * 由 `backgroundVideos` 声明；legacy `backgroundVideo` 会合并为 id="default" 的首项。
 */
export type BackgroundWallpaperConfig = {
	/** 壁纸唯一标识：访客选择持久化到 localStorage 的值，发布后不要变更。 */
	id: string;
	/** 设置面板显示名；缺省时回退 i18n「默认」（legacy 条目）或 id 本身。 */
	label?: string;
	/** 视频源：不同帧率的地址，key 为帧率档位（如 "60"、"120"）。 */
	src: Record<string, string>;
	/** 默认帧率档位（对应 src 的 key）。 */
	defaultFps?: string;
	/** 视频裁切焦点位置："top"、"center" 或 "bottom"。 */
	position?: "top" | "center" | "bottom";
	/**
	 * 壁纸预览封面：延迟加载（deferLoad）壁纸未就绪时 Banner 的占位静帧；
	 * 站内路径（以 "/" 开头）或外链均可，仅在 video 模式且视频未就绪时请求。
	 */
	poster?: string;
	/** 设置面板缩略图；缺省回退 poster。 */
	thumb?: string;
	/**
	 * 延迟加载：选中后不自动挂载视频，等访客在设置面板点选触发下载（带进度条）
	 * 完成后再淡入播放；首次下载成功后经 Cache API 跨会话复用。
	 * 大文件壁纸建议开启，防止首屏渲染过慢。
	 */
	deferLoad?: boolean;
};

export type DisplaySettingsConfig = {
	/** 是否在显示设置面板展示配色风格（9 宫格）选择器（默认 true） */
	colorStyle?: boolean;
	/** 是否在显示设置面板展示 Color Spec（调色规范 2021 / 2025）切换器（默认 true） */
	colorSpec?: boolean;
	/** 是否在显示设置面板展示 Page background（页面背景 纯色 / 横幅）切换器（默认 true） */
	wallpaperMode?: boolean;
	/** 是否在显示设置面板展示 Layout（文章列表布局 列表 / 网格）切换器（默认 true） */
	layoutMode?: boolean;
	/** 是否在显示设置面板展示 Reduce motion（减少动效）切换器（默认 true） */
	reduceMotion?: boolean;
	/** 是否在显示设置面板展示背景纹理选择器（默认 true，且受 texture.enable 控制） */
	texture?: boolean;
};

export type SiteConfig = {
	site: string;
	base?: string;
	title: string;
	subtitle: string;
	topAppBar: {
		/** 桌面端标题与导航内容组的对齐方式。 */
		contentAlign: TopAppBarContentAlign;
	};

	/** 显示设置浮层各切换项的前端可见性控制 */
	displaySettings?: DisplaySettingsConfig;

	lang:
		| "en"
		| "zh_CN"
		| "zh_TW"
		| "ja"
		| "ko"
		| "es"
		| "th"
		| "vi"
		| "tr"
		| "id";

	/** IANA time zone used to interpret precise content timestamps. */
	timeZone: string;

	themeColor: {
		hue: number;
		fixed: boolean;
		style: string;
		spec: string;
	};
	wallpaperMode: {
		defaultMode: WallpaperMode;
	};
	/** 动态视频背景（wallpaperMode === "video" 时使用，合并为壁纸列表 id="default" 的首项）。 */
	backgroundVideo?: {
		/** 设置面板显示名；缺省时回退 i18n「默认」。 */
		label?: string;
		/** 视频源：不同帧率的地址，key 为帧率档位（如 "60"、"120"）。 */
		src: Record<string, string>;
		/** 默认帧率档位（对应 src 的 key）。 */
		defaultFps?: string;
		/** 视频裁切焦点位置："top"、"center" 或 "bottom"。 */
		position?: "top" | "center" | "bottom";
		/** 是否在视频上覆盖黑色遮罩提高文字对比度。 */
		dim?: {
			enable: boolean;
			opacity: number;
		};
		/** 设置面板缩略图；缺省回退 poster。 */
		thumb?: string;
		/** 壁纸预览封面（仅作为普通壁纸的兜底占位；延迟加载语义见 backgroundVideos）。 */
		poster?: string;
	};
	/**
	 * 额外可选动态壁纸列表：与 legacy backgroundVideo 合并进显示设置的
	 * 「动态壁纸」选择器。仅一条（未配置 backgroundVideos）时不渲染选择器，
	 * 行为与旧版一致（零额外负担）。
	 */
	backgroundVideos?: BackgroundWallpaperConfig[];
	/** 默认壁纸 id（须为合并列表中的某一项；缺省取列表第一项）。 */
	defaultWallpaperId?: string;
	/** 页面背景纹理系统配置，支持布尔值直接开关或详细配置对象 */
	texture?: boolean | TextureConfig;
	banner: {
		src: {
			desktop: string[];
			mobile: string[];
		};
		position?: "top" | "center" | "bottom";
		dim: {
			enable: boolean;
			opacity: number;
		};
		homeText: {
			enable: boolean;
			title: string;
			/** 首页副标题文本，支持单条字符串或多条交替循环的字符串数组 */
			subtitle: string | string[];
			typewriter: {
				enable: boolean;
				/** 打字速度（每个字符间隔，毫秒，默认 120） */
				speed: number;
				/** 回退反向删除速度（每个字符间隔，毫秒，默认 50） */
				deleteSpeed?: number;
				/** 打字完成后等待停顿时间（毫秒，默认 2000） */
				pauseTime?: number;
				/** 完成后是否循环播放（默认 true） */
				loop: boolean;
			};
		};
		carousel: {
			enable: boolean;
			interval: number;
			/** 交叉淡入淡出过渡时长（毫秒，默认 1200） */
			fadeDuration?: number;
			/** 运镜呼吸动画模式："ken-burns"（默认，序列运镜）| "zoom-in" | "zoom-out" | "pan-left" | "pan-right" | "none" */
			animation?:
				| "ken-burns"
				| "zoom-in"
				| "zoom-out"
				| "pan-left"
				| "pan-right"
				| "none";
		};
		waves: {
			enable: boolean;
		};
	};
	/** Markdown 正文图片处理配置。 */
	imageOptimization?: {
		/** 添加 `referrerpolicy="no-referrer"` 的远程图片域名，支持 `*.example.com` 通配符。 */
		noReferrerDomains?: string[];
	};
	toc: {
		enable: boolean;
		depth: 1 | 2 | 3;
	};

	/** 进度条预设样式（页面切换进度条等，仅线性扫描模式） */
	progressIndicator: {
		/** dual 双向扫描（官方默认双线）/ single 单向扫描（单线） */
		style: "dual" | "single";
	};

	favicon: Favicon[];
};

export type Favicon = {
	src: string;
	theme?: "light" | "dark";
	sizes?: string;
};

export type ProfileConfig = {
	avatar?: string;
	name: string;
	bio?: string;
	links: {
		name: string;
		url: string;
		icon: string;
	}[];
	/**
	 * 联系方式（QQ / WhatsApp 等）：在社交图标下方逐行展示纯文字。
	 * 不渲染图标按钮，只用「名称: 值」的可读格式。
	 */
	contacts?: {
		name: string;
		value: string;
	}[];
};

export type LicenseConfig = {
	enable: boolean;
	name: string;
	url: string;
};

export type LIGHT_DARK_MODE =
	| typeof LIGHT_MODE
	| typeof DARK_MODE
	| typeof AUTO_MODE;

export type BlogPostData = {
	body: string;
	title: string;
	published: Date;
	publishedAt?: Date;
	updated?: Date;
	updatedAt?: Date;
	description: string;
	tags: string[];
	draft?: boolean;
	image?: string;
	category?: string;
	alias?: string;
	permalink?: string;
	prevTitle?: string;
	prevUrl?: string;
	nextUrl?: string;
	prevSlug?: string;
	nextTitle?: string;
	nextSlug?: string;
};

export type ExpressiveCodeConfig = {
	theme: string;
	lightTheme?: string;
	darkTheme?: string;
};
