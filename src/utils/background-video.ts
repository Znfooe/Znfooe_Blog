/**
 * 动态视频背景（BackgroundVideo）运行时契约。
 *
 * 与 wallpaperMode 的 `video` 档联动：仅当 `html[data-wallpaper-mode="video"]`
 * 时才显示并播放；其余模式零 DOM、零请求。
 *
 * 帧率档位（60 / 120）由访客在显示设置中选择，持久化到 localStorage
 * 键 `BACKGROUND_VIDEO_FPS_KEY`，切换时广播 `BACKGROUND_VIDEO_FPS_CHANGE_EVENT`。
 */

/** 帧率档位偏好存储键（localStorage）。 */
export const BACKGROUND_VIDEO_FPS_KEY = "background-video-fps";

/** 帧率档位切换事件。 */
export const BACKGROUND_VIDEO_FPS_CHANGE_EVENT = "background-video:fps";

/** 合法帧率档位（与配置 src 的 key 对应）。 */
export type BackgroundVideoFps = string;

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
