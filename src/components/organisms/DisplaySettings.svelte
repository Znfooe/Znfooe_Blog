<script lang="ts">
import AccentBar from "@components/atoms/display/AccentBar.svelte";
import PanelStack from "@components/atoms/display/PanelStack.svelte";
import ProgressIndicator from "@components/atoms/feedback/ProgressIndicator.svelte";
import SegmentedButton from "@components/atoms/selection/SegmentedButton.svelte";
import Slider from "@components/atoms/selection/Slider.svelte";
import Switch from "@components/atoms/selection/Switch.svelte";
import I18nKey from "@i18n/i18nKey";
import { i18n } from "@i18n/translation";
import Icon from "@iconify/svelte";
import {
	BACKGROUND_WALLPAPER_PROGRESS_EVENT,
	ensureWallpaperReady,
	getStoredVideoFps,
	getStoredWallpaperId,
	getWallpaperDownload,
	hasStoredWallpaperId,
	resolveMediaUrl,
	setVideoFps,
	setWallpaperId,
} from "@utils/background-video";
import {
	defaultMode,
	flipToMode,
	getStoredMode,
	LAYOUT_MODE_CHANGE_EVENT,
	storeMode,
} from "@utils/layout-mode";
import {
	MC_SPECS,
	MC_STYLES,
	type McSpec,
	type McStyle,
	resolveScheme,
} from "@utils/mc-utils";
import {
	getDefaultHue,
	getDefaultTextureOpacity,
	getDefaultTexturePreset,
	getHue,
	getMotionPreference,
	getStoredTextureOpacity,
	getStoredTexturePreset,
	getStoredWallpaperMode,
	setHue,
	setMotionPreference,
	setTextureOpacity,
	setTexturePreset,
	setWallpaperMode,
} from "@utils/setting-utils";
import { getSpec, getStyle, setSpec, setStyle } from "@utils/theme-utils";
import { onMount } from "svelte";
import {
	getDefaultSpec,
	getDefaultStyle,
	getDefaultWallpaperId,
	resolveBackgroundWallpapers,
	resolveDisplaySettings,
	siteConfig,
} from "@/config";
import type { WallpaperMode } from "@/types/config";
import type { PostListMode } from "@/types/postListConfig";
import type { TexturePreset } from "@/types/textureConfig";

let { class: className = "" }: { class?: string } = $props();

const displayConfig = resolveDisplaySettings();

const defaultHue = getDefaultHue();
const defaultStyle = getDefaultStyle() as McStyle;
const defaultSpec = getDefaultSpec() as McSpec;
let hue = $state(getHue());
let style = $state<McStyle>(getStyle());
let spec = $state<McSpec>(getSpec());
let dark = $state(
	typeof document !== "undefined" &&
		document.documentElement.classList.contains("dark"),
);

let motionReduced = $state(false);

// 文章列表布局（list/grid）：初始值取访客偏好，变化时存储 + FLIP 重排
const defaultLayoutMode = defaultMode();
let postListMode = $state<PostListMode>(getStoredMode());
let lastAppliedMode = postListMode;
const defaultWallpaperMode = siteConfig.wallpaperMode.defaultMode;
let wallpaperMode = $state<WallpaperMode>(getStoredWallpaperMode());
let lastAppliedWallpaperMode = wallpaperMode;

// 动态视频壁纸：可选列表（legacy backgroundVideo 为 id="default" 首项），
// 仅多于一条时渲染选择器；点选延迟壁纸（deferLoad）即开始带进度下载
const defaultWallpaperId = getDefaultWallpaperId();
const wallpapers = resolveBackgroundWallpapers().map((wallpaper) => ({
	...wallpaper,
	src: Object.fromEntries(
		Object.entries(wallpaper.src ?? {}).map(([fps, src]) => [
			fps,
			resolveMediaUrl(src),
		]),
	),
	thumb: wallpaper.thumb
		? resolveMediaUrl(wallpaper.thumb)
		: wallpaper.poster
			? resolveMediaUrl(wallpaper.poster)
			: "",
}));
const showWallpaperSelector = wallpapers.length > 1;
let wallpaperId = $state(getStoredWallpaperId(defaultWallpaperId));
let lastAppliedWallpaperId = wallpaperId;
const currentWallpaper = $derived(
	wallpapers.find((w) => w.id === wallpaperId) ??
		wallpapers.find((w) => w.id === defaultWallpaperId) ??
		wallpapers[0],
);

