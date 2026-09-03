<script lang="ts">
/**
 * 软件安利页主体（有机体）：页头 + 搜索/标签筛选 + 扁平列表 + 详情弹窗。
 * 数据由页面层构建期传入（本地数据源，零运行时请求）。
 * - 搜索对 name/summary/tags/description 做模糊包含匹配，即时过滤；
 * - 标签 chips 单选过滤（再点取消恢复全部），与搜索可叠加；
 * - 列表项为「主页文章般的文字列表」：图标 + 标题 + 摘要 + 标签徽章；
 * - 点击某项展开 Dialog 详情：完整描述 + 外链（GitHub / 网站）+ 底部致谢。
 */
import Chips from "@components/atoms/action/Chips.svelte";
import Card from "@components/atoms/display/Card.svelte";
import Dialog from "@components/atoms/overlay/Dialog.svelte";
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
let activeItem = $state<SoftwareEntry | null>(null);
let detailOpen = $state(false);

function openDetail(item: SoftwareEntry) {
	activeItem = item;
	detailOpen = true;
}

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

// 筛选状态同步到 URL（?q= / ?tag=），刷新/分享/回退保留
$effect(() => {
	const q = query;
	const t = selectedTag;
	if (!initialized) return;
	const params = new URLSearchParams(window.location.search);
	params.delete("q");
	params.delete("tag");
	if (q) params.set("q", q);
	if (t) params.set("tag", t);
	const qs = params.toString();
	history.replaceState(null, "", qs ? `?${qs}` : window.location.pathname);
});

onMount(() => {
	const params = new URLSearchParams(window.location.search);
	query = params.get("q") || "";
	selectedTag = params.get("tag") || "";
	initialized = true;
});

/** 描述按 \n 分段，供详情弹窗逐段渲染 */
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

	{#if filteredItems.length > 0}
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

{#if activeItem}
	<Dialog bind:open={detailOpen} title={activeItem.name}>
		<div class="compass-detail">
			<div class="compass-detail__head">
				<span class="compass-detail__icon" aria-hidden="true">
					<Icon icon={activeItem.icon ?? "material-symbols:extension-rounded"} />
				</span>
				{#if activeItem.tags.length > 0}
					<div class="compass-detail__tags">
						{#each activeItem.tags as tag}
							<span class="compass-detail__tag">{tag}</span>
						{/each}
					</div>
				{/if}
			</div>

			<div class="compass-detail__desc">
				{#each paragraphs(activeItem.description) as para}
					{#if para.startsWith("·")}
						<p class="compass-detail__bullet">{para}</p>
					{:else}
						<p>{para}</p>
					{/if}
				{/each}
			</div>

			<div class="compass-detail__links">
				{#if activeItem.github}
					<a class="compass-detail__link" href={activeItem.github} target="_blank" rel="noopener noreferrer">
						<Icon icon="fa6-brands:github" aria-hidden="true" />
						{i18n(I18nKey.compassViewSource)}
					</a>
				{/if}
				<a class="compass-detail__link" href={activeItem.href} target="_blank" rel="noopener noreferrer">
					<Icon icon="material-symbols:open-in-new-rounded" aria-hidden="true" />
					{i18n(I18nKey.compassViewSite)}
				</a>
			</div>

			{#if activeItem.thanks}
				<p class="compass-detail__thanks">
					<Icon icon="material-symbols:favorite-rounded" aria-hidden="true" />
					{activeItem.thanks}
				</p>
			{/if}
		</div>
	</Dialog>
{/if}

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

/* 详情弹窗 */
.compass-detail
	display: flex
	flex-direction: column
	gap: 1rem
	min-width: 0

	&__head
		display: flex
		flex-direction: column
		gap: 0.625rem

	&__icon
		display: flex
		align-items: center
		justify-content: center
		width: 3rem
		height: 3rem
		border-radius: var(--shape-corner-m)
		background: unquote("color-mix(in oklab, var(--primary) 14%, var(--surface-container-high))")
		color: var(--primary)
		> :global(svg)
			width: 1.75rem
			height: 1.75rem

	&__tags
		display: flex
		flex-wrap: wrap
		gap: 0.375rem

	&__tag
		padding: 0.125rem 0.5625rem
		border-radius: var(--shape-corner-full)
		background: var(--surface-container-high)
		color: var(--on-surface-variant)
		font: var(--m3e-type-label-small)

	&__desc
		display: flex
		flex-direction: column
		gap: 0.5rem
		p
			margin: 0
			color: var(--on-surface-variant)
			font: var(--m3e-type-body-small)
			line-height: 1.6

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
		padding: 0.375rem 0.75rem
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
		gap: 0.375rem
		margin: 0.25rem 0 0
		padding-top: 0.875rem
		border-top: 1px solid var(--outline-variant)
		color: var(--on-surface-variant)
		font: var(--m3e-type-body-small)
		font-weight: 600

		> :global(svg)
			width: 1rem
			height: 1rem
			color: #e57373
</style>
