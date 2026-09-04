/**
 * 开场提示弹窗（OpeningNotice）配置。
 *
 * 关闭（`enable: false`）时满足零额外负担：零 DOM、零外部请求、零客户端运行时。
 * 弹窗默认每次整页加载都出现；仅当访客勾选「不再显示」后才会写入 localStorage
 * 持久化标记，此后不再出现。
 */
export interface OpeningConfig {
	/** 总开关。false 时零 DOM、零请求、零运行时。 */
	enable: boolean;
	/** 弹窗标题。 */
	title: string;
	/** 上游仓库 URL（fork 出处），展示为可点击链接。 */
	repoUrl: string;
	/** 上游作者 / 组织名，用于「感谢大佬开源」文案。 */
	repoAuthor: string;
	/** 「我已阅读」按钮解锁前的等待时长（ms）。 */
	acknowledgeDelay: number;
	/** 动态壁纸来源声明（可选，未配置则不渲染该行）。 */
	wallpaperCredit?: {
		/** 壁纸作者 / UP 主名称。 */
		up: string;
		/** 作者 UID。 */
		uid: string;
		/** 壁纸宣传视频标题（展示为链接文本）。 */
		videoText: string;
		/** 壁纸宣传视频链接。 */
		videoUrl: string;
	};
}
