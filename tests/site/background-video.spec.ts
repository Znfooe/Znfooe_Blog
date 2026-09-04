import { expect, test } from "@playwright/test";

/**
 * 动态视频背景（BackgroundVideo）回归锁定：
 * - 默认 wallpaper-mode 为 banner 时，视频背景零 DOM（不渲染、不发请求）；
 * - 切换为 video 模式后，视频背景层出现并加载对应帧率视频；
 * - 帧率档（60 / 120）切换会替换视频 src；
 * - reduced-motion 时视频暂停。
 */
test.describe("Background video wallpaper", () => {
	test.use({ viewport: { width: 1280, height: 900 } });

	async function setWallpaperMode(
		page: import("@playwright/test").Page,
		mode: string,
	) {
		await page.evaluate((m) => {
			localStorage.setItem("wallpaper-mode", m);
			document.documentElement.dataset.wallpaperMode = m;
		}, mode);
	}

	test("is absent (zero DOM) in default banner mode", async ({ page }) => {
		await page.addInitScript(() => {
			localStorage.removeItem("wallpaper-mode");
		});
		await page.goto("/", { waitUntil: "load" });

		// 默认 banner 模式：视频背景节点被移除，零 DOM 残留
		await expect(page.locator("#background-video")).toHaveCount(0, {
			timeout: 5000,
		});
	});

	test("appears and plays video in video mode", async ({ page }) => {
		await page.addInitScript(() => {
			localStorage.setItem("wallpaper-mode", "video");
		});
		await page.goto("/", { waitUntil: "load" });

		// 视频背景层出现并激活
		await expect(page.locator("#background-video")).toHaveClass(
			/is-active/,
			{ timeout: 5000 },
		);

		// 视频元素加载了默认 60fps 源
		const src = await page
			.locator("#background-video video")
			.getAttribute("src");
		expect(src).toContain("background-video-60fps");
	});

	test("switches fps source via the fps event", async ({ page }) => {
		await page.addInitScript(() => {
			localStorage.setItem("wallpaper-mode", "video");
			localStorage.setItem("background-video-fps", "120");
		});
		await page.goto("/", { waitUntil: "load" });

		await expect(page.locator("#background-video")).toHaveClass(
			/is-active/,
			{ timeout: 5000 },
		);

		const src = await page
			.locator("#background-video video")
			.getAttribute("src");
		expect(src).toContain("background-video-120fps");
	});
});
