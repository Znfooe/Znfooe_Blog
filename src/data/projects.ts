/**
 * 项目页数据源（纯内容）。
 * 页面展示与筛选规则由 src/config/projectsConfig.ts 控制。
 */
import type { ProjectItem } from "@/types/projectsConfig";

export const projectsData: ProjectItem[] = [
	{
		key: "shirone",
		title: "Shirone",
		summary:
			"An Astro blog theme shaped around an M3E component system, expressive content, and resilient client navigation.",
		category: "theme",
		phase: "building",
		technologies: ["Astro", "Svelte", "TypeScript", "Tailwind CSS"],
		icon: "material-symbols:deployed-code-outline-rounded",
		cover: "/assets/projects/shirone.webp",
		coverAlt: "Shirone theme homepage preview",
		featured: true,
		repository: "https://github.com/LyraVoid/Shirone",
		year: "2026",
	},
	{
		key: "project-harness-builder",
		title: "Project Harness Builder",
		summary:
			"面向大型长期项目的 AI 工程规范生成器：通过交互式问答，增量式生成 spec、ADR、设计令牌等完整工程规范体系。",
		category: "tool",
		phase: "shipped",
		technologies: ["AI Skill", "Markdown", "工程规范"],
		icon: "material-symbols:construction-rounded",
		repository: "https://github.com/Znfooe/project-harness-builder",
		post: "project-harness-builder",
		year: "2026",
	},
	{
		key: "reactionpro-client",
		title: "ReactionPro Client",
		summary:
			"基于 Flutter 的反应力与击杀时间测试客户端，支持 Web、Windows、Android、iOS、macOS 与 Linux 多端。",
		category: "app",
		phase: "shipped",
		technologies: ["Flutter", "Dart", "Web", "Desktop"],
		icon: "material-symbols:bolt-rounded",
		repository: "https://github.com/Znfooe/ReactionPro-Client",
		post: "reactionpro-client",
		year: "2026",
	},
	{
		key: "mathviz",
		title: "数学之美 · MathViz",
		summary:
			"交互式数学可视化平台：65+ 数学实验，参数实时调控、全屏演示与 AI 语音讲解，面向课堂教学与自主探索。",
		category: "web",
		phase: "shipped",
		technologies: ["React", "TypeScript", "Vite", "Plotly.js"],
		icon: "material-symbols:function-rounded",
		repository: "https://github.com/Znfooe/mathviz",
		post: "mathviz",
		year: "2026",
	},
];

/** 获取所有项目数据列表 */
export function getProjectsList(): ProjectItem[] {
	return projectsData;
}
