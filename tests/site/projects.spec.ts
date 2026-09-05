import { expect, test } from "@playwright/test";

const PROJECT_COUNT = 4;

test.describe("项目页", () => {
	test.beforeEach(async ({ context, page }) => {
		// 开场弹窗默认每次整页加载都出现，其全屏 scrim 会拦截页面交互；
		// 测试里预设「不再显示」标记，跳过弹窗，避免遮挡项目页元素。
		await context.addInitScript(() => {
			localStorage.setItem("shirone-opening-acknowledged", "1");
		});
		await page.goto("/projects/", { waitUntil: "networkidle" });
		await expect(page.locator(".project-card")).toHaveCount(PROJECT_COUNT);
		// 等分类 Chips 完成 hydration 可交互
		await expect(
			page.locator(".projects-section__chips button").first(),
		).toBeVisible();
	});

	test("渲染代表项目、阶段、技术栈与源码链接", async ({ page }) => {
		await expect(page.locator("#swup-container")).toHaveAttribute(
			"data-current-page",
			"projects",
		);
		await expect(page.locator(".page-header__title")).toHaveText("项目");
		await expect(page.locator(".projects-section__count")).toHaveText(
			"4 个项目",
		);

		const shirone = page.locator('[data-project="shirone"]');
		await expect(shirone.locator("h2")).toHaveText("Shirone");
		await expect(shirone.locator(".project-card__cover img")).toHaveAttribute(
			"src",
			"/assets/projects/shirone.webp",
		);
		await expect(shirone).toHaveClass(/project-card--featured/);
		await expect(
			shirone.getByRole("link", { name: "查看源码" }),
		).toHaveAttribute("href", "https://github.com/LyraVoid/Shirone");

		// 三个新项目：无封面（图标瓷砖形态）+ 源码链接
		const harness = page.locator('[data-project="project-harness-builder"]');
		await expect(harness.locator(".project-card__icon")).toBeVisible();
		await expect(
			harness.getByRole("link", { name: "查看源码" }),
		).toHaveAttribute(
			"href",
			"https://github.com/Znfooe/project-harness-builder",
		);

		const reaction = page.locator('[data-project="reactionpro-client"]');
		await expect(
			reaction.getByRole("link", { name: "查看源码" }),
		).toHaveAttribute("href", "https://github.com/Znfooe/ReactionPro-Client");

		const mathviz = page.locator('[data-project="mathviz"]');
		await expect(
			mathviz.getByRole("link", { name: "查看源码" }),
		).toHaveAttribute("href", "https://github.com/Znfooe/mathviz");
	});

	test("点击卡片就地展开对应项目详情，不跳转页面", async ({ page }) => {
		// 初始：所有详情面板隐藏
		await expect(page.locator(".project-detail")).toHaveCount(3);
		await expect(
			page.locator('[data-project-detail="project-harness-builder"]'),
		).toBeHidden();

		// 点击 project-harness-builder 卡片 → 对应详情展开
		await page.locator('[data-project="project-harness-builder"]').click();
		await expect(
			page.locator('[data-project-detail="project-harness-builder"]'),
		).toBeVisible();
		await expect(page.locator('[data-project-detail="mathviz"]')).toBeHidden();

		// 仍停留在项目页（未跳转）
		await expect(page).toHaveURL(/\/projects\/$/);

		// 详情正文包含 markdown 渲染内容（标题）
		await expect(
			page.locator(
				'[data-project-detail="project-harness-builder"] .project-detail__title',
			),
		).toContainText("Project Harness Builder");

		// 再点一次收起
		await page.locator('[data-project="project-harness-builder"]').click();
		await expect(
			page.locator('[data-project-detail="project-harness-builder"]'),
		).toBeHidden();
	});

	test("直接加载时导航高亮与侧栏页面过滤正确", async ({ page }) => {
		await expect(
			page.locator('[data-nav-key="projects"]').first(),
		).toHaveAttribute("aria-current", "page");
		await expect(
			page.locator('widget-layout[data-id="categories"]'),
		).toBeVisible();
		await expect(page.locator('widget-layout[data-id="tags"]')).toBeVisible();
	});

	test("分类筛选会同步项目数量与可见卡片", async ({ page }) => {
		// Tool 分类只有 project-harness-builder
		await page.getByRole("button", { name: "Tool", exact: true }).click();
		await expect(page.locator(".project-card")).toHaveCount(1);
		await expect(
			page.locator('[data-project="project-harness-builder"]'),
		).toBeVisible();

		// 再点一次取消筛选，恢复全部
		await page.getByRole("button", { name: "Tool", exact: true }).click();
		await expect(page.locator(".project-card")).toHaveCount(PROJECT_COUNT);
	});

	test("实时搜索过滤与清除（URL ?q= 同步）", async ({ page }) => {
		const searchInput = page.locator(".projects-section__search input");
		await expect(searchInput).toBeVisible();
		await searchInput.fill("Shirone");
		await expect(page.locator(".project-card")).toHaveCount(1);
		await expect(page.locator('[data-project="shirone"]')).toBeVisible();
		await expect(page).toHaveURL(/[?&]q=Shirone/);

		const clearBtn = page.locator(".projects-section__search-clear");
		await clearBtn.click();
		await expect(page.locator(".project-card")).toHaveCount(PROJECT_COUNT);
		await expect(page).not.toHaveURL(/q=/);
	});

	test("桌面与手机布局之间无刷新切换时重置瀑布流定位", async ({ page }) => {
		await page.setViewportSize({ width: 1280, height: 900 });
		const grid = page.locator(".projects-section__grid");
		const cards = page.locator(".project-card");

		await expect
			.poll(() =>
				grid.evaluate(
					(element) =>
						getComputedStyle(element)
							.gridTemplateColumns.split(" ")
							.filter(Boolean).length,
				),
			)
			.toBeGreaterThan(1);

		await page.setViewportSize({ width: 390, height: 844 });
		await expect
			.poll(() =>
				grid.evaluate(
					(element) =>
						getComputedStyle(element)
							.gridTemplateColumns.split(" ")
							.filter(Boolean).length,
				),
			)
			.toBe(1);
		await expect(cards).toHaveCount(PROJECT_COUNT);
		await expect(page).toHaveURL(/\/projects\/$/);
	});
});

test.describe("项目页 Swup 导航", () => {
	test.use({ viewport: { width: 1280, height: 900 } });

	test("从持久顶栏进入后同步页面、导航与侧栏状态", async ({
		context,
		page,
	}) => {
		await context.addInitScript(() => {
			localStorage.setItem("shirone-opening-acknowledged", "1");
		});
		await page.goto("/skills/", { waitUntil: "networkidle" });
		await page.getByRole("button", { name: "更多", exact: true }).click();
		await page.locator('a[data-nav-key="projects"]').click();

		await expect(page).toHaveURL(/\/projects\/$/);
		await expect(page.locator("#swup-container")).toHaveAttribute(
			"data-current-page",
			"projects",
		);
		await expect(page.locator(".project-card")).toHaveCount(PROJECT_COUNT);
		await expect(page.locator('a[data-nav-key="projects"]')).toHaveAttribute(
			"aria-current",
			"page",
		);
	});
});
