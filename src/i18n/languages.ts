/**
 * 站点支持的语言元数据（单一事实来源）。
 *
 * - `code`：语言代码，与 `src/i18n/languages/*.ts` 的导出键及
 *   `siteConfig.lang` 取值一致（默认语言为 `en`）。
 * - `prefix`：URL 路径前缀（小写、连字符分隔）。默认语言无前缀；
 *   其余语言为 `/zh-CN/` 这类目录段。
 * - `name`：英文名（供无障碍/回退展示）。
 * - `nativeName`：本地名（语言切换器下拉首选展示，用户以母语识别）。
 *
 * 注意：此处不要放站点翻译文案；文案一律走 I18nKey + languages/*.ts。
 * 新增语言时需同步：本数组、`translation.ts` 的 map、以及 languages/ 下的模块。
 */
export interface LanguageMeta {
	code: string;
	prefix: string;
	name: string;
	nativeName: string;
}

export const LANGUAGES: LanguageMeta[] = [
	{ code: "en", prefix: "", name: "English", nativeName: "English" },
	{ code: "zh_CN", prefix: "zh-cn", name: "Chinese (Simplified)", nativeName: "简体中文" },
	{ code: "zh_TW", prefix: "zh-tw", name: "Chinese (Traditional)", nativeName: "繁體中文" },
	{ code: "ja", prefix: "ja", name: "Japanese", nativeName: "日本語" },
	{ code: "ko", prefix: "ko", name: "Korean", nativeName: "한국어" },
	{ code: "th", prefix: "th", name: "Thai", nativeName: "ไทย" },
	{ code: "vi", prefix: "vi", name: "Vietnamese", nativeName: "Tiếng Việt" },
	{ code: "id", prefix: "id", name: "Indonesian", nativeName: "Bahasa Indonesia" },
	{ code: "tr", prefix: "tr", name: "Turkish", nativeName: "Türkçe" },
	{ code: "es", prefix: "es", name: "Spanish", nativeName: "Español" },
];

/** 默认语言（无路径前缀）。与 siteConfig.lang 的默认值保持一致。 */
export const DEFAULT_LANGUAGE = "en";

/** 语言代码 → 元数据映射（含常见别名，如 en_us → en）。 */
const CODE_TO_META = new Map<string, LanguageMeta>();
for (const meta of LANGUAGES) {
	CODE_TO_META.set(meta.code.toLowerCase(), meta);
}
// 常见别名：en_us/en_gb/en_au → en；ja_jp → ja；ko_kr → ko；th_th → th；vi_vn → vi；tr_tr → tr；zh_cn → zh_CN；zh_tw → zh_TW
const ALIASES: Record<string, string> = {
	en_us: "en",
	en_gb: "en",
	en_au: "en",
	ja_jp: "ja",
	ko_kr: "ko",
	th_th: "th",
	vi_vn: "vi",
	tr_tr: "tr",
	zh_cn: "zh_CN",
	zh_tw: "zh_TW",
};

/** 语言代码（或别名） → 元数据；未知代码返回默认语言。 */
export function resolveLanguage(code: string): LanguageMeta {
	const key = code.toLowerCase();
	const resolved = ALIASES[key] ?? key;
	return CODE_TO_META.get(resolved.toLowerCase()) ?? CODE_TO_META.get(DEFAULT_LANGUAGE)!;
}

/** 语言前缀 → 元数据；未知前缀返回默认语言。 */
export function languageByPrefix(prefix: string): LanguageMeta {
	const p = prefix.toLowerCase();
	return LANGUAGES.find((m) => m.prefix === p) ?? CODE_TO_META.get(DEFAULT_LANGUAGE)!;
}

/** 从路径首段识别语言前缀（无匹配返回默认语言）。 */
export function languageFromPath(pathname: string): LanguageMeta {
	const first = pathname.replace(/^\/+/, "").split("/")[0] ?? "";
	if (!first) return CODE_TO_META.get(DEFAULT_LANGUAGE)!;
	return languageByPrefix(first);
}

/** 判断某语言是否为默认语言（决定是否加前缀）。 */
export function isDefaultLanguage(code: string): boolean {
	return resolveLanguage(code).code === DEFAULT_LANGUAGE;
}
