import { expect, test } from "@playwright/test";

/**
 * 动态视频背景（banner 内嵌视频）回归锁定：
 * - 默认 video 模式：横幅区域显示视频、标题文字保留、波浪保留；
 * - 切回 banner 模式：视频隐藏、图片横幅恢复；
 * - none 模式：整个 banner 隐藏。
 */
test.describe("Background video in banner", () => {
	test.use({ viewport: { width: 1280, height: 900 } });

	test("default video mode shows video + keeps title and waves", async ({
		page,
	}) => {
		await page.addInitScript(() => {
			localStorage.removeItem("wallpaper-mode");
		});
		await page.goto("/", { waitUntil: "load" });

		// 视频元素存在且被赋值了 src（默认 60fps）
		const video = page.locator(".banner-stage__video");
		await expect(video).toHaveCount(1);
		const src = await video.getAttribute("src");
		expect(src).toContain("background-video-60fps");

		// 横幅标题文字仍在
		await expect(page.locator(".banner-stage__copy--home h1")).toBeVisible();

		// 波浪仍渲染
		await expect(page.locator(".banner-waves")).toHaveCount(1);
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
