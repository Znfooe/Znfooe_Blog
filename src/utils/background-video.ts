import { url } from "@utils/url-utils";

/**
 * 动态视频背景（BackgroundVideo）运行时契约。
 *
 * 与 wallpaperMode 的 `video` 档联动：仅当 `html[data-wallpaper-mode="video"]`
 * 时才显示并播放；其余模式零 DOM、零请求。
 *
 * 壁纸档位由访客在显示设置中选择，持久化到 localStorage 键
 * `BACKGROUND_WALLPAPER_KEY`，切换时广播 `BACKGROUND_WALLPAPER_CHANGE_EVENT`；
 * 帧率档位（60 / 120）持久化到 `BACKGROUND_VIDEO_FPS_KEY`，切换时广播
 * `BACKGROUND_VIDEO_FPS_CHANGE_EVENT`。
 *
 * 延迟加载（deferLoad）壁纸的下载状态由本模块按视频 URL 统一管理：
 * 下载启动 / 进度 / 完成 / 失败时广播 `BACKGROUND_WALLPAPER_PROGRESS_EVENT`，
 * 首次成功后经 Cache API 持久化，跨会话命中免二次下载。
 */

/** 帧率档位偏好存储键（localStorage）。 */
export const BACKGROUND_VIDEO_FPS_KEY = "background-video-fps";

/** 帧率档位切换事件。 */
export const BACKGROUND_VIDEO_FPS_CHANGE_EVENT = "background-video:fps";

/** 壁纸选择偏好存储键（localStorage）。 */
export const BACKGROUND_WALLPAPER_KEY = "background-wallpaper";

/** 壁纸切换事件。 */
export const BACKGROUND_WALLPAPER_CHANGE_EVENT = "background-wallpaper:change";

/** 壁纸下载进度事件（下载启动 / 进度 / 完成 / 失败时广播）。 */
export const BACKGROUND_WALLPAPER_PROGRESS_EVENT =
	"background-wallpaper:progress";

/** Cache API 存储名：延迟壁纸跨会话持久化。 */
const WALLPAPER_CACHE_NAME = "shirone-background-wallpapers";

/** 合法帧率档位（与配置 src 的 key 对应）。 */
export type BackgroundVideoFps = string;

/** 延迟壁纸下载状态。 */
export type BackgroundWallpaperDownloadStatus =
	| "idle"
	| "downloading"
	| "ready"
	| "error";

export interface BackgroundWallpaperDownloadState {
	status: BackgroundWallpaperDownloadStatus;
	/** 已下载比例 0-1；响应无 Content-Length 时为 null（不确定进度）。 */
	progress: number | null;
}

interface DownloadEntry {
	status: BackgroundWallpaperDownloadStatus;
	progress: number | null;
	xhr: XMLHttpRequest | null;
	/** 就绪后的 blob: 播放地址。 */
	objectUrl: string;
}

/** 以视频 URL 为键的下载登记表（模块级单例，Swup 导航间共享）。 */
const downloadEntries = new Map<string, DownloadEntry>();

/** 读取访客选择的帧率档位；无效则回退 defaultFps。 */
export function getStoredVideoFps(defaultFps: string): BackgroundVideoFps {
	try {
		const value = localStorage.getItem(BACKGROUND_VIDEO_FPS_KEY);
		if (value) return value;
	} catch {
		// 隐私模式等写入失败：回退默认档。
	}
	return defaultFps;
}

/** 保存帧率档位并广播切换事件。 */
export function setVideoFps(fps: BackgroundVideoFps): void {
	try {
		localStorage.setItem(BACKGROUND_VIDEO_FPS_KEY, fps);
	} catch {
		// 忽略写入失败。
	}
	window.dispatchEvent(
		new CustomEvent(BACKGROUND_VIDEO_FPS_CHANGE_EVENT, { detail: { fps } }),
	);
}

/** 读取访客选择的壁纸 id；无效或未选择时回退 defaultId。 */
export function getStoredWallpaperId(defaultId: string): string {
	try {
		const value = localStorage.getItem(BACKGROUND_WALLPAPER_KEY);
		if (value) return value;
	} catch {
		// 隐私模式等读取失败：回退默认壁纸。
	}
	return defaultId;
}

/** 是否为访客明确存储过的壁纸选择（区分默认档与主动选择）。 */
export function hasStoredWallpaperId(): boolean {
	try {
		return Boolean(localStorage.getItem(BACKGROUND_WALLPAPER_KEY));
	} catch {
		return false;
	}
}

/** 保存壁纸选择并广播切换事件。 */
export function setWallpaperId(id: string): void {
	try {
		localStorage.setItem(BACKGROUND_WALLPAPER_KEY, id);
	} catch {
		// 忽略写入失败。
	}
	window.dispatchEvent(
		new CustomEvent(BACKGROUND_WALLPAPER_CHANGE_EVENT, { detail: { id } }),
	);
}

