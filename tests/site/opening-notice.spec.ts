import { expect, test } from "@playwright/test";

/**
 * 开场提示弹窗（OpeningNotice）回归锁定：
 * - 默认每次整页加载都弹出（不勾选「不再显示」时，确认后刷新仍会再次出现）；
 * - 「我已阅读」按钮 3 秒倒计时后解锁；
 * - 勾选「不再显示」后再确认 → 写入 localStorage 持久化标记，之后不再出现；
 * - 已标记的会话中弹窗节点被移除（零 DOM）。
 */
test.describe("Opening notice", () => {
	test.use({ viewport: { width: 1280, height: 900 } });

	test.beforeEach(async ({ context }) => {
		await context.addInitScript(() => {
			const k = "shirone-opening-acknowledged";
			if (sessionStorage.getItem("__opening_test_cleared") !== "1") {
				localStorage.removeItem(k);
				sessionStorage.setItem("__opening_test_cleared", "1");
			}
		});
	});

	test("shows every load by default (no persistence without checkbox)", async ({
		page,
	}) => {
		await page.goto("/", { waitUntil: "load" });
		await expect(page.locator("#opening-notice")).toBeVisible();

		// 按钮初始不可点、含倒计时秒数
		const ack = page.locator("[data-opening-ack]");
		await expect(ack).toBeDisabled();
		await expect(ack).toContainText("3");

		// 等 3s 解锁后直接点确认（不勾选「不再显示」）
		await expect(ack).toBeEnabled({ timeout: 5000 });
		await ack.click();
		await expect(page.locator("#opening-notice")).toHaveCount(0, {
			timeout: 5000,
		});

		// 未勾选 → 未写标记，刷新后仍会再次出现
		const stored = await page.evaluate(() =>
			localStorage.getItem("shirone-opening-acknowledged"),
		);
		expect(stored).toBeNull();

		await page.reload({ waitUntil: "load" });
		await expect(page.locator("#opening-notice")).toBeVisible();
	});

	test("persists when 'never show' is checked before confirming", async ({
		page,
	}) => {
		await page.goto("/", { waitUntil: "load" });
		await expect(page.locator("#opening-notice")).toBeVisible();

		// 勾选「不再显示」
		await page.locator("[data-opening-never]").check();

		const ack = page.locator("[data-opening-ack]");
		await expect(ack).toBeEnabled({ timeout: 5000 });
		await ack.click();
		await expect(page.locator("#opening-notice")).toHaveCount(0, {
			timeout: 5000,
		});

		// 已勾选 → 写入标记，刷新后不再出现
		const stored = await page.evaluate(() =>
			localStorage.getItem("shirone-opening-acknowledged"),
		);
		expect(stored).toBe("1");

		await page.reload({ waitUntil: "load" });
		await expect(page.locator("#opening-notice")).toHaveCount(0, {
			timeout: 5000,
		});
	});

	test("does not appear once marked", async ({ page }) => {
		await page.addInitScript(() => {
			localStorage.setItem("shirone-opening-acknowledged", "1");
		});
		await page.goto("/", { waitUntil: "load" });
		await expect(page.locator("#opening-notice")).toHaveCount(0, {
			timeout: 5000,
		});
	});
});
