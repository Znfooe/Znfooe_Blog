import I18nKey from "@i18n/i18nKey";
import { i18n } from "@i18n/translation";
import { devicesConfig } from "@/config/devicesConfig";
import { projectsConfig } from "@/config/projectsConfig";
import { skillsConfig } from "@/config/skillsConfig";
import { timelineConfig } from "@/config/timelineConfig";
import type {
	NavBarConfig,
	NavBarConfigOverride,
	NavBarLink,
	NavBarLinkOverride,
} from "@/types/navBarConfig";
import { getUserConfig } from "../utils/config-overlay.ts";

/**
 * 导航栏配置（统一单一来源）。
 * - LinkPresets：命名链接预设表 —— 名称 / 地址 / 图标单点维护，可整体复用；
 * - navBarConfig：导航结构 —— 顺序 + 分组（children 子菜单），
 *   同时驱动顶栏下拉菜单与全端导航抽屉。
 * 新增入口：先在 LinkPresets 登记预设，再在 navBarConfig.links 按序引用。
 *
 * 内容仓可用 `config/nav-bar.yaml` 整体替换 `links`，写法见 `NavBarLinkOverride`。
 *
 * 国际化：用 `$t:home` 这种引用前缀标记需要按当前语言解析的词条；
 * `name` 是字面量时直接当作原文（外部品牌名、技术术语等不翻译时用）。
 * 这样 LinkPresets 才能在布局每次渲染时拿到当前语言的展示文案。
 */
const t = (key: keyof typeof I18nKey) => `$t:${key}`;

export const LinkPresets: Record<string, NavBarLink> = {
	Home: {
		name: t("home"),
		url: "/",
		icon: "material-symbols:home-outline-rounded",
		pageKey: "home",
	},
	Archive: {
		name: t("archive"),
		url: "/archive/",
		icon: "material-symbols:archive-outline-rounded",
		pageKey: "archive",
	},
	Friends: {
		name: t("friends"),
		url: "/friends/",
		icon: "material-symbols:handshake-outline-rounded",
		pageKey: "friends",
	},
	Moments: {
		name: t("moments"),
		url: "/moments/",
		icon: "material-symbols:auto-awesome-outline-rounded",
		pageKey: "moments",
	},
	Anime: {
		name: t("anime"),
		url: "/anime/",
		icon: "material-symbols:live-tv-outline-rounded",
		pageKey: "anime",
	},
	Compass: {
		name: t("compass"),
		url: "/compass/",
		icon: "material-symbols:explore-rounded",
		pageKey: "compass",
	},
	Skills: {
		name: t("skills"),
		url: "/skills/",
		icon: "material-symbols:workspaces-outline-rounded",
		pageKey: "skills",
	},
	Projects: {
		name: t("projects"),
		url: "/projects/",
		icon: "material-symbols:deployed-code-outline-rounded",
		pageKey: "projects",
	},
	Devices: {
		name: t("devices"),
		url: "/devices/",
		icon: "material-symbols:devices-rounded",
		pageKey: "devices",
	},
	Timeline: {
		name: t("timeline"),
		url: "/timeline/",
		icon: "material-symbols:timeline-rounded",
		pageKey: "timeline",
	},
	Albums: {
		name: t("albums"),
		url: "/albums/",
		icon: "material-symbols:photo-library-outline-rounded",
		pageKey: "albums",
	},
	Categories: {
		name: t("categories"),
		url: "/categories/",
		icon: "material-symbols:folder-outline-rounded",
		pageKey: "categories",
	},
	Tags: {
		name: t("tags"),
		url: "/tags/",
		icon: "material-symbols:tag-rounded",
		pageKey: "tags",
	},
	About: {
		name: t("about"),
		url: "/about/",
		icon: "material-symbols:info-outline-rounded",
		pageKey: "about",
	},
	GitHub: {
		// 外部品牌名，保持英文。指向 fork 仓库主人的个人 GitHub
		name: "GitHub",
		url: "https://github.com/Znfooe",
		icon: "fa6-brands:github",
		external: true,
		pageKey: "github",
	},
	// 上游开源原项目（fork 来源），保留作为单独入口便于致敬作者
	SourceRepo: {
		name: "Original",
		url: "https://github.com/LyraVoid/Shirone",
		icon: "fa6-brands:github",
		external: true,
		pageKey: "source",
	},
};

