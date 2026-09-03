/**
 * 番剧收藏数据（本地数据源）。
 * 用于番剧页：src/pages/anime.astro → organisms/AnimeSection → molecules/AnimeCard。
 *
 * 添加条目：在 animeData 中追加一项即可，状态筛选 chips 与计数自动生成。
 * - cover 省略时卡片显示主题色渐变占位（补图前不破版）；
 * - link 省略时封面不可点；rating 为 0-10 个人评分；
 * - progress 是结构化追番进度，watching 状态在卡片上渲染进度条。
 * JSON 数据源（外部收藏服务拉取）见 utils/anime-data.ts 的 AnimeSource 分发。
 */

import type { AnimeIdentity } from "../types/animeConfig.ts";

/** 收藏状态（Bangumi 领域通行五态） */
export type AnimeStatus =
	| "watching"
	| "completed"
	| "planned"
	| "onHold"
	| "dropped";

export interface AnimeItem {
	title: string;
	/** 封面图地址（相对 /public 或绝对 URL）；省略 = 渐变占位 */
	cover?: string;
	/** 条目外链（Bangumi/官方站等）；省略则封面不可点 */
	link?: string;
	status: AnimeStatus;
	/** 个人评分 0-10 */
	rating: number;
	/** 追番进度：已看 / 总集数 */
	progress: { watched: number; total: number };
	/** 一句话感想 */
	description?: string;
	/** 放送年份（展示用） */
	year: string;
	/** 制作公司 */
	studio?: string;
	/** 题材标签 */
	genres: string[];
	/** 观看时间段（年-月） */
	period?: { start: string; end: string };
	/** 条目来源身份标识（可选，用于跨源去重与归档） */
	identity?: AnimeIdentity;
}

export const animeData: AnimeItem[] = [
	{
		title: "擅长捉弄的高木同学",
		cover: "/assets/anime/takagi-s1.webp",
		link: "https://www.bilibili.com/bangumi/media/md21214905",
		status: "completed",
		rating: 9.8,
		progress: { watched: 12, total: 12 },
		description: "初中同桌的捉弄攻防战，西片 VS 高木同学。",
		year: "2018",
		studio: "Shin-Ei Animation",
		genres: ["恋爱", "喜剧", "日常", "校园"],
		period: { start: "2018-01", end: "2018-03" },
	},
	{
		title: "擅长捉弄的高木同学 第二季",
		cover: "/assets/anime/takagi-s2.webp",
		link: "https://www.bilibili.com/bangumi/media/md28221403",
		status: "completed",
		rating: 9.9,
		progress: { watched: 12, total: 12 },
		description: "捉弄升级，两人的距离一点点缩短。",
		year: "2019",
		studio: "Shin-Ei Animation",
		genres: ["恋爱", "喜剧", "日常", "校园"],
		period: { start: "2019-07", end: "2019-09" },
	},
	{
		title: "擅长捉弄的高木同学 第三季",
		cover: "/assets/anime/takagi-s3.webp",
		link: "https://www.bilibili.com/bangumi/media/md28235860",
		status: "completed",
		rating: 9.9,
		progress: { watched: 12, total: 12 },
		description: "最终季，初恋在这一年开花结果。",
		year: "2022",
		studio: "Shin-Ei Animation",
		genres: ["恋爱", "喜剧", "日常", "校园"],
		period: { start: "2022-01", end: "2022-03" },
	},
	{
		title: "擅长捉弄的高木同学 剧场版",
		cover: "/assets/anime/takagi-movie.webp",
		link: "https://www.bilibili.com/bangumi/media/md28435376",
		status: "completed",
		rating: 9.9,
		progress: { watched: 1, total: 1 },
		description: "初中最后的夏天，与小猫「小花」共度的温馨时光。",
		year: "2022",
		studio: "Shin-Ei Animation",
		genres: ["恋爱", "喜剧", "日常", "校园"],
		period: { start: "2022-06", end: "2022-06" },
	},
	{
		title: "莉可丽丝",
		cover: "/assets/anime/lkls.webp",
		link: "https://www.bilibili.com/bangumi/media/md28338623",
		status: "completed",
		rating: 9.8,
		progress: { watched: 12, total: 12 },
		description: "少女们的枪战物语",
		year: "2022",
		studio: "A-1 Pictures",
		genres: ["动作", "日常"],
		period: { start: "2022-07", end: "2022-09" },
	},
	{
		title: "飙速宅男",
		cover: "/assets/anime/rynh.webp",
		link: "https://www.bilibili.com/bangumi/media/md2590",
		status: "watching",
		rating: 9.5,
		progress: { watched: 8, total: 12 },
		description: "少女们的日常，甜蜜又治愈",
		year: "2015",
		studio: "Nexus",
		genres: ["日常", "治愈"],
		period: { start: "2015-07", end: "2015-09" },
	},
	{
		title: "恋爱小行星",
		cover: "/assets/anime/laxxx.webp",
		link: "https://www.bilibili.com/bangumi/media/md28224128",
		status: "watching",
		rating: 9.2,
		progress: { watched: 5, total: 12 },
		description: "于星辰之间与少女相遇，纯粹而治愈",
		year: "2020",
		studio: "Doga Kobo",
		genres: ["恋爱", "治愈"],
		period: { start: "2020-01", end: "2020-03" },
	},
	{
		title: "请问您今天要来点兔子吗？",
		cover: "/assets/anime/tz1.webp",
		link: "https://www.bilibili.com/bangumi/media/md2762",
		status: "planned",
		rating: 9.0,
		progress: { watched: 12, total: 12 },
		description: "少女们温暖治愈的日常",
		year: "2014",
		studio: "White Fox",
		genres: ["日常", "治愈"],
		period: { start: "2014-04", end: "2014-06" },
	},
	{
		title: "魔法咪路咪路",
		cover: "/assets/anime/cmmn.webp",
		link: "https://www.bilibili.com/bangumi/media/md26625039",
		status: "watching",
		rating: 9.0,
		progress: { watched: 8, total: 12 },
		description: "咪路，咪路！",
		year: "2024",
		studio: "C2C",
		genres: ["日常", "治愈", "魔法"],
		period: { start: "2025-07", end: "2025-10" },
	},
];
