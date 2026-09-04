/**
 * 开场提示弹窗运行时（OpeningNotice 专用）。
 *
 * 运行时契约（organism 只负责渲染，状态语义集中在这里）：
 * - 是否出现由 `localStorage` 持久化标记决定（`once: true` 时用户确认过即永不再现）；
 * - 为避免与开场动画（IntroSplash）重叠，弹窗在 `html[data-intro]` 进入 `done` 后再显示；
 * - 「我已阅读」按钮在 `acknowledgeDelay` 倒计时结束后解锁，期间展示剩余秒数；
 * - 确认后写入标记、隐藏并移除节点（零 DOM 残留）。
 */

/** 弹窗根节点 id。 */
export const OPENING_ROOT_ID = "opening-notice";

/** 已确认标记（localStorage；隐私模式下读写失败按「未确认」处理）。 */
export const OPENING_STORAGE_KEY = "shirone-opening-acknowledged";

/** 用户点击「我已阅读」按钮时的回调。 */
export type OpeningAcknowledgeHandler = () => void;

/** 读取当前会话是否已确认过。 */
export function hasOpeningAcknowledged(): boolean {
	try {
		return window.localStorage.getItem(OPENING_STORAGE_KEY) === "1";
	} catch {
		return false;
	}
}

/** 标记已确认，后续整页加载不再出现。 */
export function markOpeningAcknowledged(): void {
	try {
		window.localStorage.setItem(OPENING_STORAGE_KEY, "1");
	} catch {
		// 隐私模式等场景写入失败：退化为每次整页加载都出现，不影响流程。
	}
}

/** 读取 `html[data-intro]` 当前阶段；无标记时视为 `done`（如关闭开场动画时）。 */
function introDone(): boolean {
	const value = document.documentElement.getAttribute("data-intro");
	return value === "done" || value === null || value === "";
}

/**
 * 初始化弹窗：等待开场动画结束，随后启动「我已阅读」按钮倒计时。
 * 返回清理函数，供 Swup 等场景安全中断。
 */
export function initOpeningNotice(
	root: HTMLElement,
	acknowledgeDelay: number,
	acknowledgeLabel: (seconds: number) => string,
	onAcknowledge: OpeningAcknowledgeHandler,
): () => void {
	const button = root.querySelector<HTMLButtonElement>("[data-opening-ack]");
	if (!button) return () => {};

	let interval: number | undefined;
	let closed = false;

	// 按钮解锁后的纯文案（去掉秒数后缀），用于倒计时结束展示。
	const baseLabel = button.dataset.baseLabel ?? "OK";

	const release = () => {
		window.clearInterval(interval);
		button.disabled = false;
		button.textContent = baseLabel;
	};

	const reveal = () => {
		if (closed) return;
		root.classList.add("is-open");
		// 倒计时：每秒刷新「我已阅读（Ns）」文案
		let remaining = Math.ceil(acknowledgeDelay / 1000);
		button.disabled = true;
		button.textContent = acknowledgeLabel(remaining);
		interval = window.setInterval(() => {
			remaining -= 1;
			if (remaining <= 0) {
				release();
				return;
			}
			button.textContent = acknowledgeLabel(remaining);
		}, 1000);
	};

	const close = () => {
		if (closed) return;
		closed = true;
		window.clearInterval(interval);
		root.classList.remove("is-open");
		// 等待淡出过渡结束后移除节点（零 DOM 残留）
		root.addEventListener(
			"transitionend",
			(event) => {
				if (event.target === root && event.propertyName === "opacity") {
					root.remove();
				}
			},
			{ once: true },
		);
		// 兜底：无过渡（reduced-motion）时直接移除
		window.setTimeout(() => root.remove(), 400);
	};

	button.addEventListener("click", () => {
		if (button.disabled) return;
		onAcknowledge();
		close();
	});

	// 与开场动画衔接：等 html[data-intro] 变为 done 再显示。
	// 若开场动画关闭（无 data-intro 标记）则立即显示。
	if (introDone()) {
		reveal();
	} else {
		const observer = new MutationObserver(() => {
			if (introDone()) {
				observer.disconnect();
				reveal();
			}
		});
		observer.observe(document.documentElement, {
			attributes: true,
			attributeFilter: ["data-intro"],
		});
		// 兜底：极端情况下观察器不触发（如 JS 异常），超时后强制显示
		window.setTimeout(() => {
			observer.disconnect();
			if (!root.classList.contains("is-open")) reveal();
		}, 10_000);
	}

	return () => {
		window.clearInterval(interval);
		root.remove();
	};
}
