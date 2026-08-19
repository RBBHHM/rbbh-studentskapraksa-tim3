import { a as __toESM, r as __exportAll, t as __exportAll$1 } from "./rolldown-runtime-D7D4PA-g.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { a as useRouterState, c as Outlet, d as createRootRouteWithContext, f as Link, g as redirect, h as useRouter, i as HeadContent, l as lazyRouteComponent, r as Scripts, s as createRouter, u as createFileRoute } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { t as QueryClient } from "../_libs/tanstack__query-core.mjs";
import { r as QueryClientProvider } from "../_libs/tanstack__react-query.mjs";
import { t as Toaster } from "../_libs/sonner.mjs";
import { t as Keycloak } from "../_libs/keycloak-js.mjs";
import { t as instance } from "../_libs/i18next.mjs";
import { t as I18nextProvider } from "../_libs/react-i18next.mjs";
import { t as ICU } from "../_libs/i18next-icu+intl-messageformat.mjs";
import { t as Backend } from "../_libs/i18next-http-backend.mjs";
import { a as numberType, c as unionType, i as literalType, l as ZodIssueCode, n as booleanType, o as objectType, r as enumType, s as stringType, t as arrayType } from "../_libs/zod.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/router-Co5KCLsv.js
var router_Co5KCLsv_exports = /* @__PURE__ */ __exportAll({
	a: () => normalizeLocale,
	c: () => isAuthenticationConfigured,
	getRouter: () => getRouter,
	i: () => useLocalization,
	l: () => keycloak,
	n: () => Route,
	o: () => ThemeContext,
	r: () => Route$14,
	s: () => getAccessToken,
	t: () => router_exports
});
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var Toaster$1 = ({ ...props }) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster, {
		className: "toaster group",
		toastOptions: { classNames: {
			toast: "group toast group-[.toaster]:rounded-sm group-[.toaster]:border group-[.toaster]:border-border-default group-[.toaster]:bg-surface group-[.toaster]:font-brand group-[.toaster]:text-text-primary group-[.toaster]:shadow-lg",
			description: "group-[.toast]:text-text-secondary",
			actionButton: "group-[.toast]:bg-surface-brand group-[.toast]:text-text-on-brand",
			cancelButton: "group-[.toast]:bg-surface-muted group-[.toast]:text-text-secondary"
		} },
		...props
	});
};
var keycloakUrl = {
	"BASE_URL": "/",
	"DEV": false,
	"MODE": "production",
	"PROD": true,
	"SSR": true,
	"TSS_DEV_SERVER": "false",
	"TSS_DEV_SSR_STYLES_BASEPATH": "/",
	"TSS_DEV_SSR_STYLES_ENABLED": "true",
	"TSS_DISABLE_CSRF_MIDDLEWARE_WARNING": "false",
	"TSS_INLINE_CSS_ENABLED": "false",
	"TSS_ROUTER_BASEPATH": "",
	"TSS_SERVER_FN_BASE": "/_serverFn/"
}["VITE_KEYCLOAK_URL"];
var keycloakRealm = {
	"BASE_URL": "/",
	"DEV": false,
	"MODE": "production",
	"PROD": true,
	"SSR": true,
	"TSS_DEV_SERVER": "false",
	"TSS_DEV_SSR_STYLES_BASEPATH": "/",
	"TSS_DEV_SSR_STYLES_ENABLED": "true",
	"TSS_DISABLE_CSRF_MIDDLEWARE_WARNING": "false",
	"TSS_INLINE_CSS_ENABLED": "false",
	"TSS_ROUTER_BASEPATH": "",
	"TSS_SERVER_FN_BASE": "/_serverFn/"
}["VITE_KEYCLOAK_REALM"];
var keycloakClientId = {
	"BASE_URL": "/",
	"DEV": false,
	"MODE": "production",
	"PROD": true,
	"SSR": true,
	"TSS_DEV_SERVER": "false",
	"TSS_DEV_SSR_STYLES_BASEPATH": "/",
	"TSS_DEV_SSR_STYLES_ENABLED": "true",
	"TSS_DISABLE_CSRF_MIDDLEWARE_WARNING": "false",
	"TSS_INLINE_CSS_ENABLED": "false",
	"TSS_ROUTER_BASEPATH": "",
	"TSS_SERVER_FN_BASE": "/_serverFn/"
}["VITE_KEYCLOAK_CLIENT_ID"];
var isAuthenticationConfigured = Boolean(keycloakUrl && keycloakRealm && keycloakClientId);
var keycloak = new Keycloak({
	url: keycloakUrl || "http://localhost",
	realm: keycloakRealm || "not-configured",
	clientId: keycloakClientId || "not-configured"
});
var initialization;
function initializeAuthentication() {
	if (!isAuthenticationConfigured) {
		console.warn("Keycloak nije konfigurisan; frontend radi u lokalnom razvojnom režimu.");
		return Promise.resolve(true);
	}
	initialization ??= keycloak.init({
		onLoad: "login-required",
		pkceMethod: "S256",
		checkLoginIframe: false
	});
	return initialization;
}
async function getAccessToken() {
	if (!isAuthenticationConfigured) return void 0;
	await initializeAuthentication();
	await keycloak.updateToken(30);
	if (!keycloak.token) {
		await keycloak.login({ redirectUri: window.location.href });
		throw new Error("Authentication redirect started.");
	}
	return keycloak.token;
}
function AuthProvider({ children }) {
	const [ready, setReady] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)();
	(0, import_react.useEffect)(() => {
		initializeAuthentication().then(() => setReady(true)).catch((reason) => setError(reason instanceof Error ? reason : /* @__PURE__ */ new Error("Authentication failed.")));
	}, []);
	if (error) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
		className: "flex min-h-screen items-center justify-center bg-background p-6",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md rounded-sm border border-border-subtle bg-surface-default p-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-bold text-text-primary",
					children: "Prijava trenutno nije dostupna"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-text-secondary",
					children: error.message
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					className: "mt-5 font-semibold text-text-primary underline",
					onClick: () => location.reload(),
					children: "Pokušaj ponovo"
				})
			]
		})
	});
	if (!ready) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		role: "status",
		className: "flex min-h-screen items-center justify-center bg-background",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "text-sm text-text-secondary",
			children: "Povezivanje sa sigurnom prijavom…"
		})
	});
	return children;
}
var STORAGE_KEY = "rbi-theme";
/** Read the user's OS-level signal when no explicit choice has been stored. */
function resolveSystemTheme() {
	if (typeof window === "undefined") return "light";
	if (window.matchMedia("(prefers-color-scheme: dark)").matches) return "dark";
	return "light";
}
function resolveTheme(theme) {
	return theme === "system" ? resolveSystemTheme() : theme;
}
/**
* Inline, dependency-free script string. Runs in <head> before hydration so
* `data-theme` is correct on first paint (no dark/light flash) and matches
* what `ThemeProvider` computes on mount (no hydration warning).
*/
var themeInitScript = `(function(){try{var s=localStorage.getItem("${STORAGE_KEY}");var t=s;if(t!=="light"&&t!=="dark"){t=window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light";}document.documentElement.setAttribute("data-theme",t);}catch(e){}})();`;
var ThemeContext = (0, import_react.createContext)(void 0);
function ThemeProvider({ children }) {
	const [theme, setThemeState] = (0, import_react.useState)("system");
	const [resolvedTheme, setResolvedTheme] = (0, import_react.useState)("light");
	(0, import_react.useEffect)(() => {
		const stored = window.localStorage.getItem(STORAGE_KEY);
		const initial = stored === "light" || stored === "dark" || stored === "system" ? stored : "system";
		setThemeState(initial);
		setResolvedTheme(resolveTheme(initial));
	}, []);
	(0, import_react.useEffect)(() => {
		document.documentElement.setAttribute("data-theme", resolvedTheme);
	}, [resolvedTheme]);
	(0, import_react.useEffect)(() => {
		if (theme !== "system") return;
		const media = [window.matchMedia("(prefers-color-scheme: dark)")];
		const listener = () => setResolvedTheme(resolveSystemTheme());
		media.forEach((m) => m.addEventListener("change", listener));
		return () => media.forEach((m) => m.removeEventListener("change", listener));
	}, [theme]);
	const setTheme = (0, import_react.useCallback)((next) => {
		setThemeState(next);
		window.localStorage.setItem(STORAGE_KEY, next);
		setResolvedTheme(resolveTheme(next));
	}, []);
	const value = (0, import_react.useMemo)(() => ({
		theme,
		resolvedTheme,
		setTheme
	}), [
		theme,
		resolvedTheme,
		setTheme
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ThemeContext.Provider, {
		value,
		children
	});
}
var styles_default = "/assets/styles-CBfQ9dk5.css";
/**
* Localization environment configuration.
*
* Every knob is a `VITE_` variable so the delivery target can be changed per
* environment without touching code. Nothing here is secret: Phrase and Azure
* publication credentials live only in CI, never in the browser bundle.
*/
var booleanish = unionType([booleanType(), stringType()]).transform((value) => typeof value === "boolean" ? value : value.trim().toLowerCase() === "true");
var positiveMs = unionType([numberType(), stringType()]).transform((value) => typeof value === "number" ? value : Number.parseInt(value, 10)).refine((value) => Number.isFinite(value) && value > 0, "Must be a positive number of milliseconds");
var environmentSchema = objectType({
	/** Absolute or root-relative URL of the ACTIVE environment manifest. */
	manifestUrl: stringType().min(1),
	requestTimeoutMs: positiveMs.default(1e4),
	manifestRevalidationMs: positiveMs.default(6e4),
	enablePseudoLocale: booleanish.default(false),
	debug: booleanish.default(false)
});
var DEFAULT_MANIFEST_URL = "/localization/manifests/development.json";
function readEnv() {
	const env = {
		"BASE_URL": "/",
		"DEV": false,
		"MODE": "production",
		"PROD": true,
		"SSR": true,
		"TSS_DEV_SERVER": "false",
		"TSS_DEV_SSR_STYLES_BASEPATH": "/",
		"TSS_DEV_SSR_STYLES_ENABLED": "true",
		"TSS_DISABLE_CSRF_MIDDLEWARE_WARNING": "false",
		"TSS_INLINE_CSS_ENABLED": "false",
		"TSS_ROUTER_BASEPATH": "",
		"TSS_SERVER_FN_BASE": "/_serverFn/"
	};
	const raw = {
		manifestUrl: env["VITE_LOCALIZATION_MANIFEST_URL"] ?? DEFAULT_MANIFEST_URL,
		requestTimeoutMs: env["VITE_LOCALIZATION_REQUEST_TIMEOUT_MS"],
		manifestRevalidationMs: env["VITE_LOCALIZATION_MANIFEST_REVALIDATION_MS"],
		enablePseudoLocale: env["VITE_ENABLE_PSEUDO_LOCALE"],
		debug: env["VITE_LOCALIZATION_DEBUG"]
	};
	return Object.fromEntries(Object.entries(raw).filter(([, value]) => value !== void 0 && value !== ""));
}
/**
* Validate configuration once at startup. A misconfigured environment is a
* deployment error and must surface loudly rather than silently degrade.
*/
function readLocalizationEnvironment() {
	const parsed = environmentSchema.safeParse(readEnv());
	if (!parsed.success) {
		const details = parsed.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join("; ");
		throw new Error(`Invalid localization environment configuration — ${details}`);
	}
	const isDevelopment = false;
	return {
		...parsed.data,
		enablePseudoLocale: parsed.data.enablePseudoLocale && isDevelopment,
		isDevelopment
	};
}
var localizationEnvironment = readLocalizationEnvironment();
/** Small, shared namespaces loaded before first paint. Everything else is lazy. */
var criticalNamespaces = ["common", "navigation"];
var defaultNamespace = "common";
/** Route → namespaces, so a route loads only what it renders. */
var routeNamespaces = {
	"/": [
		"common",
		"navigation",
		"overview"
	],
	"/foundations": ["ui-library", "foundations"],
	"/components": [
		"ui-library",
		"components",
		"forms",
		"validation",
		"accessibility"
	],
	"/patterns": [
		"ui-library",
		"patterns",
		"forms",
		"validation"
	],
	"/applications": [
		"api-demo",
		"admin",
		"forms",
		"validation",
		"errors"
	],
	"/architecture": ["ui-library", "architecture"],
	"/app": ["registry", "errors"]
};
function namespacesForRoute(pathname) {
	const match = Object.keys(routeNamespaces).filter((route) => route === "/" ? pathname === "/" : pathname.startsWith(route)).sort((a, b) => b.length - a.length)[0];
	const routed = match ? routeNamespaces[match] ?? [] : [];
	return Array.from(/* @__PURE__ */ new Set([...criticalNamespaces, ...routed]));
}
/** RBI-owned preference cookie. No third party reads or writes it. */
var localePreferenceCookieName = "rbi.locale";
var localePreferenceCookieMaxAgeSeconds = 31536e3;
/** Development-only locales. Never listed in a production manifest. */
var pseudoLocaleCode = "en-XA";
var rtlDevelopmentLocaleCode = "ar-XB";
function isDevelopmentOnlyLocale(code) {
	return code === "en-XA" || code === "ar-XB";
}
function developmentOnlyLocalesEnabled() {
	return localizationEnvironment.enablePseudoLocale;
}
var sinks = /* @__PURE__ */ new Set();
function emitLocalizationTelemetry(event, dimensions = {}) {
	const enriched = {
		environment: localizationEnvironment.isDevelopment ? "development" : "production",
		...dimensions
	};
	if (localizationEnvironment.debug) console.info(`[localization] ${event}`, enriched);
	for (const sink of sinks) try {
		sink(event, enriched);
	} catch {}
}
function categorizeError(error) {
	if (error instanceof DOMException && error.name === "AbortError") return "timeout";
	if (error instanceof LocalizationHttpError) return "http";
	if (error instanceof LocalizationSchemaError) return "schema";
	if (error instanceof TypeError) return "network";
	return "unknown";
}
var LocalizationHttpError = class extends Error {
	url;
	status;
	constructor(url, status) {
		super(`Localization request failed with HTTP ${status}`);
		this.url = url;
		this.status = status;
		this.name = "LocalizationHttpError";
	}
};
var LocalizationSchemaError = class extends Error {
	issues;
	constructor(message, issues = []) {
		super(message);
		this.issues = issues;
		this.name = "LocalizationSchemaError";
	}
};
/**
* Development-only pseudo-localization.
*
* Expands text (~35%), accents letters and wraps the result in brackets so
* clipped controls, fixed heights and hardcoded English text become obvious.
* ICU syntax and `{interpolation}` placeholders are preserved verbatim.
*
* Never available in production: the provider only registers it when
* `VITE_ENABLE_PSEUDO_LOCALE=true` in a development build.
*/
var ACCENTS = {
	a: "à",
	b: "ƀ",
	c: "ç",
	d: "ð",
	e: "é",
	f: "ƒ",
	g: "ĝ",
	h: "ĥ",
	i: "í",
	j: "ĵ",
	k: "ķ",
	l: "ĺ",
	m: "ɱ",
	n: "ñ",
	o: "ó",
	p: "þ",
	q: "ɋ",
	r: "ŕ",
	s: "š",
	t: "ţ",
	u: "ü",
	v: "ṽ",
	w: "ŵ",
	x: "ẋ",
	y: "ý",
	z: "ž",
	A: "À",
	B: "Ɓ",
	C: "Ç",
	D: "Ð",
	E: "É",
	F: "Ƒ",
	G: "Ĝ",
	H: "Ĥ",
	I: "Í",
	J: "Ĵ",
	K: "Ķ",
	L: "Ĺ",
	M: "Ṁ",
	N: "Ñ",
	O: "Ó",
	P: "Þ",
	Q: "Ǫ",
	R: "Ŕ",
	S: "Š",
	T: "Ţ",
	U: "Ü",
	V: "Ṽ",
	W: "Ŵ",
	X: "Ẋ",
	Y: "Ý",
	Z: "Ž"
};
var EXPANSION_RATIO = .35;
var PAD_CHARACTER = "~";
/** Segments inside {...} are ICU/interpolation and must survive untouched. */
function splitPreservingPlaceholders(input) {
	const parts = [];
	let depth = 0;
	let buffer = "";
	let literal = false;
	const flush = () => {
		if (buffer) parts.push({
			text: buffer,
			literal
		});
		buffer = "";
	};
	for (const char of input) {
		if (char === "{") {
			if (depth === 0) {
				flush();
				literal = true;
			}
			depth += 1;
		}
		buffer += char;
		if (char === "}") {
			depth = Math.max(0, depth - 1);
			if (depth === 0) {
				flush();
				literal = false;
			}
		}
	}
	flush();
	return parts;
}
function pseudoLocalize(value) {
	if (!value) return value;
	const accented = splitPreservingPlaceholders(value).map((part) => part.literal ? part.text : part.text.replace(/[A-Za-z]/g, (char) => ACCENTS[char] ?? char)).join("");
	const visibleLength = accented.replace(/\{[^}]*\}/g, "").length;
	return `［${accented}${PAD_CHARACTER.repeat(Math.max(1, Math.round(visibleLength * EXPANSION_RATIO)))}］`;
}
/** RTL development locale: same expansion, wrapped in RTL isolation marks. */
function pseudoLocalizeRtl(value) {
	return `\u2067${pseudoLocalize(value)}\u2069`;
}
var pseudoLocalePostProcessorName = "rbi-pseudo";
/** i18next post-processor; registered only in development builds. */
var pseudoLocalePostProcessor = {
	type: "postProcessor",
	name: pseudoLocalePostProcessorName,
	process(value, _key, _options, translator) {
		if (translator?.language === "en-XA") return pseudoLocalize(value);
		if (translator?.language === "ar-XB") return pseudoLocalizeRtl(value);
		return value;
	}
};
/**
* Runtime contract between the localization delivery platform (Azure Blob
* Storage behind Front Door / a CDN) and this application.
*
* The manifest is the ONLY mutable localization artifact: it points at an
* immutable, versioned release. Publishing, promoting and rolling back
* translations therefore never requires a frontend or API deployment.
*
* Everything is validated with Zod at runtime — a malformed manifest must be
* rejected safely rather than poisoning the last-known-good cache.
*/
/** Loose BCP 47 shape check; exact validity is confirmed via `Intl.Locale`. */
var bcp47 = stringType().min(2).max(35).regex(/^[A-Za-z]{2,3}(-[A-Za-z0-9]{2,8})*$/, "Locale must be a valid BCP 47 language tag");
var textDirectionSchema = enumType(["ltr", "rtl"]);
var supportedLocaleSchema = objectType({
	code: bcp47,
	/** Key inside the `common` namespace, e.g. `locales.de`. */
	displayNameKey: stringType().min(1),
	direction: textDirectionSchema,
	enabled: booleanType()
});
/** Namespaces are file names inside a release, so keep them path-safe. */
var namespaceSchema = stringType().min(1).max(64).regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, "Namespace must be lowercase kebab-case");
/** Release ids become URL path segments and must never contain traversal. */
var releaseIdSchema = stringType().min(1).max(64).regex(/^[A-Za-z0-9][A-Za-z0-9._-]*$/, "Release id must be a safe path segment");
var localizationManifestSchema = objectType({
	schemaVersion: literalType(1),
	releaseId: releaseIdSchema,
	defaultLocale: bcp47,
	fallbackLocale: bcp47,
	supportedLocales: arrayType(supportedLocaleSchema).min(1),
	namespaces: arrayType(namespaceSchema).min(1),
	publishedAt: stringType().datetime({ offset: true })
}).strict().superRefine((manifest, ctx) => {
	const codes = new Set(manifest.supportedLocales.map((entry) => entry.code));
	if (codes.size !== manifest.supportedLocales.length) ctx.addIssue({
		code: ZodIssueCode.custom,
		message: "Duplicate locale codes"
	});
	for (const required of [manifest.defaultLocale, manifest.fallbackLocale]) if (!codes.has(required)) ctx.addIssue({
		code: ZodIssueCode.custom,
		message: `Locale "${required}" is not present in supportedLocales`
	});
	if (new Set(manifest.namespaces).size !== manifest.namespaces.length) ctx.addIssue({
		code: ZodIssueCode.custom,
		message: "Duplicate namespaces"
	});
});
/** Validate an unknown payload without throwing, so callers can fall back. */
function validateManifest(payload) {
	const parsed = localizationManifestSchema.safeParse(payload);
	if (parsed.success) return {
		ok: true,
		manifest: parsed.data
	};
	return {
		ok: false,
		issues: parsed.error.issues.map((issue) => `${issue.path.join(".") || "<root>"}: ${issue.message}`)
	};
}
/** Locales a switcher may offer: present in the manifest AND enabled. */
function enabledLocales(manifest) {
	return manifest.supportedLocales.filter((entry) => entry.enabled);
}
/**
* Resolves URLs inside the localization delivery layout.
*
* Layout (immutable after publication):
*   /localization/manifests/<environment>.json
*   /localization/releases/<releaseId>/<locale>/<namespace>.json
*
* Bundle URLs are versioned by release id, which is why they can be cached
* `immutable` for a year: a translation correction produces a NEW release id
* rather than overwriting a published file. No cache-busting query strings.
*/
/** Derive the delivery root from the configured manifest URL. */
function localizationRootFromManifestUrl(manifestUrl) {
	const index = manifestUrl.indexOf("/manifests/");
	if (index === -1) throw new Error(`VITE_LOCALIZATION_MANIFEST_URL must contain "/manifests/" — received "${manifestUrl}"`);
	return manifestUrl.slice(0, index);
}
/** i18next `loadPath` template for the active release. */
function bundleLoadPathTemplate(manifestUrl, releaseId) {
	const release = releaseIdSchema.parse(releaseId);
	return `${localizationRootFromManifestUrl(manifestUrl)}/releases/${release}/{{lng}}/{{ns}}.json`;
}
async function fetchLocalizationJson(url, options) {
	const controller = new AbortController();
	const timeout = setTimeout(() => controller.abort(), options.timeoutMs);
	options.signal?.addEventListener("abort", () => controller.abort(), { once: true });
	try {
		const response = await fetch(url, {
			method: "GET",
			headers: {
				accept: "application/json",
				...options.headers
			},
			...options.cache ? { cache: options.cache } : {},
			signal: controller.signal,
			redirect: "follow"
		});
		const etag = response.headers.get("etag") ?? void 0;
		if (response.status === 304) return {
			payload: void 0,
			status: 304,
			etag,
			notModified: true
		};
		if (!response.ok) throw new LocalizationHttpError(url, response.status);
		if (Number(response.headers.get("content-length") ?? "0") > 1048576) throw new LocalizationHttpError(url, 413);
		const text = await response.text();
		if (text.length > 1048576) throw new LocalizationHttpError(url, 413);
		return {
			payload: JSON.parse(text),
			status: response.status,
			etag,
			notModified: false
		};
	} finally {
		clearTimeout(timeout);
	}
}
/** Custom loader so every bundle read shares our JSON-only, timed fetch. */
function backendOptions(manifest) {
	return {
		loadPath: bundleLoadPathTemplate(localizationEnvironment.manifestUrl, manifest.releaseId),
		async request(_options, url, _payload, callback) {
			const startedAt = Date.now();
			const namespace = url.split("/").pop()?.replace(/\.json$/, "");
			emitLocalizationTelemetry("localization_bundle_load_started", {
				releaseId: manifest.releaseId,
				...namespace ? { namespace } : {}
			});
			for (let attempt = 0; attempt <= 2; attempt += 1) try {
				const result = await fetchLocalizationJson(url, {
					timeoutMs: localizationEnvironment.requestTimeoutMs,
					cache: "default"
				});
				emitLocalizationTelemetry("localization_bundle_load_succeeded", {
					releaseId: manifest.releaseId,
					...namespace ? { namespace } : {},
					durationMs: Date.now() - startedAt
				});
				callback(null, {
					status: 200,
					data: result.payload ?? {}
				});
				return;
			} catch (error) {
				if (attempt === 2) {
					emitLocalizationTelemetry("localization_bundle_load_failed", {
						releaseId: manifest.releaseId,
						...namespace ? { namespace } : {},
						errorCategory: categorizeError(error)
					});
					callback(error, {
						status: 500,
						data: ""
					});
					return;
				}
			}
		}
	};
}
function createLocalizationClient(input) {
	const instance$1 = instance.createInstance();
	const dev = localizationEnvironment.enablePseudoLocale;
	let chain = instance$1.use(ICU).use(Backend);
	if (dev) chain = chain.use(pseudoLocalePostProcessor);
	return chain.init({
		lng: input.locale,
		fallbackLng: [...input.fallbackChain],
		supportedLngs: [
			...input.fallbackChain,
			...input.manifest.supportedLocales.map((entry) => entry.code),
			...dev ? [pseudoLocaleCode, rtlDevelopmentLocaleCode] : []
		],
		load: "currentOnly",
		ns: input.namespaces ?? [...criticalNamespaces],
		defaultNS: defaultNamespace,
		fallbackNS: false,
		partialBundledLanguages: false,
		interpolation: { escapeValue: false },
		returnNull: false,
		parseMissingKeyHandler: () => "",
		saveMissing: false,
		debug: localizationEnvironment.debug,
		backend: backendOptions(input.manifest),
		...dev ? { postProcess: [pseudoLocalePostProcessorName] } : {},
		react: { useSuspense: false }
	}).then(() => instance$1);
}
/**
* Environment manifest client.
*
* The manifest is the only mutable artifact, so it is always revalidated
* (ETag / If-None-Match, `no-cache`) rather than cached as immutable.
*
* Last-known-good: a *validated* manifest is stored so the application keeps
* working when the delivery endpoint is briefly unavailable. A malformed or
* partially validated manifest is never stored.
*/
var LAST_KNOWN_GOOD_KEY = "rbi.localization.lastKnownGoodManifest";
var memoryCache;
var inFlight;
function readLastKnownGood() {
	if (memoryCache) return memoryCache.manifest;
	if (typeof window === "undefined") return void 0;
	try {
		const raw = window.localStorage.getItem(LAST_KNOWN_GOOD_KEY);
		if (!raw) return void 0;
		const result = validateManifest(JSON.parse(raw));
		return result.ok ? result.manifest : void 0;
	} catch {
		return;
	}
}
function writeLastKnownGood(manifest) {
	if (typeof window === "undefined") return;
	try {
		window.localStorage.setItem(LAST_KNOWN_GOOD_KEY, JSON.stringify(manifest));
	} catch {}
}
async function loadOnce(signal) {
	const url = localizationEnvironment.manifestUrl;
	const startedAt = Date.now();
	emitLocalizationTelemetry("localization_manifest_load_started", {});
	const headers = memoryCache?.etag ? { "if-none-match": memoryCache.etag } : void 0;
	const response = await fetchLocalizationJson(url, {
		timeoutMs: localizationEnvironment.requestTimeoutMs,
		cache: "no-cache",
		...headers ? { headers } : {},
		signal
	});
	if (response.notModified && memoryCache) {
		emitLocalizationTelemetry("localization_manifest_load_succeeded", {
			releaseId: memoryCache.manifest.releaseId,
			durationMs: Date.now() - startedAt,
			cacheStatus: "revalidated"
		});
		return {
			manifest: memoryCache.manifest,
			cacheStatus: "revalidated"
		};
	}
	const validation = validateManifest(response.payload);
	if (!validation.ok) {
		emitLocalizationTelemetry("localization_invalid_manifest", { issues: validation.issues });
		throw new LocalizationSchemaError("Localization manifest failed validation", validation.issues);
	}
	const previous = memoryCache?.manifest.releaseId;
	memoryCache = {
		etag: response.etag,
		manifest: validation.manifest
	};
	writeLastKnownGood(validation.manifest);
	emitLocalizationTelemetry("localization_manifest_load_succeeded", {
		releaseId: validation.manifest.releaseId,
		durationMs: Date.now() - startedAt,
		cacheStatus: "miss"
	});
	if (previous && previous !== validation.manifest.releaseId) emitLocalizationTelemetry("localization_release_changed", { releaseId: validation.manifest.releaseId });
	return {
		manifest: validation.manifest,
		cacheStatus: "miss"
	};
}
/**
* Load (or revalidate) the active environment manifest.
*
* Retries are bounded; on exhaustion a validated last-known-good manifest is
* reused when available, otherwise the error propagates to the error state.
*/
async function loadManifest(signal) {
	if (inFlight) return inFlight;
	const request = (async () => {
		let lastError;
		for (let attempt = 0; attempt <= 1; attempt += 1) try {
			return await loadOnce(signal);
		} catch (error) {
			lastError = error;
			emitLocalizationTelemetry("localization_manifest_load_failed", { errorCategory: categorizeError(error) });
		}
		const lastKnownGood = readLastKnownGood();
		if (lastKnownGood) {
			emitLocalizationTelemetry("localization_fallback_used", {
				releaseId: lastKnownGood.releaseId,
				cacheStatus: "last-known-good"
			});
			return {
				manifest: lastKnownGood,
				cacheStatus: "last-known-good"
			};
		}
		throw lastError instanceof Error ? lastError : /* @__PURE__ */ new Error("Localization manifest unavailable");
	})().finally(() => {
		inFlight = void 0;
	});
	inFlight = request;
	return request;
}
function candidates(manifest) {
	const base = enabledLocales(manifest);
	if (!developmentOnlyLocalesEnabled()) return base;
	return base;
}
/**
* Normalize a requested tag against the manifest.
*
* `bs-Latn-BA` → `bs`, `de-AT` → `de`; an unknown language returns undefined so
* the caller can continue down the priority list.
*/
function normalizeLocale(requested, manifest) {
	if (!requested) return void 0;
	const trimmed = requested.trim();
	if (!trimmed) return void 0;
	const supported = candidates(manifest);
	const available = new Map(supported.map((entry) => [entry.code.toLowerCase(), entry.code]));
	if (isDevelopmentOnlyLocale(trimmed) && developmentOnlyLocalesEnabled()) return trimmed;
	const exact = available.get(trimmed.toLowerCase());
	if (exact) return exact;
	const segments = trimmed.split("-");
	for (let length = segments.length - 1; length >= 1; length -= 1) {
		const candidate = segments.slice(0, length).join("-").toLowerCase();
		const match = available.get(candidate);
		if (match) return match;
	}
	const primary = segments[0]?.toLowerCase();
	if (!primary) return void 0;
	return supported.find((entry) => entry.code.toLowerCase().split("-")[0] === primary)?.code;
}
/** Read `/de/components` style prefixes. Returns undefined for unprefixed paths. */
function localeFromPathname(pathname, manifest) {
	if (!pathname) return void 0;
	const first = pathname.split("/").filter(Boolean)[0];
	if (!first) return void 0;
	return normalizeLocale(first, manifest);
}
function readLocaleCookie(cookieHeader) {
	if (!cookieHeader) return void 0;
	for (const part of cookieHeader.split(";")) {
		const [name, ...rest] = part.trim().split("=");
		if (name === "rbi.locale") return decodeURIComponent(rest.join("="));
	}
}
function resolveLocale(input) {
	const { manifest } = input;
	const hit = [
		["userProfile", normalizeLocale(input.userProfileLocale, manifest)],
		["url", localeFromPathname(input.pathname, manifest)],
		["cookie", normalizeLocale(readLocaleCookie(input.cookieHeader), manifest)],
		...(input.browserLocales ?? []).map((tag) => ["browser", normalizeLocale(tag, manifest)])
	].find(([, locale]) => Boolean(locale));
	const locale = hit?.[1] ?? manifest.defaultLocale;
	return {
		locale,
		source: hit ? hit[0] : "manifestDefault",
		entry: entryFor(manifest, locale),
		fallbackChain: buildFallbackChain(locale, manifest)
	};
}
function entryFor(manifest, locale) {
	const found = manifest.supportedLocales.find((entry) => entry.code === locale);
	if (found) return found;
	if (isDevelopmentOnlyLocale(locale)) return {
		code: locale,
		displayNameKey: `locales.${locale}`,
		direction: locale === "ar-XB" ? "rtl" : "ltr",
		enabled: true
	};
	const fallback = manifest.supportedLocales.find((entry) => entry.code === manifest.defaultLocale);
	if (!fallback) throw new Error("Manifest has no default locale entry");
	return fallback;
}
/** de-AT → [de-AT, de, <fallbackLocale>, <defaultLocale>], de-duplicated. */
function buildFallbackChain(locale, manifest) {
	const chain = [locale];
	const segments = locale.split("-");
	for (let length = segments.length - 1; length >= 1; length -= 1) chain.push(segments.slice(0, length).join("-"));
	chain.push(manifest.fallbackLocale, manifest.defaultLocale);
	const supported = /* @__PURE__ */ new Set([...manifest.supportedLocales.map((entry) => entry.code), locale]);
	return Array.from(new Set(chain)).filter((code) => supported.has(code) || isDevelopmentOnlyLocale(code));
}
/** Persist the choice in an RBI-owned, non-sensitive preference cookie. */
function persistLocalePreference(locale) {
	if (typeof document === "undefined") return;
	const secure = window.location.protocol === "https:" ? "; Secure" : "";
	document.cookie = `${localePreferenceCookieName}=${encodeURIComponent(locale)}; Path=/; Max-Age=${localePreferenceCookieMaxAgeSeconds}; SameSite=Lax${secure}`;
}
var LocalizationContext = import_react.createContext(null);
function useLocalization() {
	const context = import_react.useContext(LocalizationContext);
	if (!context) throw new Error("useLocalization must be used inside <LocalizationProvider>");
	return context;
}
function LocalizationProvider({ children, userProfileLocale, pathname, loadingFallback = null, errorFallback }) {
	const [attempt, setAttempt] = import_react.useState(0);
	const [state, setState] = import_react.useState({
		status: "loading",
		locale: "en",
		direction: "ltr"
	});
	const applyDocumentAttributes = import_react.useCallback((locale, direction) => {
		if (typeof document === "undefined") return;
		document.documentElement.lang = locale;
		document.documentElement.dir = direction;
	}, []);
	import_react.useEffect(() => {
		let cancelled = false;
		const controller = new AbortController();
		(async () => {
			try {
				const { manifest } = await loadManifest(controller.signal);
				const resolution = resolveLocale({
					manifest,
					userProfileLocale,
					pathname: pathname ?? (typeof window === "undefined" ? void 0 : window.location.pathname),
					cookieHeader: typeof document === "undefined" ? void 0 : document.cookie,
					browserLocales: typeof navigator === "undefined" ? [] : [...navigator.languages]
				});
				const instance = await createLocalizationClient({
					manifest,
					locale: resolution.locale,
					fallbackChain: resolution.fallbackChain,
					namespaces: [...criticalNamespaces]
				});
				if (cancelled) return;
				emitLocalizationTelemetry("localization_locale_changed", {
					releaseId: manifest.releaseId,
					resolvedLocale: resolution.locale,
					requestedLocale: resolution.locale
				});
				applyDocumentAttributes(resolution.locale, resolution.entry.direction);
				setState({
					status: "ready",
					manifest,
					instance,
					locale: resolution.locale,
					direction: resolution.entry.direction
				});
			} catch (error) {
				if (cancelled) return;
				setState((previous) => ({
					...previous,
					status: "error",
					error: error instanceof Error ? error : /* @__PURE__ */ new Error("Localization unavailable")
				}));
			}
		})();
		return () => {
			cancelled = true;
			controller.abort();
		};
	}, [
		attempt,
		userProfileLocale,
		applyDocumentAttributes
	]);
	import_react.useEffect(() => {
		const instance = state.instance;
		const manifest = state.manifest;
		if (state.status !== "ready" || !instance || !manifest) return;
		const timer = window.setInterval(() => {
			(async () => {
				try {
					const { manifest: latest } = await loadManifest();
					if (latest.releaseId === manifest.releaseId) return;
					const loaded = Object.keys(instance.services.resourceStore.data[state.locale] ?? {});
					const next = await createLocalizationClient({
						manifest: latest,
						locale: state.locale,
						fallbackChain: buildFallbackChain(state.locale, latest),
						namespaces: loaded.length > 0 ? loaded : [...criticalNamespaces]
					});
					emitLocalizationTelemetry("localization_release_changed", {
						releaseId: latest.releaseId,
						resolvedLocale: state.locale
					});
					setState((previous) => ({
						...previous,
						manifest: latest,
						instance: next
					}));
				} catch {}
			})();
		}, localizationEnvironment.manifestRevalidationMs);
		return () => window.clearInterval(timer);
	}, [
		state.status,
		state.instance,
		state.manifest,
		state.locale
	]);
	const loadNamespaces = import_react.useCallback(async (namespaces) => {
		const instance = state.instance;
		if (!instance || namespaces.length === 0) return;
		await instance.loadNamespaces([...namespaces]);
	}, [state.instance]);
	import_react.useEffect(() => {
		if (state.status !== "ready") return;
		const currentPath = pathname ?? (typeof window === "undefined" ? "/" : window.location.pathname);
		loadNamespaces(namespacesForRoute(currentPath));
	}, [
		state.status,
		pathname,
		loadNamespaces
	]);
	const setLocale = import_react.useCallback((requested) => {
		const instance = state.instance;
		const manifest = state.manifest;
		if (!instance || !manifest) return;
		const next = normalizeLocale(requested, manifest) ?? manifest.defaultLocale;
		const direction = (manifest.supportedLocales.find((candidate) => candidate.code === next) ?? manifest.supportedLocales.find((candidate) => candidate.code === manifest.defaultLocale))?.direction ?? "ltr";
		persistLocalePreference(next);
		instance.changeLanguage(next).then(() => {
			applyDocumentAttributes(next, direction);
			emitLocalizationTelemetry("localization_locale_changed", {
				releaseId: manifest.releaseId,
				requestedLocale: requested,
				resolvedLocale: next
			});
			setState((previous) => ({
				...previous,
				locale: next,
				direction
			}));
		});
	}, [
		state.instance,
		state.manifest,
		applyDocumentAttributes
	]);
	const retry = import_react.useCallback(() => setAttempt((value) => value + 1), []);
	const value = import_react.useMemo(() => ({
		status: state.status,
		manifest: state.manifest,
		releaseId: state.manifest?.releaseId,
		locale: state.locale,
		direction: state.direction,
		availableLocales: state.manifest ? enabledLocales(state.manifest) : [],
		error: state.error,
		setLocale,
		retry,
		loadNamespaces
	}), [
		state,
		setLocale,
		retry,
		loadNamespaces
	]);
	if (state.status === "error" && errorFallback && state.error) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LocalizationContext.Provider, {
		value,
		children: errorFallback({
			error: state.error,
			retry
		})
	});
	if (state.status !== "ready" || !state.instance) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LocalizationContext.Provider, {
		value,
		children: loadingFallback
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LocalizationContext.Provider, {
		value,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(I18nextProvider, {
			i18n: state.instance,
			children
		})
	});
}
/**
* Localization loading state.
*
* Shown while the manifest and critical namespaces load. Deliberately free of
* translation keys — the translations are exactly what is not available yet — so
* it uses the neutral brand mark plus a `role="status"` announcement.
*/
function LocalizationLoadingState({ label = "Loading…" }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		role: "status",
		"aria-live": "polite",
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-col items-center gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				"aria-hidden": "true",
				className: "size-6 animate-spin rounded-full border-2 border-border-subtle border-t-[color:var(--brand-yellow,currentColor)] motion-reduce:animate-none"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-sm text-text-tertiary",
				children: label
			})]
		})
	});
}
function LocalizationErrorState({ error, retry }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		role: "alert",
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-xl font-semibold tracking-tight text-text-primary",
					children: "Content could not be loaded"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-text-secondary",
					children: "The application text is temporarily unavailable. Please try again in a moment."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-1 text-xs text-text-tertiary",
					children: ["Reference: ", error.name]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: retry,
					className: "mt-6 inline-flex h-10 items-center justify-center rounded-sm border border-border-default px-4 text-sm font-medium text-text-primary transition-colors hover:border-border-strong focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--focus-ring-color)]",
					children: "Try again"
				})
			]
		})
	});
}
function NotFoundComponent() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-7xl font-bold text-foreground",
					children: "404"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-4 text-xl font-semibold text-foreground",
					children: "Page not found"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "The page you're looking for doesn't exist or has been moved."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-8",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/",
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
						children: "Go home"
					})
				})
			]
		})
	});
}
function ErrorComponent({ error, reset }) {
	console.error(error);
	const router = useRouter();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-xl font-semibold tracking-tight text-foreground",
					children: "This page didn't load"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "Something went wrong on our end. You can try refreshing or head back home."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-8 flex flex-wrap justify-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => {
							router.invalidate();
							reset();
						},
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
						children: "Try again"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: "/",
						className: "inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent",
						children: "Go home"
					})]
				})
			]
		})
	});
}
var Route$18 = createRootRouteWithContext()({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{ title: "RBI Design System" },
			{
				name: "description",
				content: "Raiffeisen Bank International design system and component library"
			},
			{
				name: "author",
				content: "Hana Mahmutović"
			},
			{
				property: "og:title",
				content: "RBI Design System"
			},
			{
				property: "og:description",
				content: "Raiffeisen Bank International design system and component library"
			},
			{
				property: "og:type",
				content: "website"
			},
			{
				name: "twitter:card",
				content: "summary_large_image"
			}
		],
		links: [{
			rel: "stylesheet",
			href: styles_default
		}, {
			rel: "icon",
			href: "/favicon.png",
			type: "image/png"
		}]
	}),
	shellComponent: RootShell,
	component: RootComponent,
	notFoundComponent: NotFoundComponent,
	errorComponent: ErrorComponent
});
function RootShell({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "en",
		suppressHydrationWarning: true,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("head", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("script", { dangerouslySetInnerHTML: { __html: themeInitScript } })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", {
			suppressHydrationWarning: true,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(ThemeProvider, { children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster$1, {
				position: "bottom-right",
				richColors: true,
				closeButton: true
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})]
		})]
	});
}
function RootComponent() {
	const { queryClient } = Route$18.useRouteContext();
	const pathname = useRouterState({ select: (state) => state.location.pathname });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(QueryClientProvider, {
		client: queryClient,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthProvider, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LocalizationProvider, {
			pathname,
			loadingFallback: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LocalizationLoadingState, {}),
			errorFallback: ({ error, retry }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LocalizationErrorState, {
				error,
				retry
			}),
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {})
		}) })
	});
}
var Route$17 = createFileRoute("/")({ beforeLoad: () => {
	throw redirect({ to: "/app" });
} });
var $$splitComponentImporter$16 = () => import("./app-B1K3NbqM.mjs");
var Route$16 = createFileRoute("/app")({ component: lazyRouteComponent($$splitComponentImporter$16, "component") });
var $$splitComponentImporter$15 = () => import("./app.index-vdgl89ig.mjs");
var Route$15 = createFileRoute("/app/")({ component: lazyRouteComponent($$splitComponentImporter$15, "component") });
var $$splitComponentImporter$14 = () => import("./app._resource-DK2CkAo_.mjs");
var Route$14 = createFileRoute("/app/$resource")({ component: lazyRouteComponent($$splitComponentImporter$14, "component") });
var $$splitComponentImporter$13 = () => import("./app.appraisers-CWQIBmnY.mjs");
var Route$13 = createFileRoute("/app/appraisers")({ component: lazyRouteComponent($$splitComponentImporter$13, "component") });
var $$splitComponentImporter$12 = () => import("./app.audit-FgEGWtXl.mjs");
var Route$12 = createFileRoute("/app/audit")({ component: lazyRouteComponent($$splitComponentImporter$12, "component") });
var $$splitComponentImporter$11 = () => import("./app.branches-BAeofxEa.mjs");
var Route$11 = createFileRoute("/app/branches")({ component: lazyRouteComponent($$splitComponentImporter$11, "component") });
var $$splitComponentImporter$10 = () => import("./app.code-lists-DVxAnoMK.mjs");
var Route$10 = createFileRoute("/app/code-lists")({ component: lazyRouteComponent($$splitComponentImporter$10, "component") });
var $$splitComponentImporter$9 = () => import("./app.documents-KJ1sK8zf.mjs");
var Route$9 = createFileRoute("/app/documents")({ component: lazyRouteComponent($$splitComponentImporter$9, "component") });
var $$splitComponentImporter$8 = () => import("./app.health-BZJNLD1j.mjs");
var Route$8 = createFileRoute("/app/health")({ component: lazyRouteComponent($$splitComponentImporter$8, "component") });
var $$splitComponentImporter$7 = () => import("./app.notifications-B6U0zEh_.mjs");
var Route$7 = createFileRoute("/app/notifications")({ component: lazyRouteComponent($$splitComponentImporter$7, "component") });
var $$splitComponentImporter$6 = () => import("./app.orders-BBNQa_Yi.mjs");
var Route$6 = createFileRoute("/app/orders")({ component: lazyRouteComponent($$splitComponentImporter$6, "component") });
var $$splitComponentImporter$5 = () => import("./app.protocol-BIwTp0El.mjs");
var Route$5 = createFileRoute("/app/protocol")({ component: lazyRouteComponent($$splitComponentImporter$5, "component") });
var $$splitComponentImporter$4 = () => import("./app.reports-ChZEjV4m.mjs");
var Route$4 = createFileRoute("/app/reports")({ component: lazyRouteComponent($$splitComponentImporter$4, "component") });
var $$splitComponentImporter$3 = () => import("./app.roles-BQOR02SQ.mjs");
var Route$3 = createFileRoute("/app/roles")({ component: lazyRouteComponent($$splitComponentImporter$3, "component") });
var $$splitComponentImporter$2 = () => import("./app.tasks-CDfbOQ1d.mjs");
var Route$2 = createFileRoute("/app/tasks")({ component: lazyRouteComponent($$splitComponentImporter$2, "component") });
var $$splitComponentImporter$1 = () => import("./app.users-B729LPgC.mjs");
var Route$1 = createFileRoute("/app/users")({ component: lazyRouteComponent($$splitComponentImporter$1, "component") });
var $$splitComponentImporter = () => import("./app.orders_._id-Dr1IXmQB.mjs");
var Route = createFileRoute("/app/orders_/$id")({ component: lazyRouteComponent($$splitComponentImporter, "component") });
var IndexRoute = Route$17.update({
	id: "/",
	path: "/",
	getParentRoute: () => Route$18
});
var AppRoute = Route$16.update({
	id: "/app",
	path: "/app",
	getParentRoute: () => Route$18
});
var AppIndexRoute = Route$15.update({
	id: "/",
	path: "/",
	getParentRoute: () => AppRoute
});
var AppRouteChildren = {
	AppResourceRoute: Route$14.update({
		id: "/$resource",
		path: "/$resource",
		getParentRoute: () => AppRoute
	}),
	AppAppraisersRoute: Route$13.update({
		id: "/appraisers",
		path: "/appraisers",
		getParentRoute: () => AppRoute
	}),
	AppAuditRoute: Route$12.update({
		id: "/audit",
		path: "/audit",
		getParentRoute: () => AppRoute
	}),
	AppBranchesRoute: Route$11.update({
		id: "/branches",
		path: "/branches",
		getParentRoute: () => AppRoute
	}),
	AppCodeListsRoute: Route$10.update({
		id: "/code-lists",
		path: "/code-lists",
		getParentRoute: () => AppRoute
	}),
	AppDocumentsRoute: Route$9.update({
		id: "/documents",
		path: "/documents",
		getParentRoute: () => AppRoute
	}),
	AppHealthRoute: Route$8.update({
		id: "/health",
		path: "/health",
		getParentRoute: () => AppRoute
	}),
	AppNotificationsRoute: Route$7.update({
		id: "/notifications",
		path: "/notifications",
		getParentRoute: () => AppRoute
	}),
	AppOrdersRoute: Route$6.update({
		id: "/orders",
		path: "/orders",
		getParentRoute: () => AppRoute
	}),
	AppProtocolRoute: Route$5.update({
		id: "/protocol",
		path: "/protocol",
		getParentRoute: () => AppRoute
	}),
	AppReportsRoute: Route$4.update({
		id: "/reports",
		path: "/reports",
		getParentRoute: () => AppRoute
	}),
	AppRolesRoute: Route$3.update({
		id: "/roles",
		path: "/roles",
		getParentRoute: () => AppRoute
	}),
	AppTasksRoute: Route$2.update({
		id: "/tasks",
		path: "/tasks",
		getParentRoute: () => AppRoute
	}),
	AppUsersRoute: Route$1.update({
		id: "/users",
		path: "/users",
		getParentRoute: () => AppRoute
	}),
	AppIndexRoute,
	AppOrdersIdRoute: Route.update({
		id: "/orders_/$id",
		path: "/orders/$id",
		getParentRoute: () => AppRoute
	})
};
var rootRouteChildren = {
	IndexRoute,
	AppRoute: AppRoute._addFileChildren(AppRouteChildren)
};
var routeTree = Route$18._addFileChildren(rootRouteChildren)._addFileTypes();
var router_exports = /* @__PURE__ */ __exportAll$1({ getRouter: () => getRouter });
var getRouter = () => {
	const queryClient = new QueryClient();
	return createRouter({
		routeTree,
		context: { queryClient },
		scrollRestoration: true,
		defaultPreloadStaleTime: 0
	});
};
//#endregion
export { isAuthenticationConfigured as a, router_Co5KCLsv_exports as c, getAccessToken as i, useLocalization as l, Route$14 as n, keycloak as o, ThemeContext as r, normalizeLocale as s, Route as t };
