import I18nKey from "@i18n/i18nKey";
import { i18n } from "@i18n/translation";
import type { NavBarLink } from "@/types/navBarConfig";
import { languageFromPath } from "@i18n/languages";

export type ResolvedNavBarLink = Omit<NavBarLink, "children"> & {
	children?: ResolvedNavBarLink[];
};

/**
 * 解析一个可能含 `$t:key` 引用前缀的 name。
 * 语言上下文由调用方通过 `renderWithLanguage(lang)` 进入 `i18n()` 内部读取；
 * 因此这里无需传 lang，直接调用 `i18n()` 即可拿到当前语言。
 */
function resolveName(name: string): string {
	if (!name.startsWith("$t:")) return name;
	const key = name.slice(3);
	// I18nKey 是 string enum：`I18nKey.home === "home"`，所有合法键
	// 都可以用 `I18nKey[key]` 取出对应字符串值；用此判断键是否存在。
	if (I18nKey[key as keyof typeof I18nKey] === undefined) {
		throw new Error(`[nav] 未知的 i18n 词条 "${key}"`);
	}
	return i18n(I18nKey[key as keyof typeof I18nKey] as I18nKey);
}

/**
 * 剥离语言前缀，得到「站点内规范路径」。
 * 默认语言（无前缀）原样返回；非默认语言去掉首个 `/zh-CN/` 这类目录段，
 * 使导航高亮、页面标识判断与语言无关。
 */
export function stripLocalePrefix(pathname: string): string {
	const meta = languageFromPath(pathname);
	if (!meta.prefix) return pathname;
	const cleaned = pathname.replace(/^\/+/, "");
	const seg = cleaned.split("/");
	if (seg[0]?.toLowerCase() === meta.prefix.toLowerCase()) {
		return "/" + seg.slice(1).join("/");
	}
	return pathname;
}

/**
 * 解析导航链接：递归展开 children，并把 `$t:key` 形式的 name 翻译成当前语言。
 * 必须在 `renderWithLanguage(lang)` 已经进入语言上下文后调用，
 * 否则会得到默认语言字符串。
 */
export function resolveNavBarLinks(links: NavBarLink[]): ResolvedNavBarLink[] {
	return links.map((link) => ({
		...link,
		name: resolveName(link.name),
		children: link.children ? resolveNavBarLinks(link.children) : undefined,
	}));
}

/**
 * 当前 URL → 导航高亮标识（pageKey）。
 * 分类/标签筛选优先于归档页（与抽屉/分类栏的筛选优先语义一致）；
 * 文章页、自定义页等无匹配时返回空串（不点亮任何导航项）。
 */
export function resolvePageKey(
	url: Pick<URL, "pathname" | "searchParams">,
): string {
	const pathname = stripLocalePrefix(url.pathname.replace(/\/+$/, "") || "/");
	if (pathname === "/") return "home";
	if (url.searchParams.has("category")) return "categories";
	if (url.searchParams.has("tag")) return "tags";
	if (pathname === "/archive") return "archive";
	if (pathname === "/friends") return "friends";
	if (pathname === "/moments") return "moments";
	if (pathname === "/anime") return "anime";
	if (pathname === "/compass") return "compass";
	if (pathname === "/skills") return "skills";
	if (pathname === "/projects") return "projects";
	if (pathname === "/devices") return "devices";
	if (pathname === "/timeline") return "timeline";
	if (pathname === "/albums" || pathname.startsWith("/albums/"))
		return "albums";
	if (pathname === "/about") return "about";
	return "";
}
