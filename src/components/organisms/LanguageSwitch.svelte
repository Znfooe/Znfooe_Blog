<script lang="ts">
import Menu from "@components/atoms/navigation/Menu.svelte";
import {
	DEFAULT_LANGUAGE,
	availableLanguages,
	resolveLanguage,
} from "@i18n/languages";
import Icon from "@iconify/svelte";
import { onMount } from "svelte";

/**
 * 语言切换器 —— 顶栏图标按钮 + 下拉菜单（复用 M3E Menu 原子与菜单互斥总线）。
 * 点击语言项后写入 localStorage（偏好持久化），再整页跳转到对应语言前缀路径
 * （默认语言无前缀；其余语言为 /zh-CN/ 等目录段）。跳转会触发服务端按目标语言
 * 重新渲染，因此是真正的多语言切换，而非纯前端替换。
 */

let menuOpen = $state(false);
let currentLang = $state(DEFAULT_LANGUAGE);
let rootPath = $state("/");

onMount(() => {
	// 从 <html lang> 读取当前语言（Layout 在 SSR 时按语言写入）
	const htmlLang = document.documentElement.lang?.toLowerCase() ?? "";
	// html lang 形如 "zh-cn"/"en"，映射回语言代码（前缀用连字符）
	const meta = availableLanguages().find(
		(l) => l.prefix.toLowerCase() === htmlLang || l.code.toLowerCase() === htmlLang,
	);
	currentLang = meta?.code ?? DEFAULT_LANGUAGE;

	// 计算当前语言的「站点根路径」：默认语言为 /，其余为 /zh-CN/
	const rootMeta = resolveLanguage(currentLang);
	rootPath = rootMeta.prefix ? `/${rootMeta.prefix}/` : "/";
});

/** 切换语言：持久化偏好 + 整页跳转到目标语言的当前页面 */
function switchLanguage(code: string) {
	if (code === currentLang) {
		menuOpen = false;
		return;
	}
	try {
		localStorage.setItem("lang", code);
	} catch {
		// localStorage 不可用（隐私模式等）时忽略，仍执行跳转
	}
	menuOpen = false;

	const target = resolveLanguage(code);
	const pathname = window.location.pathname;

	// 剥离当前语言前缀，得到「站点内规范路径」（默认语言无前缀）。
	const currentMeta = resolveLanguage(currentLang);
	let canonicalPath = pathname;
	if (currentMeta.prefix) {
		const clean = pathname.replace(/^\/+/, "");
		const seg = clean.split("/");
		if (seg[0]?.toLowerCase() === currentMeta.prefix.toLowerCase()) {
			canonicalPath = "/" + seg.slice(1).join("/");
		}
	}

	// 拼出目标语言的当前页面路径：默认语言无前缀，其余语言加 /<prefix>/。
	const targetUrl = target.prefix
		? `/${target.prefix}${canonicalPath === "/" ? "/" : canonicalPath}`
		: canonicalPath === "/"
			? "/"
			: canonicalPath;
	window.location.href = targetUrl;
}
</script>

<div class="relative z-50 flex h-10 w-10 shrink-0 items-center justify-center">
	<button
		type="button"
		aria-label="Language"
		aria-haspopup="menu"
		aria-expanded={menuOpen}
		class="m3-state-layer relative inline-flex items-center justify-center rounded-full h-10 w-10 border-none cursor-pointer select-none text-[var(--on-surface)]"
		style="font-size: 1.25rem; line-height: 1; --m3e-state-color: var(--on-surface); --m3e-focus-outline: var(--on-surface);"
		id="language-switch"
		onclick={() => (menuOpen = !menuOpen)}
	>
		<Icon icon="material-symbols:language-rounded" class="text-[1.25rem]"></Icon>
	</button>

	<Menu bind:open={menuOpen} label="Language" class="absolute top-11 right-0 hidden lg:block">
		{#each availableLanguages() as lang (lang.code)}
			<button
				class="m3-menu-item"
				class:selected={currentLang === lang.code}
				onclick={() => switchLanguage(lang.code)}
			>
				<span class="m3-menu-item__content">
					<span class="m3-menu-item__label">{lang.nativeName}</span>
				</span>
				<span class="m3-menu-item__check m3-menu-item__trailing" aria-hidden="true">
					<Icon icon="material-symbols:check-rounded" class="text-[1.25rem]"></Icon>
				</span>
			</button>
		{/each}
	</Menu>
</div>
