/**
 * 设备展示页数据源（纯内容）。
 * 页面展示与筛选规则由 src/config/devicesConfig.ts 控制。
 */
import type { DeviceItem } from "@/types/devicesConfig";

export const devicesData: DeviceItem[] = [
	{
		id: "custom-desktop-amd",
		name: "Custom Desktop PC",
		brand: "Self-built",
		category: "desk",
		status: "active",
		specs: "Ryzen 5 9600X / RTX 3060 Ti / 16GB DDR5-6000",
		description:
			"自组台式主力机，兼顾开发、剪辑与游戏，2K 240Hz 高刷屏打 FPS 游戏丝般顺滑。",
		icon: "material-symbols:desktop-windows-outline-rounded",
		featured: true,
		year: "2026",
		link: "https://www.amd.com/en/products/processors/desktops/ryzen/9000-series/amd-ryzen-5-9600x.html",
		specDetails: [
			{ key: "cpu", label: "处理器 CPU", value: "AMD Ryzen 5 9600X（6C12T，Zen 5 架构，基础 3.9GHz / 最高睿频 5.4GHz，TDP 65W）" },
			{ key: "motherboard", label: "主板", value: "华硕 ASUS B650M-AYW WIFI" },
			{ key: "memory", label: "内存", value: "16GB DDR5 6000MHz" },
			{ key: "gpu", label: "显卡", value: "NVIDIA GeForce RTX 3060 Ti" },
			{ key: "storage", label: "磁盘", value: "REECHO V3000 512GB + 爱国者 P7000Z 2TB" },
			{ key: "monitor", label: "显示器", value: "2K 240Hz FastIPS" },
		],
	},
	{
		id: "mechrevo-jiaolong-15k",
		name: "Mechrevo Jiaolong 15K",
		brand: "Mechrevo",
		category: "desk",
		status: "active",
		specs: "R7 7435H / RTX 4060 / 32GB / 1TB",
		description:
			"机械革命蛟龙15K 游戏本，性价比拉满的便携游戏与开发机，满血 140W 显卡释放。",
		icon: "material-symbols:laptop-chromebook-outline-rounded",
		year: "2023",
		link: "https://www.mechrevo.com/",
		specDetails: [
			{ key: "cpu", label: "处理器 CPU", value: "AMD 锐龙 R7 7435H（8C16T，Zen 3+ 架构，6nm，最高睿频 4.75GHz，无核显）" },
			{ key: "gpu", label: "显卡", value: "NVIDIA GeForce RTX 4060 Laptop 8GB GDDR6（140W 满功耗，支持 DLSS 3 / 独显直连）" },
			{ key: "memory", label: "内存", value: "32GB DDR5 4800MHz" },
			{ key: "storage", label: "固态硬盘", value: "1TB NVMe PCIe 4.0 SSD" },
			{ key: "display", label: "屏幕", value: "15.6 英寸 1920×1080 / 165Hz / 100% sRGB IPS" },
			{ key: "cooling", label: "散热", value: "双风扇 + 四出风口 + 五热管" },
			{ key: "weight", label: "重量", value: "约 2.23kg" },
		],
	},
	{
		id: "redmi-k60",
		name: "Redmi K60",
		brand: "Redmi",
		category: "mobile",
		status: "active",
		specs: "Snapdragon 8+ Gen 1 / 12GB / 256GB",
		description:
			"主力手机，2K 高光屏 + 5500mAh 大电池，续航与屏幕都拉满的性价比旗舰。",
		icon: "material-symbols:phone-iphone",
		featured: true,
		year: "2023",
		link: "https://www.mi.com/redmi/k60",
		specDetails: [
			{ key: "soc", label: "处理器", value: "高通 骁龙 8+ Gen 1（降频版，台积电 4nm，八核，最高 3.0GHz，Adreno 730 GPU）" },
			{ key: "memory", label: "内存", value: "12GB LPDDR5" },
			{ key: "storage", label: "存储", value: "256GB UFS 3.1" },
			{ key: "display", label: "屏幕", value: "6.67 英寸 3200×1440（2K）AMOLED / 120Hz / 峰值 1400nit / 1920Hz 高频 PWM 调光" },
			{ key: "camera", label: "后置相机", value: "6400 万主摄（OIS 光学防抖）+ 800 万超广角 + 200 万微距" },
			{ key: "cameraFront", label: "前置相机", value: "1600 万像素" },
			{ key: "battery", label: "电池", value: "5500mAh（67W 有线 + 30W 无线快充）" },
			{ key: "os", label: "系统", value: "MIUI 14（基于 Android 13）" },
			{ key: "network", label: "网络", value: "5G + 双频 Wi-Fi 6 增强版 + 蓝牙 5.3 + NFC + 红外" },
		],
	},
];

/** 获取所有设备数据列表 */
export function getDevicesList(): DeviceItem[] {
	return devicesData;
}
