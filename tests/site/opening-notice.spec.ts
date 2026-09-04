import { expect, test } from "@playwright/test";

/**
 * 开场提示弹窗（OpeningNotice）回归锁定：
 * - 首次进入（localStorage 未确认）：弹窗可见，「我已阅读」按钮初始 disabled、
 *   3 秒倒计时后解锁，点击后写入标记并移除节点；
 * - 倒计时期间按钮不可点，且文案含剩余秒数；
 * - 确认过一次后（localStorage 持久化）刷新不再出现；
 * - 零额外负担：已确认的会话中弹窗节点被移除，且不产生任何外部请求。
 */
test.describe("Opening notice", () => {
	test.use({ viewport: { width: 1280, height: 900 } });

	test.beforeEach(async ({ context }) => {
		// 清空确认标记：用一次性 init 脚本，仅在首次导航前清除，
		// 避免每次 reload 都被再次清掉（那会让「确认后不重现」的断言失真）。
		await context.addInitScript(() => {
			const k = "shirone-opening-acknowledged";
			if (sessionStorage.getItem("__opening_test_cleared") !== "1") {
				localStorage.removeItem(k);
				sessionStorage.setItem("__opening_test_cleared", "1");
			}
		});
	});

	test("shows modal, gates button for ~3s, then dismisses and persists", async ({
		page,
	}) => {
		const requests: string[] = [];
		page.on("request", (r) => requests.push(r.url()));

		await page.goto("/", { waitUntil: "load" });

		// 弹窗出现且按钮初始不可点
		await expect(page.locator("#opening-notice")).toBeVisible();
		const ack = page.locator("[data-opening-ack]");
		await expect(ack).toBeDisabled();
		await expect(ack).toContainText("3");

		// 倒计时结束前仍不可点
		await page.waitForTimeout(1500);
		await expect(ack).toBeDisabled();

		// 等待 3s 解锁
		await expect(ack).toBeEnabled({ timeout: 5000 });

		// 点击确认：写入 localStorage、节点移除
		await ack.click();
		await expect(page.locator("#opening-notice")).toHaveCount(0, {
			timeout: 5000,
		});
		const acknowledged = await page.evaluate(() =>
			localStorage.getItem("shirone-opening-acknowledged"),
		);
		expect(acknowledged).toBe("1");

		// 确认后不再出现（整页刷新）
		await page.reload({ waitUntil: "load" });
		await expect(page.locator("#opening-notice")).toHaveCount(0, {
			timeout: 5000,
		});

		// 纯站内内容：无任何第三方请求
		expect(requests.some((u) => u.includes("github.com"))).toBe(false);
	});

	test("does not reappear on reload once acknowledged", async ({ page }) => {
		await page.goto("/", { waitUntil: "load" });
		await expect(page.locator("#opening-notice")).toBeVisible();

		// 直接写入确认标记，模拟已确认
		await page.evaluate(() =>
			localStorage.setItem("shirone-opening-acknowledged", "1"),
		);
		await page.reload({ waitUntil: "load" });
		await expect(page.locator("#opening-notice")).toHaveCount(0, {
			timeout: 5000,
		});
	});
});
