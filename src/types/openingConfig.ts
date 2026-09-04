/**
 * 开场提示弹窗（OpeningNotice）配置。
 *
 * 关闭（`enable: false`）时满足零额外负担：零 DOM、零外部请求、零客户端运行时。
 * 确认状态由 `localStorage` 持久化记录，`once` 为 true 时用户确认过一次后，
 * 之后所有会话（含跨浏览器会话）都不再出现。
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
	/** 是否只出现一次（localStorage 持久化；false 则每次整页加载都出现）。 */
	once: boolean;
}