const defaultNavBarConfig: NavBarConfig = {
	links: [
		LinkPresets.Home,
		LinkPresets.Archive,
		LinkPresets.Friends,
		LinkPresets.Moments,
		LinkPresets.Anime,
		LinkPresets.Compass,
		LinkPresets.Albums,
		{
			name: t("more"),
			icon: "material-symbols:apps-rounded",
			children: [
				...(timelineConfig.enable ? [LinkPresets.Timeline] : []),
				...(projectsConfig.enable ? [LinkPresets.Projects] : []),
				...(devicesConfig.enable ? [LinkPresets.Devices] : []),
				...(skillsConfig.enable ? [LinkPresets.Skills] : []),
				// 分类/标签入口不进导航菜单（避免菜单项过多），预设已登记指向独立页面，
				// 需要时取消注释即可
				// LinkPresets.Categories,
				// LinkPresets.Tags,
				LinkPresets.About,
				LinkPresets.GitHub,
				LinkPresets.SourceRepo,
			],
		},
	],
};

/** `$t:home` 形式的 i18n 引用前缀；不带前缀的 name 一律按字面量处理。 */
const I18N_REFERENCE_PREFIX = "$t:";

function fail(message: string): never {
	throw new Error(`[config] nav-bar：${message}`);
}

function resolveName(name: string): string {
	if (!name.startsWith(I18N_REFERENCE_PREFIX)) return name;

	const key = name.slice(I18N_REFERENCE_PREFIX.length);
	if (!Object.hasOwn(I18nKey, key)) {
		fail(
			`未知的 i18n 词条 "${key}"。可用词条见 src/i18n/i18nKey.ts；` +
				" 若本意是普通文本，去掉开头的 $t: 即可。",
		);
	}
	return i18n(I18nKey[key as keyof typeof I18nKey]);
}

/**
 * 把内容仓的声明式导航条目还原成 `NavBarLink`。
 *
 * 预设名与 i18n 词条只有在这里才能校验（`LinkPresets` 与 `I18nKey` 都住在代码仓，
 * 生成期的 Node 脚本受路径别名所限读不到），因此错误在构建加载配置时抛出。
 */
export function resolveNavBarLinks(
	entries: readonly NavBarLinkOverride[],
	presets: Record<string, NavBarLink> = LinkPresets,
): NavBarLink[] {
	return entries.map((entry) => {
		let base: NavBarLink | null = null;
		if (entry.preset !== undefined) {
			base = presets[entry.preset] ?? null;
			if (!base) {
				fail(
					`未知的预设 "${entry.preset}"。可用预设：${Object.keys(presets).join("、")}。`,
				);
			}
		}

		const name =
			entry.name !== undefined ? resolveName(entry.name) : base?.name;
		if (name === undefined) {
			fail("每个条目都需要 name，或用 preset 引用一个内置预设。");
		}

		// 未声明 children 时沿用预设自带的子菜单（已由 ...base 带入）。
		return {
			...base,
			name,
			...(entry.url !== undefined ? { url: entry.url } : {}),
			...(entry.icon !== undefined ? { icon: entry.icon } : {}),
			...(entry.pageKey !== undefined ? { pageKey: entry.pageKey } : {}),
			...(entry.external !== undefined ? { external: entry.external } : {}),
			...(entry.children
				? { children: resolveNavBarLinks(entry.children, presets) }
				: {}),
		};
	});
}

const userNavBar = getUserConfig("navBar") as NavBarConfigOverride | undefined;

export const navBarConfig: NavBarConfig = userNavBar
	? { links: resolveNavBarLinks(userNavBar.links) }
	: defaultNavBarConfig;
