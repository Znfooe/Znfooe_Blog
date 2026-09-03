/**
 * 循环依赖规避：navBarConfig 等配置消费 i18n，本模块只允许从具体文件导入 siteConfig，
 * 禁止走 @/config barrel（见 src/config/README.md）
 *
 * 环境安全说明（重要，曾导致「所有按钮点不动」的 hydration 崩溃）：
 * `node:async_hooks` 是 Node-only 模块。Vite 在客户端构建时把它 externalize 成
 * `__vite-browser-external:node:async_hooks`，其 `AsyncLocalStorage` 是一个「访问即抛错」
 * 的 getter。若在本模块顶层 `import { AsyncLocalStorage }` 再 `new AsyncLocalStorage()`，
 * 任何引用本模块的 Svelte island（ArchivePanel / Search / LightDarkSwitch / DisplaySettings /
 * SiteNavigationDrawer / ContextMenu 等）在浏览器 hydrate 时都会崩溃，所有交互失效。
 *
 * 因此：
 * - 服务端（SSR）：通过顶层 `await import("node:async_hooks")` 同步拿到真实 ALS 实例；
 *   由于本模块在 Astro 渲染（Node 端）中加载，动态 import 会立即 resolve，`run`/`enterWith`/
 *   `getStore` 都是同步语义，不影响多语言渲染时序。
 * - 客户端（hydrate）：`import.meta.env.SSR === false`，走 BrowserLanguageStore 降级，
 *   从 `document.documentElement.lang`（SSR 已写入正确语言）读取当前语言，绝不触碰 node 模块。
 */
import { siteConfig } from "../config/siteConfig.ts";
import type I18nKey from "./i18nKey.ts";
import { en } from "./languages/en.ts";
import { es } from "./languages/es.ts";
import { id } from "./languages/id.ts";
import { ja } from "./languages/ja.ts";
import { ko } from "./languages/ko.ts";
import { th } from "./languages/th.ts";
import { tr } from "./languages/tr.ts";
import { vi } from "./languages/vi.ts";
import { zh_CN } from "./languages/zh_CN.ts";
import { zh_TW } from "./languages/zh_TW.ts";

export type Translation = {
	[K in I18nKey]: string;
};

const defaultTranslation = en;

const map: { [key: string]: Translation } = {
	es: es,
	en: en,
	en_us: en,
	en_gb: en,
	en_au: en,
	zh_cn: zh_CN,
	zh_tw: zh_TW,
	ja: ja,
	ja_jp: ja,
	ko: ko,
	ko_kr: ko,
	th: th,
	th_th: th,
	vi: vi,
	vi_vn: vi,
	id: id,
	tr: tr,
	tr_tr: tr,
};

export function getTranslation(lang: string): Translation {
	return map[lang.toLowerCase()] || defaultTranslation;
}

/** 语言存储的最小接口（服务端 ALS 与客户端 shim 均实现）。 */
interface LanguageStore {
	run<T>(lang: string, fn: () => T): T;
	enterWith(lang: string): void;
	getStore(): string | undefined;
}

/**
 * 客户端 shim：无并发渲染隔离需求，仅持有「当前语言」这一个全局值。
 * hydrate 阶段组件按页面语言翻译时使用。
 */
class BrowserLanguageStore implements LanguageStore {
	private current: string | undefined;

	run<T>(lang: string, fn: () => T): T {
		const prev = this.current;
		this.current = lang;
		try {
			return fn();
		} finally {
			this.current = prev;
		}
	}

	enterWith(lang: string): void {
		this.current = lang;
	}

	getStore(): string | undefined {
		return this.current;
	}
}

/**
 * 服务端语言存储：Node 端同步就绪的 AsyncLocalStorage。
 * 顶层 await 仅会在 `import.meta.env.SSR` 为 true 的服务端模块图中执行；
 * 客户端构建树会被 tree-shake/条件分支排除，不引入 node:async_hooks。
 */
const isServer: boolean = import.meta.env.SSR;

let serverStore: LanguageStore | undefined;

async function ensureServerStore(): Promise<LanguageStore> {
	if (!serverStore) {
		const { AsyncLocalStorage } = await import("node:async_hooks");
		const als = new AsyncLocalStorage<string>();
		serverStore = {
			run: <T,>(lang: string, fn: () => T) => als.run(lang, fn),
			enterWith: (lang: string) => als.enterWith(lang),
			getStore: () => als.getStore(),
		};
	}
	return serverStore;
}

// 服务端：顶层 await 同步就绪真实 ALS，保证后续 `enterLanguage` 同步调用立即生效。
// 客户端：`isServer` 为 false，此分支被 tree-shake 排除，不引入 node:async_hooks。
if (isServer) {
	await ensureServerStore();
}

let browserStore: BrowserLanguageStore | undefined;

function getBrowserStore(): BrowserLanguageStore {
	if (!browserStore) browserStore = new BrowserLanguageStore();
	return browserStore;
}

/**
 * 在指定语言上下文中执行同步/异步函数，返回其结果。
 * 服务端依赖已同步就绪的 ALS；客户端用 BrowserLanguageStore。
 */
export function runWithLanguage<T>(lang: string, fn: () => T): T {
	if (isServer) {
		return serverStore!.run(lang, fn);
	}
	return getBrowserStore().run(lang, fn);
}

/**
 * 进入「当前语言」渲染上下文。
 * 服务端：ALS 通过顶层 await 已就绪，直接 enterWith；客户端：写入 shim。
 */
export function enterLanguage(lang: string): void {
	if (isServer) {
		serverStore!.enterWith(lang);
		return;
	}
	getBrowserStore().enterWith(lang);
}

/** 读取当前渲染上下文的语言；无上下文时回退站点默认语言。 */
export function currentLanguage(): string {
	if (isServer) {
		return serverStore?.getStore() ?? siteConfig.lang ?? "en";
	}
	const fromStore = getBrowserStore().getStore();
	if (fromStore) return fromStore;
	// 客户端：SSR 已将语言写入 <html lang>（格式如 "zh-CN"）。
	// 翻译 map 的 key 用下划线（"zh_cn"），故把连字符转回下划线再查。
	if (typeof document !== "undefined" && document.documentElement?.lang) {
		return document.documentElement.lang.replace("-", "_");
	}
	return siteConfig.lang ?? "en";
}

export function i18n(key: I18nKey): string {
	const lang = currentLanguage();
	return getTranslation(lang)[key];
}