// 动态视频背景帧率档位（60 / 120），跟随当前壁纸的源档位
const initialWallpaper = currentWallpaper;
const initialFpsOptions = Object.keys(initialWallpaper?.src ?? {});
let videoFps = $state(
	getStoredVideoFps(
		initialWallpaper?.defaultFps ?? initialFpsOptions[0] ?? "60",
	),
);
if (initialFpsOptions.length > 0 && !initialFpsOptions.includes(videoFps)) {
	videoFps = initialWallpaper?.defaultFps ?? initialFpsOptions[0];
}
const videoFpsOptions = $derived(Object.keys(currentWallpaper?.src ?? {}));
let lastAppliedVideoFps = videoFps;

// 延迟壁纸下载进度（模块级 Map 非响应式，经 downloadRefresh 触发重算）
let downloadRefresh = $state(0);
const wallpaperDownload = $derived.by(() => {
	downloadRefresh;
	const wallpaper = currentWallpaper;
	if (!wallpaper?.deferLoad) return null;
	const videoUrl =
		wallpaper.src[videoFps] ?? Object.values(wallpaper.src ?? {})[0] ?? "";
	if (!videoUrl) return null;
	return getWallpaperDownload(videoUrl);
});

/** 指定壁纸的下载状态（模板内读取 downloadRefresh 建立响应依赖）。 */
function wallpaperStatus(
	wallpaper: (typeof wallpapers)[number],
): string | null {
	downloadRefresh;
	if (!wallpaper.deferLoad) return null;
	const videoUrl =
		wallpaper.src[videoFps] ?? Object.values(wallpaper.src ?? {})[0] ?? "";
	if (!videoUrl) return null;
	return getWallpaperDownload(videoUrl).status;
}

// 背景纹理预设与浓度
const defaultTexturePreset = getDefaultTexturePreset();
const defaultTextureOpacity = getDefaultTextureOpacity();
let texturePreset = $state<TexturePreset>(getStoredTexturePreset());
let lastAppliedTexturePreset = texturePreset;
let textureOpacity = $state<number>(getStoredTextureOpacity());

const textureOptions: {
	value: TexturePreset;
	labelKey: I18nKey;
	icon: string;
}[] = [
	{
		value: "none",
		labelKey: I18nKey.texturePresetNone,
		icon: "material-symbols:block-rounded",
	},
	{
		value: "starlight",
		labelKey: I18nKey.texturePresetStarlight,
		icon: "material-symbols:auto-awesome-outline-rounded",
	},
	{
		value: "cyber-dots",
		labelKey: I18nKey.texturePresetCyberDots,
		icon: "material-symbols:grid-view-rounded",
	},
	{
		value: "topography",
		labelKey: I18nKey.texturePresetTopography,
		icon: "material-symbols:waves-rounded",
	},
	{
		value: "geometric",
		labelKey: I18nKey.texturePresetGeometric,
		icon: "material-symbols:category-outline-rounded",
	},
	{
		value: "sakura",
		labelKey: I18nKey.texturePresetSakura,
		icon: "material-symbols:local-florist-outline-rounded",
	},
];

// 明暗切换时重算色卡（LightDarkSwitch 改 <html> 的 class）
onMount(() => {
	const observer = new MutationObserver(() => {
		dark = document.documentElement.classList.contains("dark");
	});
	observer.observe(document.documentElement, {
		attributes: true,
		attributeFilter: ["class"],
	});
	motionReduced = getMotionPreference();
	// 延迟壁纸下载进度事件 → 触发派生状态重算（下载在面板外也会推进）
	const refreshDownload = () => (downloadRefresh += 1);
	window.addEventListener(BACKGROUND_WALLPAPER_PROGRESS_EVENT, refreshDownload);
	return () => {
		observer.disconnect();
		window.removeEventListener(
			BACKGROUND_WALLPAPER_PROGRESS_EVENT,
			refreshDownload,
		);
	};
});

