<script lang="ts">
/**
 * 软件安利页主体（有机体）：页头 + 搜索/标签筛选 + 扁平列表 + 就地展开详情。
 * 数据由页面层构建期传入（本地数据源，零运行时请求）。
 * - 搜索对 name/summary/tags/description 做模糊包含匹配，即时过滤；
 * - 标签 chips 单选过滤（再点取消恢复全部），与搜索可叠加；
 * - 列表项为「主页文章般的文字列表」：图标 + 标题 + 摘要 + 标签徽章；
 * - 点击列表项就地展开详情（仿主页文章页布局），顶部透明背景返回按钮；
 *   返回按钮切换 selectedId 切回列表视图。
 */
import Chips from "@components/atoms/action/Chips.svelte";
import Card from "@components/atoms/display/Card.svelte";
import TextField from "@components/atoms/input/TextField.svelte";
import PageHeader from "@components/molecules/PageHeader.svelte";
import I18nKey from "@i18n/i18nKey";
import { i18n } from "@i18n/translation";
import Icon from "@iconify/svelte";
import { reveal } from "@utils/motion";
import { onMount } from "svelte";
import type { SoftwareEntry } from "../../data/compass";

let { items = [] as SoftwareEntry[] }: { items?: SoftwareEntry[] } = $props();

let query = $state("");
let selectedTag = $state("");
let initialized = false;
let selectedId = $state<string | null>(null);

/** 当前展开的条目（来自 selectedId 索引） */
const selectedItem = $derived(items.find((item) => item.id === selectedId) ?? null);

/** 从所有条目聚合去重的标签列表（数组顺序即 chips 顺序） */
const allTags = $derived.by(() => {
	const seen = new Set<string>();
	const tags: string[] = [];
	for (const item of items) {
		for (const tag of item.tags) {
			if (!seen.has(tag)) {
				seen.add(tag);
				tags.push(tag);
			}
		}
	}
	return tags;
});

const tagItems = $derived(
	allTags.map((tag) => ({ value: tag, label: tag })),
);

/** 模糊包含匹配：搜索词可命中名称 / 摘要 / 标签 / 详情 */
function matchesQuery(item: SoftwareEntry, q: string): boolean {
	return [item.name, item.summary, ...item.tags, item.description]
		.join(" ")
		.toLowerCase()
		.includes(q);
}

const filteredItems = $derived.by(() => {
	const q = query.trim().toLowerCase();
	return items.filter((item) => {
		if (selectedTag && !item.tags.includes(selectedTag)) return false;
		if (q && !matchesQuery(item, q)) return false;
		return true;
	});
});

// 筛选状态同步到 URL（?q= / ?tag= / ?id=），刷新/分享/回退保留
$effect(() => {
	const q = query;
	const t = selectedTag;
	const id = selectedId;
	if (!initialized) return;
	const params = new URLSearchParams(window.location.search);
	params.delete("q");
	params.delete("tag");
	params.delete("id");
	if (q) params.set("q", q);
	if (t) params.set("tag", t);
	if (id) params.set("id", id);
	const qs = params.toString();
	history.replaceState(null, "", qs ? `?${qs}` : window.location.pathname);
});

onMount(() => {
	const params = new URLSearchParams(window.location.search);
	query = params.get("q") || "";
	selectedTag = params.get("tag") || "";
	selectedId = params.get("id") || null;
	initialized = true;
});

function openDetail(item: SoftwareEntry) {
	selectedId = item.id;
}

function closeDetail() {
	selectedId = null;
}

/** 描述按 \n 分段，供详情页逐段渲染 */
function paragraphs(text: string): string[] {
	return text.split(/\n+/).filter((s) => s.trim().length > 0);
}
</script>

