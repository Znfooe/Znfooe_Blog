/** 开场视频的画面适配方式：contain 完整显示，cover 铺满裁切 */
export type IntroVideoFit = "contain" | "cover";

/**
 * 开场加载动画（IntroSplash）配置。
 *
 * 关闭（`enable: false`）时满足零额外负担：零 DOM、零视频请求、零客户端运行时。
 * 播放状态由 `sessionStorage` 记录，`oncePerSession` 为 true 时同一会话整页刷新不重播。
 */
export interface IntroConfig {
	/** 总开关。false 时零 DOM、零视频请求、零客户端运行时。 */
	enable: boolean;
	/** 视频地址：public 下的绝对路径（自动接 base 路径），或完整外链 URL。 */
	src: string;
	/** 画面适配：contain 完整显示（配同色 backdrop 无接缝）/ cover 铺满裁切。 */
	fit: IntroVideoFit;
	/**
	 * 幕布底色。建议填视频自身的背景色，让 contain 模式下视频与幕布无缝衔接；
	 * 留空则回退页面背景色 `--page-bg`。
	 */
	backdrop: string;
	/** 同一浏览器会话只播放一次（sessionStorage）；false 时每次整页加载都播放。 */
	oncePerSession: boolean;
	/** 最长等待 ms：视频加载失败或过慢时兜底进入主页，避免卡在开场。 */
	maxWait: number;
	/** 收场淡出时长 ms（缓出曲线），与主页入场交叉形成顺滑衔接。 */
	exitDuration: number;
	/** 是否显示「跳过」按钮。 */
	skippable: boolean;
}
