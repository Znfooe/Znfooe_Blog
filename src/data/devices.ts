/**
 * 设备展示页数据源（纯内容）。
 * 页面展示与筛选规则由 src/config/devicesConfig.ts 控制。
 *
 * 需要翻译的字段（name / brand / description / specDetails）按语言代码分列，
 * 由 resolveDevicesData 依当前渲染语言解析为普通字符串；
 * 纯规格类字段（specs / year / link / icon）保持单一值即可。
 */
import type { DeviceItemSource } from "@/types/devicesConfig";

export const devicesData: DeviceItemSource[] = [
	{
		id: "custom-desktop-amd",
		name: {
			zh_CN: "自组台式机（AMD）",
			en: "Custom Desktop PC (AMD)",
		},
		brand: {
			zh_CN: "自组",
			en: "Self-built",
		},
		category: "desk",
		status: "active",
		specs: "Ryzen 5 9600X / RTX 3060 Ti / 16GB DDR5-6000",
		description: {
			zh_CN:
				"自组台式主力机，兼顾开发、剪辑与游戏，2K 240Hz 高刷屏打 FPS 游戏丝般顺滑。",
			en: "Primary self-built desktop, balancing development, video editing and gaming — the 2K 240Hz panel keeps FPS titles buttery smooth.",
		},
		icon: "material-symbols:desktop-windows-outline-rounded",
		featured: true,
		year: "2026",
		link: "https://www.amd.com/en/products/processors/desktops/ryzen/9000-series/amd-ryzen-5-9600x.html",
		specDetails: [
			{
				key: "cpu",
				label: { zh_CN: "处理器 CPU", en: "Processor (CPU)" },
				value: {
					zh_CN:
						"AMD Ryzen 5 9600X（6C12T，Zen 5 架构，基础 3.9GHz / 最高睿频 5.4GHz，TDP 65W）",
					en: "AMD Ryzen 5 9600X (6C/12T, Zen 5, 3.9GHz base / 5.4GHz boost, 65W TDP)",
				},
			},
			{
				key: "motherboard",
				label: { zh_CN: "主板", en: "Motherboard" },
				value: {
					zh_CN: "华硕 ASUS B650M-AYW WIFI",
					en: "ASUS B650M-AYW WIFI",
				},
			},
			{
				key: "memory",
				label: { zh_CN: "内存", en: "Memory" },
				value: { zh_CN: "16GB DDR5 6000MHz", en: "16GB DDR5 6000MHz" },
			},
			{
				key: "gpu",
				label: { zh_CN: "显卡", en: "Graphics Card" },
				value: {
					zh_CN: "NVIDIA GeForce RTX 3060 Ti",
					en: "NVIDIA GeForce RTX 3060 Ti",
				},
			},
			{
				key: "storage",
				label: { zh_CN: "磁盘", en: "Storage" },
				value: {
					zh_CN: "REECHO V3000 512GB + 爱国者 P7000Z 2TB",
					en: "REECHO V3000 512GB + Patriot P7000Z 2TB",
				},
			},
			{
				key: "monitor",
				label: { zh_CN: "显示器", en: "Monitor" },
				value: { zh_CN: "2K 240Hz FastIPS", en: "2K 240Hz Fast IPS" },
			},
		],
	},
	{
		id: "mechrevo-jiaolong-15k",
		name: {
			zh_CN: "机械革命 蛟龙15K",
			en: "Mechrevo Jiaolong 15K",
		},
		brand: {
			zh_CN: "机械革命",
			en: "Mechrevo",
		},
		category: "desk",
		status: "active",
		specs: "R7 7435H / RTX 4060 / 32GB / 1TB",
		description: {
			zh_CN:
				"机械革命蛟龙15K 游戏本，性价比拉满的便携游戏与开发机，满血 140W 显卡释放。",
			en: "Mechrevo Jiaolong 15K gaming laptop — a portable gaming and development machine with outstanding value, pushing the GPU to its full 140W.",
		},
		icon: "material-symbols:laptop-chromebook-outline-rounded",
		year: "2023",
		link: "https://www.mechrevo.com/",
		specDetails: [
			{
				key: "cpu",
				label: { zh_CN: "处理器 CPU", en: "Processor (CPU)" },
				value: {
					zh_CN:
						"AMD 锐龙 R7 7435H（8C16T，Zen 3+ 架构，6nm，最高睿频 4.75GHz，无核显）",
					en: "AMD Ryzen R7 7435H (8C/16T, Zen 3+, 6nm, up to 4.75GHz, no integrated GPU)",
				},
			},
			{
				key: "gpu",
				label: { zh_CN: "显卡", en: "Graphics Card" },
				value: {
					zh_CN:
						"NVIDIA GeForce RTX 4060 Laptop 8GB GDDR6（140W 满功耗，支持 DLSS 3 / 独显直连）",
					en: "NVIDIA GeForce RTX 4060 Laptop 8GB GDDR6 (140W full TGP, DLSS 3 / discrete GPU direct output)",
				},
			},
			{
				key: "memory",
				label: { zh_CN: "内存", en: "Memory" },
				value: { zh_CN: "32GB DDR5 4800MHz", en: "32GB DDR5 4800MHz" },
			},
			{
				key: "storage",
				label: { zh_CN: "固态硬盘", en: "SSD" },
				value: {
					zh_CN: "1TB NVMe PCIe 4.0 SSD",
					en: "1TB NVMe PCIe 4.0 SSD",
				},
			},
			{
				key: "display",
				label: { zh_CN: "屏幕", en: "Display" },
				value: {
					zh_CN: "15.6 英寸 1920×1080 / 165Hz / 100% sRGB IPS",
					en: "15.6-inch 1920×1080 / 165Hz / 100% sRGB IPS",
				},
			},
			{
				key: "cooling",
				label: { zh_CN: "散热", en: "Cooling" },
				value: {
					zh_CN: "双风扇 + 四出风口 + 五热管",
					en: "Dual fans + four vents + five heat pipes",
				},
			},
			{
				key: "weight",
				label: { zh_CN: "重量", en: "Weight" },
				value: { zh_CN: "约 2.23kg", en: "Approx. 2.23 kg" },
			},
		],
	},
	{
		id: "redmi-k60",
		name: {
			zh_CN: "红米 K60",
			en: "Redmi K60",
		},
		brand: {
			zh_CN: "红米",
			en: "Redmi",
		},
		category: "mobile",
		status: "active",
		specs: "Snapdragon 8+ Gen 1 / 12GB / 256GB",
		description: {
			zh_CN:
				"主力手机，2K 高光屏 + 5500mAh 大电池，续航与屏幕都拉满的性价比旗舰。",
			en: "Primary phone: a 2K bright display plus a 5500mAh battery — a value flagship that maxes out both endurance and screen quality.",
		},
		icon: "material-symbols:phone-iphone",
		featured: true,
		year: "2023",
		link: "https://www.mi.com/redmi/k60",
		specDetails: [
			{
				key: "soc",
				label: { zh_CN: "处理器", en: "Processor (SoC)" },
				value: {
					zh_CN:
						"高通 骁龙 8+ Gen 1（降频版，台积电 4nm，八核，最高 3.0GHz，Adreno 730 GPU）",
					en: "Qualcomm Snapdragon 8+ Gen 1 (underclocked, TSMC 4nm, octa-core, up to 3.0GHz, Adreno 730 GPU)",
				},
			},
			{
				key: "memory",
				label: { zh_CN: "内存", en: "Memory" },
				value: { zh_CN: "12GB LPDDR5", en: "12GB LPDDR5" },
			},
			{
				key: "storage",
				label: { zh_CN: "存储", en: "Storage" },
				value: { zh_CN: "256GB UFS 3.1", en: "256GB UFS 3.1" },
			},
			{
				key: "display",
				label: { zh_CN: "屏幕", en: "Display" },
				value: {
					zh_CN:
						"6.67 英寸 3200×1440（2K）AMOLED / 120Hz / 峰值 1400nit / 1920Hz 高频 PWM 调光",
					en: "6.67-inch 3200×1440 (2K) AMOLED / 120Hz / 1400 nits peak / 1920Hz high-frequency PWM dimming",
				},
			},
			{
				key: "camera",
				label: { zh_CN: "后置相机", en: "Rear Camera" },
				value: {
					zh_CN: "6400 万主摄（OIS 光学防抖）+ 800 万超广角 + 200 万微距",
					en: "64MP main (OIS) + 8MP ultra-wide + 2MP macro",
				},
			},
			{
				key: "cameraFront",
				label: { zh_CN: "前置相机", en: "Front Camera" },
				value: { zh_CN: "1600 万像素", en: "16MP" },
			},
			{
				key: "battery",
				label: { zh_CN: "电池", en: "Battery" },
				value: {
					zh_CN: "5500mAh（67W 有线 + 30W 无线快充）",
					en: "5500mAh (67W wired + 30W wireless fast charging)",
				},
			},
			{
				key: "os",
				label: { zh_CN: "系统", en: "OS" },
				value: {
					zh_CN: "MIUI 14（基于 Android 13）",
					en: "MIUI 14 (based on Android 13)",
				},
			},
			{
				key: "network",
				label: { zh_CN: "网络", en: "Connectivity" },
				value: {
					zh_CN: "5G + 双频 Wi-Fi 6 增强版 + 蓝牙 5.3 + NFC + 红外",
					en: "5G + dual-band Wi-Fi 6 Enhanced + Bluetooth 5.3 + NFC + IR blaster",
				},
			},
		],
	},
];

/** 获取所有设备数据列表（原始多语言形态） */
export function getDevicesList(): DeviceItemSource[] {
	return devicesData;
}
