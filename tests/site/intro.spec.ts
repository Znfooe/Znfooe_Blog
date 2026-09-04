import { expect, test } from "@playwright/test";

/**
 * 开场加载动画（IntroSplash）回归锁定：
 * - 首次进入（会话内未播放、非 reduced-motion）：幕布可见、html[data-intro]="pending"，
 *   入场动画在播放期间被暂停；点击「跳过」或视频自然结束 → 收场 → "done" 并移除节点；
 * - 同一会话整页刷新不再出现（sessionStorage 标记，oncePerSession）；
 * - reduced-motion 用户直接跳过，幕布不渲染（零 DOM 残留）；
 * - 零额外负担：被跳过的会话（reduced-motion）从不给 <video> 赋 src，
 *   因此不发生任何 logo.mp4 网络请求。
 *
 * 说明：dev server 由 playwright.config 自动拉起（reuseExistingServer）。
 * 不采样动画中间帧（避免 flake），只锁定「pending → exiting → done」的终态与节点去留。
 */
test.describe("Intro splash", () => {
	test.use({ viewport: { width: 1280, height: 900 } });

	test("plays, then settles to done and removes the splash node", async ({
		page,
	}) => {
		const requests: string[] = [];
		page.on("request", (r) => requests.push(r.url()));

		await page.goto("/", { waitUntil: "load" });

		// 播放中：幕布可见、阶段为 pending、首页入场被暂停（onload-animation 仍在 0%）
		await expect(page.locator("html")).toHaveAttribute("data-intro", "pending");
		await expect(page.locator("#intro-splash")).toBeVisible();
		const homepageStillHidden = await page.evaluate(() => {
			const el = document.querySelector<HTMLElement>(".onload-animation");
			if (!el) return false;
			// 暂停态下应处于 fade-in-up 的 0% 关键帧（opacity 0）
			return Number.parseFloat(getComputedStyle(el).opacity) < 0.5;
		});
		expect(homepageStillHidden).toBe(true);

		// 点击跳过：释放入场 + 收场淡出
		await page.locator("[data-intro-skip]").click();

		// 终态：节点被移除、阶段置 done、首页已可见（入场收敛）
		await expect(page.locator("#intro-splash")).toHaveCount(0, {
			timeout: 5000,
		});
		await expect(page.locator("html")).toHaveAttribute("data-intro", "done");
		await expect(page.locator(".onload-animation").first()).toBeVisible();

		// 播放会话确实拉取了视频（功能正常）
		expect(requests.some((u) => u.includes("logo.mp4"))).toBe(true);
	});

	test("does not replay within the same session after first play", async ({
		page,
	}) => {
		await page.goto("/", { waitUntil: "load" });
		await expect(page.locator("html")).toHaveAttribute("data-intro", "pending");

		// 结束首次播放（标记 sessionStorage）
		await page.locator("[data-intro-skip]").click();
		await expect(page.locator("#intro-splash")).toHaveCount(0, {
			timeout: 5000,
		});

		// 整页刷新：会话内已播放 → 不再出现幕布
		await page.reload({ waitUntil: "load" });
		await expect(page.locator("html")).toHaveAttribute("data-intro", "done");
		await expect(page.locator("#intro-splash")).toHaveCount(0, {
			timeout: 5000,
		});
	});

	test("settles on its own when the video ends without skipping", async ({
		page,
	}) => {
		await page.goto("/", { waitUntil: "load" });
		await expect(page.locator("html")).toHaveAttribute("data-intro", "pending");

		// 不点击跳过，等待视频自然结束 + 收场淡出（视频 ~2.7s + 退出 ~0.84s）
		await expect(page.locator("#intro-splash")).toHaveCount(0, {
			timeout: 10000,
		});
		await expect(page.locator("html")).toHaveAttribute("data-intro", "done");
	});

	test("skips entirely under reduced motion (no splash, no video request)", async ({
		page,
	}) => {
		const requests: string[] = [];
		page.on("request", (r) => requests.push(r.url()));

		await page.emulateMedia({ reducedMotion: "reduce" });
		await page.goto("/", { waitUntil: "load" });

		// 阶段直接 done，运行时会移除幕布节点 → 零 DOM 残留
		await expect(page.locator("html")).toHaveAttribute("data-intro", "done");
		await expect(page.locator("#intro-splash")).toHaveCount(0, {
			timeout: 5000,
		});

		// 零额外负担：被跳过的会话从不给 <video> 赋 src，无 logo.mp4 请求
		expect(requests.some((u) => u.includes("logo.mp4"))).toBe(false);
	});
});
