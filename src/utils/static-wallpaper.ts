/** 静态壁纸访客偏好存储键。 */
export const STATIC_WALLPAPER_KEY = "static-wallpaper";

/** 静态壁纸切换事件；BannerStage 在持久外壳中监听并即时更新图片层。 */
export const STATIC_WALLPAPER_CHANGE_EVENT = "static-wallpaper:change";

/** 读取访客选择；无值或存储不可用时回退站点默认 id。 */
export function getStoredStaticWallpaperId(defaultId: string): string {
	try {
		return localStorage.getItem(STATIC_WALLPAPER_KEY) || defaultId;
	} catch {
		return defaultId;
	}
}

/** 保存静态壁纸 id、同步根节点状态并广播切换事件。 */
export function setStaticWallpaperId(id: string): void {
	try {
		localStorage.setItem(STATIC_WALLPAPER_KEY, id);
	} catch {
		// 隐私模式或存储配额异常时仍保留当前页面即时切换。
	}
	document.documentElement.dataset.staticWallpaperId = id;
	window.dispatchEvent(
		new CustomEvent(STATIC_WALLPAPER_CHANGE_EVENT, { detail: { id } }),
	);
}
