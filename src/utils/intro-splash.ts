/**
 * 开场加载动画运行时（IntroSplash 专用）。
 *
 * 运行时契约（ organism 只负责渲染与调用，状态语义集中在这里）：
 * - `<head>` 内联脚本在**首次绘制前**把 `html[data-intro]` 置为 `pending` 或 `done`，
 *   决定幕布是否可见、`.onload-animation` 是否暂停（见 `src/styles/transition.css`）；
 * - organism 的模块脚本读取 `#intro-splash` 上的 data-* 配置并调用 `initIntroSplash()`；
 * - 阶段流转 `pending → exiting → done`：`exiting` 同时释放主页入场并收场幕布，
 *   `done` 时移除幕布节点；会话标记只在「真正播放完」或「用户主动跳过」时写入，
 *   视频加载失败 / 超时兜底退出不落标记，下次整页加载仍会尝试播放。
 */

/** `html` 上的阶段标记属性（transition.css 与 IntroSplash 共同消费）。 */
export const INTRO_ATTRIBUTE = "data-intro";

/** 会话内已播放标记（sessionStorage；隐私模式下读写失败按「未播放」处理）。 */
export const INTRO_STORAGE_KEY = "shirone-intro-played";

export type IntroPhase = "pending" | "exiting" | "done";

export interface IntroSplashOptions {
	/** 已按站点 base 解析的视频地址。 */
	src: string;
	/** 最长等待 ms，超时兜底进入主页。 */
	maxWait: number;
	/** 收场淡出时长 ms。 */
	exitDuration: number;
}

/** 读取当前开场阶段；未打标（理论上不会发生）返回 null。 */
export function getIntroPhase(): IntroPhase | null {
	if (typeof document === "undefined") return null;
	const value = document.documentElement.getAttribute(INTRO_ATTRIBUTE);
	return value === "pending" || value === "exiting" || value === "done"
		? value
		: null;
}

/** 当前会话是否已播放过开场动画。 */
export function hasIntroPlayedThisSession(): boolean {
	try {
		return window.sessionStorage.getItem(INTRO_STORAGE_KEY) === "1";
	} catch {
		return false;
	}
}

/** 标记当前会话已播放，后续整页加载不再出现幕布。 */
export function markIntroPlayed(): void {
	try {
		window.sessionStorage.setItem(INTRO_STORAGE_KEY, "1");
	} catch {
		// 隐私模式等场景写入失败：退化为「每次整页加载都播放」，不影响流程。
	}
}

/**
 * 启动开场动画：接入视频、监听结束/失败/超时，并把阶段推进到 `exiting` → `done`。
 * 幕布元素在 `done` 后从 DOM 移除；返回值是清理函数（当前无外部监听需要释放，
 * 保留契约以便 organism 在 Swup 等场景安全中断）。
 */
export function initIntroSplash(
	splash: HTMLElement,
	options: IntroSplashOptions,
): () => void {
	const root = document.documentElement;
	const video = splash.querySelector<HTMLVideoElement>("video");
	const skip = splash.querySelector<HTMLButtonElement>("[data-intro-skip]");

	let finished = false;
	let waitTimer: number | undefined;
	let fallbackTimer: number | undefined;

	const clearTimers = () => {
		window.clearTimeout(waitTimer);
		window.clearTimeout(fallbackTimer);
	};

	const teardown = () => {
		clearTimers();
		video?.removeEventListener("ended", handleVideoEnd);
		video?.removeEventListener("error", handleVideoEnd);
		skip?.removeEventListener("click", handleSkip);
	};

	const settleDone = () => {
		root.setAttribute(INTRO_ATTRIBUTE, "done");
		splash.remove();
		teardown();
	};

	const finish = (markPlayed: boolean) => {
		if (finished) return;
		finished = true;
		clearTimers();
		if (markPlayed) markIntroPlayed();
		// 进入收场：transition.css 据此释放被暂停的 .onload-animation，
		// 幕布 opacity 过渡（缓出）与主页入场交叉进行。
		root.setAttribute(INTRO_ATTRIBUTE, "exiting");
		fallbackTimer = window.setTimeout(settleDone, options.exitDuration + 240);
	};

	function handleVideoEnd() {
		finish(true);
	}

	function handleSkip() {
		finish(true);
	}

	// 幕布 opacity 过渡结束后立即落 `done` 并移除节点；
	// 全局 reduced-motion 会把过渡压到 0.01ms，fallbackTimer 兜底。
	splash.addEventListener("transitionend", (event) => {
		if (event.target !== splash || event.propertyName !== "opacity") return;
		window.clearTimeout(fallbackTimer);
		settleDone();
	});

	skip?.addEventListener("click", handleSkip);
	video?.addEventListener("ended", handleVideoEnd);
	video?.addEventListener("error", handleVideoEnd);

	waitTimer = window.setTimeout(
		() => finish(false),
		Math.max(options.maxWait, 0),
	);

	if (video) {
		video.src = options.src;
		// 无 src 时浏览器不发任何请求；此处才真正拉取视频。
		video.load();
		const playback = video.play();
		if (playback) playback.catch(() => finish(false));
	} else {
		finish(false);
	}

	return teardown;
}