/** 站内路径补 base 前缀；外链与 data: URL 原样返回。 */
export function resolveMediaUrl(src: string): string {
	if (/^(https?:)?\/\//.test(src) || src.startsWith("data:")) return src;
	return url(src);
}

/**
 * 解析壁纸在当前帧率偏好下的视频地址：帧率档缺失时回退默认档，
 * 仍缺失时回退第一个源；无可用源返回 null。
 */
export function resolveWallpaperVideoUrl(
	wallpaper: { src?: Record<string, string>; defaultFps?: string },
	fps: string,
): string | null {
	const src = wallpaper.src ?? {};
	return (
		src[fps] ?? src[wallpaper.defaultFps ?? ""] ?? Object.values(src)[0] ?? null
	);
}

/** 读取指定视频地址的下载状态（仅延迟加载壁纸使用）。 */
export function getWallpaperDownload(
	videoUrl: string,
): BackgroundWallpaperDownloadState {
	const entry = downloadEntries.get(videoUrl);
	if (!entry) return { status: "idle", progress: null };
	return { status: entry.status, progress: entry.progress };
}

/** 延迟壁纸就绪后的可播放地址（blob: URL）；未就绪返回 null。 */
export function getWallpaperReadyUrl(videoUrl: string): string | null {
	const entry = downloadEntries.get(videoUrl);
	if (entry?.status === "ready" && entry.objectUrl) return entry.objectUrl;
	return null;
}

function broadcastProgress(videoUrl: string): void {
	window.dispatchEvent(
		new CustomEvent(BACKGROUND_WALLPAPER_PROGRESS_EVENT, {
			detail: { url: videoUrl, ...getWallpaperDownload(videoUrl) },
		}),
	);
}

function absoluteUrl(videoUrl: string): string {
	try {
		return new URL(videoUrl, window.location.href).href;
	} catch {
		return videoUrl;
	}
}

async function readFromCache(videoUrl: string): Promise<Blob | null> {
	try {
		if (!("caches" in window)) return null;
		const cache = await window.caches.open(WALLPAPER_CACHE_NAME);
		const cached = await cache.match(absoluteUrl(videoUrl));
		if (!cached?.ok) return null;
		return await cached.blob();
	} catch {
		return null;
	}
}

async function persistToCache(videoUrl: string, blob: Blob): Promise<void> {
	try {
		if (!("caches" in window)) return;
		const cache = await window.caches.open(WALLPAPER_CACHE_NAME);
		await cache.put(
			absoluteUrl(videoUrl),
			new Response(blob, {
				headers: { "Content-Type": blob.type || "video/mp4" },
			}),
		);
	} catch {
		// 存储配额不足等：静默降级为会话内缓存。
	}
}

/**
 * 确保延迟壁纸就绪：已就绪或下载中直接返回；先查 Cache API（跨会话命中
 * 则零网络），未命中再以 XHR 下载并广播进度（响应无 Content-Length 时
 * progress 为 null 的不确定进度）。失败后再次调用即重试。
 */
export function ensureWallpaperReady(videoUrl: string): void {
	const existing = downloadEntries.get(videoUrl);
	if (existing && existing.status !== "idle" && existing.status !== "error") {
		return;
	}

	const entry: DownloadEntry = {
		status: "downloading",
		progress: null,
		xhr: null,
		objectUrl: "",
	};
	downloadEntries.set(videoUrl, entry);
	broadcastProgress(videoUrl);

	void (async () => {
		const cached = await readFromCache(videoUrl);
		if (downloadEntries.get(videoUrl) !== entry) return;
		if (cached) {
			entry.objectUrl = URL.createObjectURL(cached);
			entry.status = "ready";
			entry.progress = 1;
			broadcastProgress(videoUrl);
			return;
		}

		const xhr = new XMLHttpRequest();
		entry.xhr = xhr;
		xhr.open("GET", videoUrl);
		xhr.responseType = "blob";
		xhr.onprogress = (event) => {
			entry.progress =
				event.lengthComputable && event.total > 0
					? Math.min(event.loaded / event.total, 1)
					: null;
			broadcastProgress(videoUrl);
		};
		xhr.onload = () => {
			entry.xhr = null;
			if (
				xhr.status >= 200 &&
				xhr.status < 300 &&
				xhr.response instanceof Blob
			) {
				entry.objectUrl = URL.createObjectURL(xhr.response);
				entry.status = "ready";
				entry.progress = 1;
				void persistToCache(videoUrl, xhr.response);
			} else {
				entry.status = "error";
				entry.progress = null;
			}
			broadcastProgress(videoUrl);
		};
		xhr.onerror = () => {
			entry.xhr = null;
			entry.status = "error";
			entry.progress = null;
			broadcastProgress(videoUrl);
		};
		xhr.send();
	})();
}