/** 完整重置：色相 / 配色风格 / Color Spec / 列表布局 / 背景纹理 全部还原为站点默认（点击即生效，无确认弹窗） */
function confirmReset() {
	hue = defaultHue;
	style = defaultStyle;
	spec = defaultSpec;
	postListMode = defaultLayoutMode;
	wallpaperMode = defaultWallpaperMode;
	wallpaperId = defaultWallpaperId;
	texturePreset = defaultTexturePreset;
	textureOpacity = defaultTextureOpacity;
	const resetWallpaper = currentWallpaper;
	const resetFpsOptions = Object.keys(resetWallpaper?.src ?? {});
	videoFps = resetWallpaper?.defaultFps ?? resetFpsOptions[0] ?? "60";
}

/** 是否有可重置的偏离（控制 Reset 按钮可见性） */
const isDirty = $derived(
	hue !== defaultHue ||
		style !== defaultStyle ||
		spec !== defaultSpec ||
		postListMode !== defaultLayoutMode ||
		wallpaperMode !== defaultWallpaperMode ||
		wallpaperId !== defaultWallpaperId ||
		texturePreset !== defaultTexturePreset ||
		textureOpacity !== defaultTextureOpacity,
);

$effect(() => {
	if (hue || hue === 0) setHue(hue);
});
$effect(() => {
	setStyle(style);
});
$effect(() => {
	setSpec(spec);
});
$effect(() => {
	setMotionPreference(motionReduced);
});
$effect(() => {
	if (wallpaperMode === lastAppliedWallpaperMode) return;
	lastAppliedWallpaperMode = wallpaperMode;
	setWallpaperMode(wallpaperMode);
});
$effect(() => {
	if (wallpaperId === lastAppliedWallpaperId) return;
	lastAppliedWallpaperId = wallpaperId;
	setWallpaperId(wallpaperId);
});
$effect(() => {
	// 仅在访客真正切换帧率时持久化并广播，避免挂载时触发下载
	if (videoFps === lastAppliedVideoFps) return;
	lastAppliedVideoFps = videoFps;
	setVideoFps(videoFps);
});

/**
 * 点选动态壁纸：选中即应用并隐含切换到 video 模式；帧率档不存在时跟随
 * 新壁纸默认档；延迟壁纸（含失败重试与再点选）立即开始带进度下载。
 */
function selectWallpaper(id: string) {
	triggerLiquid(wallpaperId, id);
	wallpaperId = id;
	if (wallpaperMode !== "video") wallpaperMode = "video";
	const wallpaper = wallpapers.find((w) => w.id === id);
	if (!wallpaper) return;
	const fpsOptions = Object.keys(wallpaper.src ?? {});
	if (!fpsOptions.includes(videoFps)) {
		videoFps = wallpaper.defaultFps ?? fpsOptions[0] ?? "60";
	}
	if (wallpaper.deferLoad) {
		const videoUrl =
			wallpaper.src[videoFps] ?? Object.values(wallpaper.src ?? {})[0];
		if (videoUrl) ensureWallpaperReady(videoUrl);
	}
	// 点选的选项恰好等于当前默认档（未持久化）时，$effect 的变更守卫会跳过；
	// 但访客的点击即明确选择，需要落盘，否则延迟壁纸下次整页加载无法会话恢复。
	if (id === lastAppliedWallpaperId && !hasStoredWallpaperId()) {
		lastAppliedWallpaperId = id;
		setWallpaperId(id);
	}
}

// 液体填充/流失过渡：切换壁纸时旧行高亮向右流失、新行液体向右填入。
// nonce 防止快速连点时旧定时器清掉新过渡；reduced-motion 下不触发。
let liquidNonce = 0;
let liquid = $state<{ from: string; to: string; nonce: number } | null>(null);
function triggerLiquid(from: string, to: string) {
	if (from === to || motionReduced) return;
	const nonce = ++liquidNonce;
	liquid = { from, to, nonce };
	setTimeout(() => {
		if (liquid?.nonce === nonce) liquid = null;
	}, 450);
}
const isLiquidFill = (id: string) => liquid?.to === id;
const isLiquidDrain = (id: string) => liquid?.from === id;
$effect(() => {
	if (texturePreset === lastAppliedTexturePreset) return;
	lastAppliedTexturePreset = texturePreset;
	setTexturePreset(texturePreset);
});
$effect(() => {
	setTextureOpacity(textureOpacity);
});
$effect(() => {
	if (postListMode === lastAppliedMode) return;
	lastAppliedMode = postListMode;
	storeMode(postListMode);
	// 全局广播：番剧页等其它消费方（.anime-list）跟随切换并各自 FLIP
	window.dispatchEvent(
		new CustomEvent(LAYOUT_MODE_CHANGE_EVENT, {
			detail: { layout: postListMode },
		}),
	);
	// 首页才有 #post-list；其它页面仅存储偏好 + 事件同步，下次进首页生效
	const container = document.getElementById("post-list");
	if (container) flipToMode(container, postListMode);
});