<Card color="var(--card-bg)" radius="l" class="compass-section px-8 py-6">
	<PageHeader
		icon="material-symbols:rocket-launch-outline-rounded"
		title={i18n(I18nKey.compass)}
		subtitle={i18n(I18nKey.compassBanner)}
	/>

	{#if items.length > 0}
		<div class="compass-section__tools">
			<div class="compass-section__search">
				<TextField
					type="search"
					bind:value={query}
					placeholder={i18n(I18nKey.search)}
					label={i18n(I18nKey.search)}
					hideLabel
					variant="outlined"
					class="!rounded-(--shape-corner-l)"
				>
					<Icon slot="leading" icon="material-symbols:search-rounded" aria-hidden="true" />
				</TextField>
				{#if query}
					<button
						type="button"
						class="compass-section__search-clear"
						aria-label={i18n(I18nKey.clear)}
						onclick={() => (query = "")}
					>
						<Icon icon="material-symbols:close-rounded" aria-hidden="true" />
					</button>
				{/if}
			</div>

			{#if allTags.length > 1}
				<div class="compass-section__chips">
					<Chips
						items={tagItems}
						variant="filter"
						bind:value={selectedTag}
					/>
				</div>
			{/if}
			{#if filteredItems.length > 0}
				<p class="compass-section__count">{filteredItems.length} {i18n(I18nKey.compassCounts)}</p>
			{/if}
		</div>
	{/if}

	{#if selectedItem}
		<!-- 详情视图（就地展开）：顶部透明返回按钮 + 标题/标签/描述/外链/致谢 -->
		<article class="compass-detail" use:reveal>
			<button
				type="button"
				class="compass-detail__back"
				aria-label={i18n(I18nKey.backToHome)}
				onclick={closeDetail}
			>
				<Icon icon="material-symbols:arrow-back-rounded" aria-hidden="true" />
				<span>{i18n(I18nKey.backToHome)}</span>
			</button>

			<header class="compass-detail__head">
				<span class="compass-detail__icon" aria-hidden="true">
					<Icon icon={selectedItem.icon ?? "material-symbols:extension-rounded"} />
				</span>
				<h2 class="compass-detail__title">{selectedItem.name}</h2>
				{#if selectedItem.tags.length > 0}
					<div class="compass-detail__tags">
						{#each selectedItem.tags as tag}
							<span class="compass-detail__tag">{tag}</span>
						{/each}
					</div>
				{/if}
				<p class="compass-detail__summary">{selectedItem.summary}</p>
			</header>

			<div class="compass-detail__desc">
				{#each paragraphs(selectedItem.description) as para}
					{#if para.startsWith("·")}
						<p class="compass-detail__bullet">{para}</p>
					{:else}
						<p>{para}</p>
					{/if}
				{/each}
			</div>

			<div class="compass-detail__links">
				{#if selectedItem.github}
					<a class="compass-detail__link" href={selectedItem.github} target="_blank" rel="noopener noreferrer">
						<Icon icon="fa6-brands:github" aria-hidden="true" />
						{i18n(I18nKey.compassViewSource)}
					</a>
				{/if}
				<a class="compass-detail__link" href={selectedItem.href} target="_blank" rel="noopener noreferrer">
					<Icon icon="material-symbols:open-in-new-rounded" aria-hidden="true" />
					{i18n(I18nKey.compassViewSite)}
				</a>
			</div>

			{#if selectedItem.thanks}
				<p class="compass-detail__thanks">
					<Icon icon="material-symbols:favorite-rounded" aria-hidden="true" />
					{selectedItem.thanks}
				</p>
			{/if}
		</article>
	{:else if filteredItems.length > 0}
		<ul class="compass-list">
			{#each filteredItems as item, i (item.id)}
				<li class="compass-list__item" use:reveal={{ delay: Math.min(i, 7) * 45 }}>
					<button
						type="button"
						class="compass-list__btn"
						onclick={() => openDetail(item)}
					>
						<span class="compass-list__icon" aria-hidden="true">
							<Icon icon={item.icon ?? "material-symbols:extension-rounded"} />
						</span>
						<span class="compass-list__body">
							<span class="compass-list__title">{item.name}</span>
							<span class="compass-list__summary">{item.summary}</span>
							{#if item.tags.length > 0}
								<span class="compass-list__tags">
									{#each item.tags as tag}
										<span class="compass-list__tag">{tag}</span>
									{/each}
								</span>
							{/if}
						</span>
						<Icon class="compass-list__chevron" icon="material-symbols:chevron-right-rounded" aria-hidden="true" />
					</button>
				</li>
			{/each}
		</ul>
	{:else}
		<div class="compass-section__empty">
			<Icon icon="material-symbols:search-off-outline-rounded" aria-hidden="true" />
			<span>{i18n(I18nKey.compassNoResults)}</span>
		</div>
	{/if}
</Card>

<style lang="stylus">
@import "../../styles/breakpoints.styl"

.compass-section
	display: block

	@media (max-width: bp-sm - 1px)
		padding: 1rem 0.75rem

	&__tools
		display: flex
		flex-direction: column
		gap: 0.875rem
		padding-bottom: 1.25rem
		border-bottom: 1px solid var(--outline-variant)

	&__search
		position: relative
		width: 100%
		max-width: 32rem

		:global(.m3-text-field)
			width: 100%

	&__search-clear
		position: absolute
		right: 0.5rem
		top: 50%
		transform: translateY(-50%)
		display: inline-flex
		flex-shrink: 0
		align-items: center
		justify-content: center
		width: 1.75rem
		height: 1.75rem
		padding: 0.25rem
		border: none
		background: none
		color: var(--on-surface-variant)
		cursor: pointer
		border-radius: var(--shape-corner-full)
		> :global(svg)
			width: 1.25rem
			height: 1.25rem
		&:hover
			background: unquote("color-mix(in oklab, var(--on-surface-variant) 8%, transparent)")

	&__chips
		width: 100%

	&__count
		margin: 0
		color: var(--on-surface-variant)
		font: var(--m3e-type-body-small)

	&__empty
		display: flex
		flex-direction: column
		align-items: center
		justify-content: center
		gap: 0.75rem
		min-height: 11rem
		padding-top: 1.5rem
		color: var(--on-surface-variant)
		font: var(--m3e-type-body-large)
		> :global(svg)
			width: 2.5rem
			height: 2.5rem

/* 列表：主页文章般的一行行文字条目 */
.compass-list
	display: flex
	flex-direction: column
	margin: 1.25rem 0 0
	padding: 0
	list-style: none

	&__item
		border-bottom: 1px solid var(--outline-variant)
		&:last-child
			border-bottom: none

	&__btn
		display: flex
		align-items: center
		gap: 0.875rem
		width: 100%
		padding: 0.875rem 0.25rem
		border: none
		background: none
		text-align: left
		cursor: pointer
		border-radius: var(--shape-corner-s)
		transition: background-color var(--m3e-duration-short) var(--m3e-easing-standard)

		&:hover
			background: unquote("color-mix(in oklab, var(--on-surface) 5%, transparent)")

	&__icon
		display: flex
		align-items: center
		justify-content: center
		width: 2.5rem
		height: 2.5rem
		flex-shrink: 0
		border-radius: var(--shape-corner-m)
		background: unquote("color-mix(in oklab, var(--primary) 12%, var(--surface-container-high))")
		color: var(--primary)
		> :global(svg)
			width: 1.375rem
			height: 1.375rem

	&__body
		display: flex
		flex-direction: column
		gap: 0.3125rem
		flex: 1
		min-width: 0

	&__title
		color: var(--on-surface)
		font: var(--m3e-type-title-small)
		font-weight: 700
		line-height: 1.3

	&__summary
		color: var(--on-surface-variant)
		font: var(--m3e-type-body-small)
		line-height: 1.5

	&__tags
		display: flex
		flex-wrap: wrap
		gap: 0.375rem

	&__tag
		padding: 0.0625rem 0.5rem
		border-radius: var(--shape-corner-full)
		background: var(--surface-container-high)
		color: var(--on-surface-variant)
		font: var(--m3e-type-label-small)

	&__chevron
		flex-shrink: 0
		color: var(--outline)
		width: 1.25rem
		height: 1.25rem

/* 详情视图：就地展开的「文章式」布局，顶部透明背景返回按钮 */
.compass-detail
	display: flex
	flex-direction: column
	gap: 1.25rem
	margin: 1.25rem 0 0
	padding: 0 0.25rem
	min-width: 0

	&__back
		align-self: flex-start
		display: inline-flex
		align-items: center
		gap: 0.375rem
		padding: 0.375rem 0.625rem
		margin: 0
		border: 1px solid var(--outline-variant)
		border-radius: var(--shape-corner-full)
		background: transparent
		color: var(--on-surface-variant)
		font: var(--m3e-type-label-medium)
		line-height: 1.25rem
		cursor: pointer
		text-decoration: none
		transition:
			background-color var(--m3e-duration-short) var(--m3e-easing-standard),
			color var(--m3e-duration-short) var(--m3e-easing-standard),
			border-color var(--m3e-duration-short) var(--m3e-easing-standard)
		> :global(svg)
			width: 1.125rem
			height: 1.125rem
		&:hover
			background: unquote("color-mix(in oklab, var(--on-surface) 6%, transparent)")
			color: var(--on-surface)
			border-color: var(--outline)
		&:focus-visible
			outline: 2px solid var(--primary)
			outline-offset: 2px

	&__head
		display: flex
		flex-direction: column
		gap: 0.75rem
		padding-bottom: 1rem
		border-bottom: 1px solid var(--outline-variant)

	&__icon
		display: flex
		align-items: center
		justify-content: center
		width: 3.5rem
		height: 3.5rem
		flex-shrink: 0
		border-radius: var(--shape-corner-l)
		background: unquote("color-mix(in oklab, var(--primary) 14%, var(--surface-container-high))")
		color: var(--primary)
		> :global(svg)
			width: 2rem
			height: 2rem

	&__title
		margin: 0
		color: var(--on-surface)
		font: var(--m3e-type-headline-small)
		line-height: 1.3

	&__tags
		display: flex
		flex-wrap: wrap
		gap: 0.375rem

	&__tag
		padding: 0.125rem 0.5625rem
		border-radius: var(--shape-corner-full)
		background: unquote("color-mix(in oklab, var(--primary) 10%, var(--surface-container-high))")
		color: var(--primary)
		font: var(--m3e-type-label-small)

	&__summary
		margin: 0
		color: var(--on-surface-variant)
		font: var(--m3e-type-body-large)
		line-height: 1.5

	&__desc
		display: flex
		flex-direction: column
		gap: 0.625rem
		p
			margin: 0
			color: var(--on-surface-variant)
			font: var(--m3e-type-body-medium)
			line-height: 1.7

		.compass-detail__bullet
			padding-left: 0.5rem

	&__links
		display: flex
		flex-wrap: wrap
		gap: 0.5rem
		padding-top: 0.25rem

	&__link
		display: inline-flex
		align-items: center
		gap: 0.375rem
		padding: 0.4375rem 0.875rem
		border-radius: var(--shape-corner-m)
		background: unquote("color-mix(in oklab, var(--primary) 8%, transparent)")
		color: var(--primary)
		font: var(--m3e-type-label-medium)
		font-weight: 600
		text-decoration: none
		border: 1px solid unquote("color-mix(in oklab, var(--primary) 16%, transparent)")
		transition: background-color var(--m3e-duration-short) var(--m3e-easing-standard)

		&:hover
			background: unquote("color-mix(in oklab, var(--primary) 16%, transparent)")

		> :global(svg)
			width: 1rem
			height: 1rem

	&__thanks
		display: flex
		align-items: center
		justify-content: center
		gap: 0.4375rem
		margin: 0.5rem 0 0
		padding-top: 1rem
		border-top: 1px solid var(--outline-variant)
		color: var(--on-surface-variant)
		font: var(--m3e-type-body-medium)
		font-weight: 600

		> :global(svg)
			width: 1.125rem
			height: 1.125rem
			color: #e57373
</style>