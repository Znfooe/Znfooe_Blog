/**
 * 多语言路由工具：语言前缀路径的生成与解析。
 *
 * 结构约定（Astro 文件路由，prefixDefaultLocale=false 语义）：
 * - 默认语言（zh_CN）页面在 `src/pages/` 根目录，URL 无前缀（如 `/about/`）；
 * - 非默认语言页面在 `src/pages/[locale]/` 目录，URL 带前缀（如 `/en/about/`）。
 *
 * 当前仅启用英文为非默认语言（`ENABLED_LOCALES`）；追加数组项即可扩展更多语言，
 * 但需同步在 `src/i18n/languages/` 提供对应翻译模块。
 */
import { DEFAULT_LANGUAGE, ENABLED_LOCALES, resolveLanguage } from "@i18n/languages";
import { enterLanguage } from "@i18n/translation";

// 单一事实来源在 @i18n/languages（纯数据模块，客户端 Safe）；此处再导出以保留既有导入路径。
export { ENABLED_LOCALES };

/**
 * 生成非默认语言的 `getStaticPaths` 参数数组（locale 段 + props.lang）。
 * 供 `src/pages/[locale]/` 下的页面复用。
 */
export function localeStaticPaths() {
	return ENABLED_LOCALES.map((code) => ({
		params: { locale: resolveLanguage(code).prefix },
		props: { lang: code },
	}));
}

/** 语言 code → 路径前缀。 */
export function localePrefix(code: string): string {
	return resolveLanguage(code).prefix;
}

/** 从语言 code 生成带前缀的站点内绝对路径（如 zh_CN → /zh-CN/xxx/）。 */
export function localizedPath(code: string, path: string): string {
	const prefix = localePrefix(code);
	if (!prefix) return path;
	const clean = path.replace(/^\/+/, "");
	return `/${prefix}/${clean}`;
}

/**
 * 判断给定语言是否为默认语言（无前缀）。
 * 用于语言切换器决定跳转目标。
 */
export function isDefaultLocale(code: string): boolean {
	return resolveLanguage(code).code === DEFAULT_LANGUAGE;
}

/**
 * 页面 frontmatter 便捷入口：进入指定语言的渲染上下文。
 * 等价于 `enterLanguage(lang)`，语义更明确地标注「当前页面按此语言渲染」。
 */
export function renderWithLanguage(lang: string): void {
	enterLanguage(lang);
}
