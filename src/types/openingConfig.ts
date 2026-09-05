/**
 * 开场提示弹窗（OpeningNotice）配置。
 *
 * 关闭（`enable: false`）时满足零额外负担：零 DOM、零外部请求、零客户端运行时。
 * 弹窗默认每次整页加载都出现；仅当访客勾选「不再显示」后才会写入 localStorage
 * 持久化标记，此后不再出现。
 */
/** 单条动态壁纸来源声明（宣传视频链接展示为可点击文本）。 */
export interface OpeningWallpaperCredit {
	/** 壁纸作者 / UP 主名称。 */
	up: string;
	/** 作者 UID（可选；缺省时使用无 UID 的声明文案模板）。 */
	uid?: string;
	/** 壁纸宣传视频标题（展示为链接文本）。 */
	videoText: string;
	/** 壁纸宣传视频链接。 */
	videoUrl: string;
}

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
	/** 动态壁纸来源声明（旧版单条字段，未配置则不渲染；与 wallpaperCredits 合并去重）。 */
	wallpaperCredit?: OpeningWallpaperCredit;
	/** 动态壁纸来源声明列表（多款壁纸各自致谢；与旧版 wallpaperCredit 合并去重）。 */
	wallpaperCredits?: OpeningWallpaperCredit[];
}
