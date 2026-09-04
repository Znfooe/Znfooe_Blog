import type { IntroConfig } from "@/types/introConfig";
import { withUserConfig } from "../utils/config-overlay.ts";

/**
 * 开场加载动画（IntroSplash）。
 *
 * 随主题附带的开场视频底色为 #f7b7ea（浅粉），backdrop 与之保持一致，
 * 这样 contain 模式下视频与幕布完全无缝；更换视频后请同步调整。
 * `enable: false` 时零 DOM、零请求、零运行时。
 */
export const introConfig: IntroConfig = withUserConfig("intro", {
	enable: true,
	src: "/assets/video/logo.mp4",
	fit: "contain",
	backdrop: "#f7b7ea",
	oncePerSession: true,
	maxWait: 6000,
	exitDuration: 600,
	skippable: true,
});
