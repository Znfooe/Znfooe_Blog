import { expect, test } from "@playwright/test";

/**
 * 动态视频背景（banner 内嵌视频）回归锁定：
 * - 存量壁纸（id="default"）：video 模式下视频挂载 src（默认 60fps），
 *   标题文字与波浪保留；
 * - 延迟壁纸（deferLoad，默认档）：新访客未点选前零视频请求，仅显示封面静帧；
 * - 访客点选延迟壁纸：带进度下载（XHR → Cache API），就绪后挂载 blob: 源播放；
 * - 切回 banner 模式：视频隐藏、图片横幅恢复。
 */

const ZI_VIDEO_URL = "**/assets/video/background-video-zi-60fps.mp4";

/** 跳过开场动画与开场公告遮罩（与壁纸选择无关，避免拦截点击）。 */
async function dismissOverlays(page: import("@playwright/test").Page) {
	await page.addInitScript(() => {
		localStorage.setItem("shirone-opening-acknowledged", "1");
		sessionStorage.setItem("shirone-intro-played", "1");
	});
}

test.describe("Background video in banner", () => {
	test.use({ viewport: { width: 1280, height: 900 } });

	test("stored legacy wallpaper mounts its 60fps source with title and waves", async ({
		page,
	}) => {
		await page.addInitScript(() => {
			localStorage.removeItem("wallpaper-mode");
			localStorage.setItem("background-wallpaper", "default");
		});
		await page.goto("/", { waitUntil: "load" });

		// 视频元素存在且被赋值了 src（存量壁纸默认 60fps，非延迟加载）
		const video = page.locator(".banner-stage__video");
		await expect(video).toHaveCount(1);
		const src = await video.getAttribute("src");
		expect(src).toContain("background-video-60fps");

		// 横幅标题文字仍在
		await expect(page.locator(".banner-stage__copy--home h1")).toBeVisible();

		// 波浪仍渲染
		await expect(page.locator(".banner-waves")).toHaveCount(1);
	});

	test("deferred default wallpaper shows poster frame without video requests", async ({
		page,
	}) => {
		const videoRequests: string[] = [];
		page.on("request", (request) => {
			if (/\/assets\/video\/background-video-zi-.+\.mp4/.test(request.url())) {
				videoRequests.push(request.url());
			}
		});
		await page.addInitScript(() => {
			localStorage.removeItem("wallpaper-mode");
			localStorage.removeItem("background-wallpaper");
		});
		await page.goto("/", { waitUntil: "load" });

		// 新访客默认延迟壁纸：未点选前不挂载视频源，零视频网络请求
		const video = page.locator(".banner-stage__video");
		await expect(video).toHaveCount(1);
		await expect(video).not.toHaveAttribute("src", /.+/);
		expect(videoRequests).toEqual([]);

		// 封面静帧占位（poster 属性 + 视频层可见），避免空白横幅
		await expect(video).toHaveAttribute(
			"poster",
			/background-video-zi-poster/,
		);
		await expect(page.locator("#banner-wrapper")).toHaveClass(
			/banner-stage--video/,
		);
	});

	test("selecting a deferred wallpaper downloads it and mounts a blob source", async ({
		page,
	}) => {
		await page.route(ZI_VIDEO_URL, async (route) => {
			await route.fulfill({
				status: 200,
				contentType: "video/mp4",
				body: Buffer.from("fake-video-content-for-download"),
			});
		});
		await dismissOverlays(page);
		await page.addInitScript(() => {
			localStorage.removeItem("wallpaper-mode");
			localStorage.removeItem("background-wallpaper");
		});
		await page.goto("/", { waitUntil: "load" });

		// 开场动画（intro splash）退出后设置按钮才可点击，等它结束
		await page
			.locator("#intro-splash")
			.waitFor({ state: "detached", timeout: 15_000 });

		// 打开显示设置，点选延迟壁纸 → 立即开始下载
		await page.locator("#display-settings-switch").click();
		const option = page.getByRole("radio", { name: /梓/ });
		await expect(option).toBeVisible();
		await option.click();
		await expect(option).toHaveAttribute("aria-checked", "true");

		// 下载完成后视频层挂载 blob: 源（下载在后台进行，不阻塞浏览）
		const video = page.locator(".banner-stage__video");
		await expect(video).toHaveAttribute("src", /^blob:/, { timeout: 10_000 });

		// 选择持久化：刷新后恢复该壁纸（会话恢复走 Cache API，免二次下载）
		expect(await page.evaluate(() => localStorage.getItem("background-wallpaper"))).toBe(
			"zi",
		);
	});

	test("switching to banner mode hides video and shows image", async ({
		page,
	}) => {
		await page.addInitScript(() => {
			localStorage.setItem("wallpaper-mode", "banner");
		});
		await page.goto("/", { waitUntil: "load" });

		// 视频被隐藏（不可见）
		await expect(page.locator(".banner-stage__video")).toHaveCSS(
			"opacity",
			"0",
		);

		// 图片横幅可见
		await expect(
			page.locator(".banner-stage__image--active"),
		).toBeVisible();
	});
});