function styleKey(s: McStyle): I18nKey {
	switch (s) {
		case "tonalSpot":
			return I18nKey.styleTonalSpot;
		case "vibrant":
			return I18nKey.styleVibrant;
		case "content":
			return I18nKey.styleContent;
		case "expressive":
			return I18nKey.styleExpressive;
		case "rainbow":
			return I18nKey.styleRainbow;
		case "fruitSalad":
			return I18nKey.styleFruitSalad;
		case "monochrome":
			return I18nKey.styleMonochrome;
		case "neutral":
			return I18nKey.styleNeutral;
		case "fidelity":
			return I18nKey.styleFidelity;
	}
}

/** 某个风格在当前色相/明暗/规范下的 primary/secondary/tertiary */
function styleColors(s: McStyle, h: number, d: boolean, sp: McSpec) {
	const scheme = resolveScheme(h, d, s, sp);
	return {
		primary: scheme.primary ?? "#888",
		secondary: scheme.secondary ?? "#888",
		tertiary: scheme.tertiary ?? "#888",
	};
}

/** 当前主色（标题右侧预览圆点） */
const currentColor = $derived(styleColors(style, hue, dark, spec).primary);

/** 9 个风格的色卡预览（3×3 网格） */
const stylePreviews = $derived(
	MC_STYLES.map((s) => ({
		style: s,
		label: i18n(styleKey(s)),
		colors: styleColors(s, hue, dark, spec),
	})),
);
</script>

