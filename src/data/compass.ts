/**
 * 软件安利数据（本地数据源）。
 * 用途：src/pages/compass.astro → organisms/CompassSection → 软件列表项 + 详情弹窗。
 * 每条 = 一个软件/网站推荐：标题 + 子标签 + 一句话简介 + 详情长文 + 外链。
 * 搜索对 name / summary / tags / description 做模糊包含匹配；
 * 标签 chips 单选过滤，点击某条展开详情弹窗。
 */

/** 单条软件/网站推荐 */
export interface SoftwareEntry {
	/** 稳定标识（测试/筛选选择器） */
	id: string;
	/** 软件/网站名 */
	name: string;
	/** 图标（Iconify 名，如 material-symbols:xxx） */
	icon?: string;
	/** 子标签（音乐、Python、博客 等），用于标签筛选与搜索 */
	tags: string[];
	/** 一句话简介（列表项副标题） */
	summary: string;
	/** 详细描述（详情弹窗，支持 \n 换行分段） */
	description: string;
	/** 外链地址（主链接，如官网 / 预览站） */
	href: string;
	/** GitHub 仓库地址（可选，详情页单独展示） */
	github?: string;
	/** 底部致谢语（可选，如「感谢作者大大开源」） */
	thanks?: string;
}

export const compassData: SoftwareEntry[] = [
	{
		id: "shirone",
		name: "Shirone",
		icon: "material-symbols:auto-awesome-outline-rounded",
		tags: ["博客", "Astro", "Svelte", "前端", "主题"],
		summary: "二次元风 Material 3 博客主题，开箱即用的个人写作空间。",
		description:
			"Shirone 是一个基于 Material 3 Expressive 的动漫风个人博客主题，由 Astro 7、Svelte 5、Tailwind CSS 4 与 Stylus 构建。\n\n它把「色彩随光线与心情流转」的柔和质感，和「翻页不打断氛围」的 Swup 平滑导航结合，让一个属于你的网络角落真正活起来。\n\n核心亮点：\n· 动态 HCT 调色板，支持 Material 3 与 M3 Expressive 双规范，明暗主题一键切换\n· Markdown/MDX 写作，内建数学公式、Mermaid 图、提示框、代码高亮与图片画廊\n· 归档 / 分类 / 标签 / 友链 / 瞬间 / 相册 / 番剧 / 项目 / 技能 / 时间线等整套个人收藏页\n· Pagefind 全文搜索 + RSS + 站点地图，SSR 优先、键盘友好、无障碍通过\n· 十种内置界面语言，可选集成遵循「零负担」原则——关闭即零请求、零 DOM\n\n如果你想要一个安静、好看、又足够能折腾的个人博客，Shirone 是个非常舒服的起点。",
		href: "https://shirone.mysqil.com/",
		github: "https://github.com/LyraVoid/Shirone",
		thanks: "感谢作者大大开源",
	},
	{
		id: "algermusicplayer",
		name: "AlgerMusicPlayer",
		icon: "material-symbols:graphic-eq-rounded",
		tags: ["音乐", "播放器", "Electron", "网易云", "桌面"],
		summary: "第三方音乐播放器，本地服务 + 桌面歌词 + 最高音质下载。",
		description:
			"AlgerMusicPlayer 是一款第三方音乐播放器，集本地服务、桌面歌词、音乐下载与远程控制于一身。\n\n它基于 Electron 构建，本地化服务不依赖在线 API，支持 Desktop / Web / 移动 Web / Android（测试中）多平台运行。\n\n核心功能：\n· 音乐推荐、账号登录与同步、播放历史、歌曲收藏、歌单 / MV / 排行榜 / 每日推荐\n· 沉浸式歌词显示（点左下角封面进入）+ 独立桌面歌词窗口\n· 明暗主题切换、迷你模式、状态栏控制、多语言、自定义全局快捷键\n· 完整音乐服务：歌单 / MV / 专辑，EQ 均衡器、定时播放、远程控制、倍速播放\n· 音乐资源解析（基于 @unblockneteasemusic/server）、单曲音源解析、高品质音乐与文件下载\n· 搜索覆盖音乐 / MV / 专辑 / 歌单 / bilibili\n\n在线预览：http://music.alger.fun/ 。喜欢折腾本地音乐库、想要桌面歌词和高品质下载的话，值得一试。",
		href: "http://music.alger.fun/",
		github: "https://github.com/algerkong/AlgerMusicPlayer",
		thanks: "感谢作者大大开源",
	},
	{
		id: "echo",
		name: "ECHO",
		icon: "material-symbols:surround-sound-rounded",
		tags: ["音乐", "播放器", "HiFi", "本地曲库", "桌面"],
		summary: "为本地音乐而生的 HiFi 桌面播放器，Bit-Perfect 输出。",
		description:
			"ECHO 是「为本地音乐而生的桌面播放器」，专注曲库管理、稳定播放、HiFi 输出与长期使用体验，定位是「功能最全面的音乐播放器」。\n\n它不是套壳浏览器，而是把音频链路真正做重：本地文件走 host-centered 原生数据面，libav 解码 → ECHO SRC → Dither → SDM → FIFO → WASAPI/ASIO/DSD 直出，每一层都能看得见、能旁路。\n\n核心能力：\n· 本地曲库：文件夹扫描、SQLite 曲库、标签 / 封面 / 专辑墙 / 播放列表 / 重复筛选\n· DSP 中心：参数 EQ、Headroom、FIR、声道工具与输出安全\n· 原生输出：WASAPI Shared / Exclusive、ASIO、DSD / DoP 与 HQPlayer\n· 歌词与 MV：本地与在线候选、翻译、罗马音、桌面歌词、沉浸播放页\n· 远程来源：WebDAV、SMB、Jellyfin、Emby、Subsonic、Navidrome\n· 插件扩展：下载器、网络元数据、后台任务，权限边界清晰\n\n仓库为开源社区版（LGPL-3.0）；完整生态（创意工坊、主题、歌词场景、可视化、DSP 预设）在 Steam 版。对音质有追求的本地音乐玩家不容错过。",
		href: "https://echonext.moe/zh/",
		github: "https://github.com/Moekotori/ECHO",
		thanks: "感谢作者大大开源",
	},
	{
		id: "rxgame",
		name: "RX Game",
		icon: "material-symbols:sports-esports-rounded",
		tags: ["游戏", "单机", "资源", "下载"],
		summary: "单机游戏资源下载站，3A 大作与独立佳作一站收录。",
		description:
			"RX Game 是一个单机游戏资源下载站，专注提供电脑（PC）单机游戏的资源下载。\n\n站点持续跟进新游发布与版本迭代，按类型归类整理：\n· 3A 大作：《GTA5》《赛博朋克 2077》《艾尔登法环》《死亡搁浅 2》《红色沙漠》等\n· 热门系列：生化危机系列、合金装备系列、刺客信条系列等\n· 独立 / 小众：《暖雪》《以撒的结合》《杀戮尖塔 2》等\n· 合集资源：如《开罗游戏大合集（62 款）》\n\n每个资源都标注了版本号与容量，置顶推荐热门内容，也提供 D 加密游戏的特殊方案与少量手机游戏资源。想补票前先了解、或寻找单机游戏下载资源的话，可以来这里逛逛。",
		href: "https://www.rxgame.org/",
		thanks: "感谢作者大大开源",
	},
	{
		id: "dongman-gongheguo",
		name: "动漫共和国",
		icon: "material-symbols:theaters-rounded",
		tags: ["动漫", "追番", "在线观看", "社区"],
		summary: "全能型动漫追番平台，海量日漫国创 + 多端同步。",
		description:
			"动漫共和国是一款集在线追番、智能推荐、多端同步于一体的全能型动漫平台，以「让追番更简单、更流畅」为目标。\n\n它聚合了海量日漫、国创、经典番剧与剧场版内容，覆盖热血、恋爱、奇幻、科幻、日常、悬疑等 20+ 类型，每日更新率超高，支持 1080P / 4K 高画质播放。\n\n核心亮点：\n· 海量番剧资源：5000+ 作品，新番专区跟档、经典区周末连刷\n· 多端同步：安卓 / iOS / PC / 网页，进度云同步，换设备不丢记录\n· 流畅播放：清晰度切换、倍速播放、历史续看，弱网优先流畅模式\n· 弹幕互动 + 社区评分 + 离线缓存 + 投屏 + 剧情解读助手\n· 纯净无广告模式，签到兑 VIP 会员\n\n官方入口有多个域名（pc.dmghg.com 为电脑版）。如果你是二次元追番党，这里是值得收藏的精神家园。",
		href: "https://pc.dmghg.com/",
		thanks: "感谢作者大大开源",
	},
];
