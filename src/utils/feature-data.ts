/**
 * 特色页面数据解析与合并工具。
 * 遵循「配置管行为，数据管内容」原则：
 * 将 src/config/*Config.ts 的控制行为（disabledKeys、order 等）
 * 应用于 src/data/*.ts 的内容数据集合。
 */
import { devicesData } from "../data/devices.ts";
import { projectsData } from "../data/projects.ts";
import { skillsData } from "../data/skills.ts";
import { timelineData } from "../data/timeline.ts";
import { DEFAULT_LANGUAGE, resolveLanguage } from "../i18n/languages.ts";
import { currentLanguage } from "../i18n/translation.ts";
import type {
	DeviceItem,
	DeviceItemSource,
	DevicesConfig,
	LocalizedText,
} from "../types/devicesConfig.ts";
import type { ProjectItem, ProjectsConfig } from "../types/projectsConfig.ts";
import type { SkillItem, SkillsConfig } from "../types/skillsConfig.ts";
import type { TimelineConfig, TimelineItem } from "../types/timelineConfig.ts";

/**
 * 依据禁用列表过滤条目（纯函数）。
 */
export function filterByDisabledKeys<T>(
	items: readonly T[],
	disabledKeys?: readonly string[],
	getKey: (item: T) => string = (item) =>
		(
			item as unknown as {
				key?: string;
				id?: string;
				name?: string;
				title?: string;
			}
		).key ??
		(
			item as unknown as {
				key?: string;
				id?: string;
				name?: string;
				title?: string;
			}
		).id ??
		(
			item as unknown as {
				key?: string;
				id?: string;
				name?: string;
				title?: string;
			}
		).name ??
		(
			item as unknown as {
				key?: string;
				id?: string;
				name?: string;
				title?: string;
			}
		).title ??
		"",
): T[] {
	if (!disabledKeys || disabledKeys.length === 0) {
		return [...items];
	}
	const disabledSet = new Set(disabledKeys);
	return items.filter((item) => !disabledSet.has(getKey(item)));
}

/**
 * 解析项目页展示数据。
 */
export function resolveProjectsData(
	config: ProjectsConfig,
	customItems?: readonly ProjectItem[],
): ProjectItem[] {
	const source = customItems ?? config.items ?? projectsData;
	const enabledItems = source.filter((item) => item.enable !== false);
	return filterByDisabledKeys(
		enabledItems,
		config.disabledKeys,
		(item) => item.key,
	);
}

/**
 * 解析技能页展示数据。
 */
export function resolveSkillsData(
	config: SkillsConfig,
	customItems?: readonly SkillItem[],
): SkillItem[] {
	const source = customItems ?? config.items ?? skillsData;
	const enabledItems = source.filter((item) => item.enable !== false);
	return filterByDisabledKeys(
		enabledItems,
		config.disabledNames ?? config.disabledKeys,
		(item) => item.name,
	);
}

/**
 * 解析时间线页展示数据。
 */
export function resolveTimelineData(
	config: TimelineConfig,
	customItems?: readonly TimelineItem[],
): TimelineItem[] {
	const source = customItems ?? config.items ?? timelineData;
	const enabledItems = source.filter((item) => item.enable !== false);
	const filtered = filterByDisabledKeys(
		enabledItems,
		config.disabledTitles ?? config.disabledKeys,
		(item) => item.title,
	);

	if (config.order === "asc") {
		return [...filtered].reverse();
	}
	return filtered;
}

/**
 * 依当前渲染语言从本地化文本取值；回退顺序：当前语言 → 默认语言 → 首个可用值。
 * 普通字符串直接原样返回（兼容以单语言编写的自定义数据）。
 */
function pickLocalized(value: string | LocalizedText, lang: string): string {
	if (typeof value === "string") return value;
	const code = resolveLanguage(lang).code;
	return value[code] ?? value[DEFAULT_LANGUAGE] ?? Object.values(value)[0] ?? "";
}

/** 把单条设备原始数据解析为消费层使用的普通字符串形态（按当前语言）。 */
function resolveDeviceItem(
	item: DeviceItem | DeviceItemSource,
	lang: string,
): DeviceItem {
	const specDetails = item.specDetails?.map((spec) => ({
		key: spec.key,
		label: pickLocalized(spec.label, lang),
		value: pickLocalized(spec.value, lang),
	}));
	return {
		...item,
		name: pickLocalized(item.name, lang),
		brand: pickLocalized(item.brand, lang),
		description: pickLocalized(item.description, lang),
		specDetails,
	};
}

/**
 * 解析设备页展示数据：过滤禁用项后，按当前页面语言展开本地化字段。
 * 默认数据（devicesData）为多语言形态；自定义 items 若使用普通字符串亦兼容。
 */
export function resolveDevicesData(
	config: DevicesConfig,
	customItems?: readonly (DeviceItem | DeviceItemSource)[],
): DeviceItem[] {
	const source = (
		customItems ?? config.items ?? devicesData
	) as readonly (DeviceItem | DeviceItemSource)[];
	const lang = currentLanguage();
	const enabledItems = source.filter((item) => item.enable !== false);
	return filterByDisabledKeys(
		enabledItems,
		config.disabledIds ?? config.disabledKeys,
		(item) => item.id,
	).map((item) => resolveDeviceItem(item, lang));
}