<div id="display-setting" class="float-panel float-panel-closed absolute transition-all w-80 {className}">
    <PanelStack>
        <!-- 段一：主题配色（色相 + 风格九宫格 + Color Spec） -->
        <div class="p-4 flex flex-col gap-3">
            <div class="flex flex-row gap-2 items-center justify-between">
                <div class="flex gap-2 font-bold text-lg text-[var(--on-surface)] transition relative ml-3">
                    <AccentBar size="small" class="absolute -left-3 top-[0.33rem]" />
                    {i18n(I18nKey.themeColor)}
                    <button aria-label="Reset to Default" class="float-control w-7 h-7 rounded-md active:scale-90 will-change-transform flex items-center justify-center"
                            class:opacity-0={!isDirty} class:pointer-events-none={!isDirty} onclick={confirmReset}>
                        <Icon icon="fa6-solid:arrow-rotate-left" class="text-[0.875rem]"></Icon>
                    </button>
                </div>
                <div class="flex gap-1 items-center">
                    <!-- 当前色相值展示（段内用低一级容器色保持对比） -->
                    <div title={i18n(I18nKey.themeColor)}
                         class="h-7 min-w-16 px-1 rounded-(--shape-corner-m) flex items-center justify-center
                                bg-(--surface-container) text-sm font-bold text-(--on-surface)">
                        {hue}
                    </div>
                    <!-- 当前主色实时预览 -->
                    <div class="h-7 w-7 rounded-full" title={i18n(I18nKey.themeColor)}
                         style={`background: ${currentColor}; box-shadow: inset 0 0 0 1px var(--outline-variant)`}></div>
                </div>
            </div>
            <Slider bind:value={hue} min={0} max={360} step={5} label={i18n(I18nKey.themeColor)} />

            {#if displayConfig.colorStyle}
                <div class="flex flex-col gap-2 pt-1">
                    <span class="text-sm font-bold text-[var(--on-surface-variant)] ml-1">{i18n(I18nKey.colorStyle)}</span>
                    <div class="grid grid-cols-3 gap-2" role="radiogroup" aria-label={i18n(I18nKey.colorStyle)}>
                        {#each stylePreviews as p (p.style)}
                            <button
                                type="button"
                                role="radio"
                                aria-checked={style === p.style}
                                title={p.label}
                                aria-label={p.label}
                                class="m3-style-cell"
                                class:selected={style === p.style}
                                onclick={() => (style = p.style)}
                            >
                                <span class="m3-style-cell__dots">
                                    <span class="m3-style-cell__dot" style={`background: ${p.colors.primary}`}></span>
                                    <span class="m3-style-cell__dot" style={`background: ${p.colors.secondary}`}></span>
                                    <span class="m3-style-cell__dot" style={`background: ${p.colors.tertiary}`}></span>
                                </span>
                                <span class="m3-style-cell__name">{p.label}</span>
                            </button>
                        {/each}
                    </div>
                </div>
            {/if}

            {#if displayConfig.colorSpec}
                <div class="flex flex-col gap-1.5 pt-1">
                    <span class="text-sm font-bold text-[var(--on-surface-variant)] ml-1">{i18n(I18nKey.colorSpec)}</span>
                    <SegmentedButton
                        options={MC_SPECS.map((s) => ({
                            value: s,
                            label: s === "2021" ? i18n(I18nKey.spec2021) : i18n(I18nKey.spec2025),
                        }))}
                        bind:value={spec}
                        label={i18n(I18nKey.colorSpec)}
                    />
                </div>
            {/if}
        </div>

        <!-- 段二：界面布局（页面背景 + 列表布局 + 背景纹理） -->
        {#if displayConfig.wallpaperMode || displayConfig.layoutMode || displayConfig.texture}
            <div class="p-4 flex flex-col gap-3">
                {#if displayConfig.wallpaperMode}
                    <div class="flex flex-col gap-1.5">
                        <span class="text-sm font-bold text-[var(--on-surface-variant)] ml-1">{i18n(I18nKey.wallpaperMode)}</span>
                        <SegmentedButton
                            options={[
                                { value: "none", label: i18n(I18nKey.wallpaperModeNone) },
                                { value: "banner", label: i18n(I18nKey.wallpaperModeBanner) },
                                { value: "video", label: i18n(I18nKey.wallpaperModeVideo) },
                            ]}
                            bind:value={wallpaperMode}
                            label={i18n(I18nKey.wallpaperMode)}
                        />
                        {#if showWallpaperSelector}
                            <div class="flex flex-col gap-1.5 mt-1">
                                <span class="text-sm font-bold text-[var(--on-surface-variant)] ml-1">{i18n(I18nKey.backgroundWallpaper)}</span>
                                <div class="flex flex-col gap-1" role="radiogroup" aria-label={i18n(I18nKey.backgroundWallpaper)}>
                                    {#each wallpapers as wallpaper (wallpaper.id)}
                                        {@const status = wallpaperStatus(wallpaper)}
                                        {@const name = wallpaper.label ?? (wallpaper.id === "default" ? i18n(I18nKey.backgroundWallpaperDefault) : wallpaper.id)}
                                        <button
                                            type="button"
                                            role="radio"
                                            aria-checked={wallpaperId === wallpaper.id}
                                            title={status === "error" ? i18n(I18nKey.backgroundWallpaperFailed) : name}
                                            class="wallpaper-option"
                                            class:selected={wallpaperId === wallpaper.id && !isLiquidFill(wallpaper.id)}
                                            class:wallpaper-option--fill={isLiquidFill(wallpaper.id)}
                                            class:wallpaper-option--drain={isLiquidDrain(wallpaper.id)}
                                            onclick={() => selectWallpaper(wallpaper.id)}
                                        >
                                            {#if wallpaper.thumb}
                                                <img class="wallpaper-option__thumb" src={wallpaper.thumb} alt="" loading="lazy" decoding="async" />
                                            {/if}
                                            <span class="wallpaper-option__name">{name}</span>
                                            {#if status === "downloading"}
                                                <span class="wallpaper-option__status" title={i18n(I18nKey.backgroundWallpaperLoading)} aria-hidden="true">
                                                    <Icon icon="material-symbols:downloading-rounded" class="text-base" />
                                                </span>
                                            {:else if status === "error"}
                                                <span class="wallpaper-option__status" title={i18n(I18nKey.backgroundWallpaperFailed)} aria-hidden="true">
                                                    <Icon icon="material-symbols:error-outline-rounded" class="text-base" />
                                                </span>
                                            {:else if wallpaperId === wallpaper.id}
                                                <!-- 选中勾：跟随当前选择（下载中优先展示进度） -->
                                                <span class="wallpaper-option__status" aria-hidden="true">
                                                    <Icon icon="material-symbols:check-circle-rounded" class="text-base" />
                                                </span>
                                            {/if}
                                            <span class="wallpaper-option__liquid" aria-hidden="true">
                                                <span class="wallpaper-option__liquid-body"></span>
                                            </span>
                                        </button>
                                    {/each}
                                </div>
                                {#if wallpaperDownload?.status === "downloading"}
                                    <div class="flex items-center gap-2 mt-0.5 px-1">
                                        <ProgressIndicator
                                            progress={wallpaperDownload.progress ?? undefined}
                                            label={i18n(I18nKey.backgroundWallpaperLoading)}
                                            class="flex-1"
                                        />
                                        {#if wallpaperDownload.progress !== null}
                                            <span class="text-xs font-bold text-[var(--on-surface-variant)] tabular-nums">
                                                {Math.round(wallpaperDownload.progress * 100)}%
                                            </span>
                                        {/if}
                                    </div>
                                {/if}
                            </div>
                        {/if}
                        {#if wallpaperMode === "video" && videoFpsOptions.length > 1}
                            <div class="flex flex-col gap-1.5 mt-1">
                                <span class="text-sm font-bold text-[var(--on-surface-variant)] ml-1">{i18n(I18nKey.backgroundVideoFps)}</span>
                                <SegmentedButton
                                    options={videoFpsOptions.map((fps) => ({
                                        value: fps,
                                        label: `${fps} FPS`,
                                    }))}
                                    bind:value={videoFps}
                                    label={i18n(I18nKey.backgroundVideoFps)}
                                />
                            </div>
                        {/if}
                    </div>
                {/if}

                {#if displayConfig.layoutMode}
                    <div class="flex flex-col gap-1.5">
                        <span class="text-sm font-bold text-[var(--on-surface-variant)] ml-1">{i18n(I18nKey.layoutMode)}</span>
                        <SegmentedButton
                            options={[
                                { value: "list", label: i18n(I18nKey.layoutList) },
                                { value: "grid", label: i18n(I18nKey.layoutGrid) },
                            ]}
                            bind:value={postListMode}
                            label={i18n(I18nKey.layoutMode)}
                        />
                    </div>
                {/if}

                {#if displayConfig.texture}
                    <div class="flex flex-col gap-2 pt-1">
                        <span class="text-sm font-bold text-[var(--on-surface-variant)] ml-1">{i18n(I18nKey.texturePreset)}</span>
                        <div class="grid grid-cols-3 gap-2" role="radiogroup" aria-label={i18n(I18nKey.texturePreset)}>
                            {#each textureOptions as opt (opt.value)}
                                <button
                                    type="button"
                                    role="radio"
                                    aria-checked={texturePreset === opt.value}
                                    title={i18n(opt.labelKey)}
                                    aria-label={i18n(opt.labelKey)}
                                    class="m3-style-cell"
                                    class:selected={texturePreset === opt.value}
                                    onclick={() => (texturePreset = opt.value)}
                                >
                                    <Icon icon={opt.icon} class="text-lg" />
                                    <span class="m3-style-cell__name">{i18n(opt.labelKey)}</span>
                                </button>
                            {/each}
                        </div>
                    </div>
                {/if}
            </div>
        {/if}

        <!-- 段三：动效与体验 -->
        {#if displayConfig.reduceMotion}
            <div class="p-4 flex items-center justify-between">
                <div class="flex items-center gap-2">
                    <Icon icon="material-symbols:motion-photos-off" class="text-lg text-[var(--primary)]" />
                    <span class="text-sm font-bold text-[var(--on-surface)]">{i18n(I18nKey.reduceMotion)}</span>
                </div>
                <Switch bind:checked={motionReduced} label={i18n(I18nKey.reduceMotion)} icons />
            </div>
        {/if}
    </PanelStack>
</div>


<style lang="stylus">
    .m3-style-cell
        display: flex
        flex-direction: column
        align-items: center
        justify-content: center
        gap: 0.375rem
        padding: 0.5rem 0.25rem
        border: none
        border-radius: var(--shape-corner-s)
        background: transparent
        color: var(--on-surface-variant)
        font: var(--m3e-type-label-small)
        cursor: pointer
        user-select: none
        transition: background-color var(--m3e-duration-short) var(--m3e-easing-standard), color var(--m3e-duration-short) var(--m3e-easing-standard)
        &:hover
            background: unquote("color-mix(in oklab, var(--on-surface) 6%, transparent)")
        &.selected
            background: var(--secondary-container)
            color: var(--on-secondary-container)

        &__dots
            display: flex
            gap: 0.25rem

        &__dot
            width: 0.625rem
            height: 0.625rem
            border-radius: var(--shape-corner-full)
            box-shadow: unquote("inset 0 0 0 1px color-mix(in oklab, var(--on-surface) 20%, transparent)")

        &__name
            max-width: 100%
            overflow: hidden
            text-overflow: ellipsis
            white-space: nowrap

/* 动态壁纸选择条目：缩略图 + 名称 + 选中勾 + 液体填充/流失过渡 */
.wallpaper-option
    position: relative
    overflow: hidden
    display: flex
    align-items: center
    gap: 0.625rem
    padding: 0.375rem 0.5rem
    border: none
    border-radius: var(--shape-corner-m)
    background: transparent
    color: var(--on-surface-variant)
    font: var(--m3e-type-label-large)
    cursor: pointer
    user-select: none
    text-align: left
    transition: background-color var(--m3e-duration-short) var(--m3e-easing-standard), color var(--m3e-duration-short) var(--m3e-easing-standard)
    &:hover
        background: unquote("color-mix(in oklab, var(--on-surface) 6%, transparent)")
    &.selected
        background: var(--secondary-container)
        color: var(--on-secondary-container)

.wallpaper-option__thumb
    position: relative
    z-index: 1
    width: 4rem
    height: 2.25rem
    flex: none
    object-fit: cover
    border-radius: var(--shape-corner-s)
    box-shadow: unquote("inset 0 0 0 1px color-mix(in oklab, var(--on-surface) 15%, transparent)")

.wallpaper-option__name
    position: relative
    z-index: 1
    flex: 1
    min-width: 0
    overflow: hidden
    text-overflow: ellipsis
    white-space: nowrap

.wallpaper-option__status
    position: relative
    z-index: 1
    display: flex
    align-items: center
    flex: none

/* 液体过渡层：切换时新选中行液体向右填入、旧行高亮向右流失，共享同色与波前形态 */
.wallpaper-option__liquid
    display: none
    position: absolute
    inset: 0
    pointer-events: none
    z-index: 0

.wallpaper-option--fill .wallpaper-option__liquid
    display: block
    animation: wallpaper-liquid-fill var(--m3e-duration-long) var(--m3e-easing-emphasized-decelerate) forwards

.wallpaper-option--drain .wallpaper-option__liquid
    display: block
    animation: wallpaper-liquid-drain var(--m3e-duration-long) var(--m3e-easing-emphasized-accelerate) forwards

.wallpaper-option__liquid-body
    position: absolute
    inset: 0
    background: var(--secondary-container)

    /* 波前：半圆凸起沿高度平铺；填充挂右缘（凸向前进方向），流失挂左缘（凸向液体侧） */
    &::before,
    &::after
        content: ""
        position: absolute
        top: 0
        bottom: 0
        width: 0.5rem
        background-size: 0.5rem 0.5rem

    &::before
        right: 100%
        background-image: radial-gradient(circle at 100% 50%, var(--secondary-container) 0.24rem, transparent 0.25rem)

    &::after
        left: 100%
        background-image: radial-gradient(circle at 0 50%, var(--secondary-container) 0.24rem, transparent 0.25rem)

@keyframes wallpaper-liquid-fill
    from
        transform: translateX(-101%)
    to
        transform: translateX(0)

@keyframes wallpaper-liquid-drain
    from
        transform: translateX(0)
    to
        transform: translateX(101%)

/* 系统级减少动效：跳过液体动画直接呈现终态（fill 终态 = 选中背景，drain 终态 = 完全移出） */
@media (prefers-reduced-motion: reduce)
    .wallpaper-option--fill .wallpaper-option__liquid,
    .wallpaper-option--drain .wallpaper-option__liquid
        animation-duration: 0.01ms

</style>
