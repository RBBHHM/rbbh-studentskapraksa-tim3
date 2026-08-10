import { a as __toESM } from "./rolldown-runtime-D7D4PA-g.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { a as useRouterState, c as Outlet, f as Link, p as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { i as useQueryClient, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { n as useTranslation } from "../_libs/react-i18next.mjs";
import { a as keycloak, c as useLocalization, o as normalizeLocale, r as ThemeContext } from "./router-4YZAYmU6.mjs";
import { a as cn, i as clearActiveRole, o as getActiveRole, r as apiClient, s as setActiveRole } from "./http-client-CjYYYiH6.mjs";
import { S as Languages, b as LogOut, l as Sun, t as X, v as Moon, y as Menu } from "../_libs/lucide-react.mjs";
import { t as Button } from "./button-2bc_dve7.mjs";
import { t as registryResources } from "./resources-981scxEj.mjs";
import { n as useProfile, t as profileList } from "./use-profile-DGTdcA9L.mjs";
import { t as useBusinessText } from "./use-business-text-CuxR3Fdh.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/app-Bq6o5jB-.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
/** Access the current theme, its resolved value, and the setter. */
function useTheme() {
	const context = (0, import_react.useContext)(ThemeContext);
	if (!context) throw new Error("useTheme must be used within a ThemeProvider");
	return context;
}
var options = [{
	value: "light",
	icon: Sun,
	labelKey: "theme.light"
}, {
	value: "dark",
	icon: Moon,
	labelKey: "theme.dark"
}];
/**
* Segmented light/dark theme control. Each
* option is a labelled, keyboard-reachable button; the active one carries
* `aria-pressed` so the current theme is never conveyed by colour alone.
*/
function ThemeToggle({ className }) {
	const { resolvedTheme, setTheme } = useTheme();
	const { t } = useTranslation("common");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		role: "group",
		"aria-label": t("theme.switcherAria"),
		className: cn("flex shrink-0 items-center gap-0.5 rounded-sm border border-border-subtle p-0.5", className),
		children: options.map(({ value, icon: Icon, labelKey }) => {
			const active = resolvedTheme === value;
			return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				"aria-pressed": active,
				"aria-label": t(labelKey),
				title: t(labelKey),
				onClick: () => setTheme(value),
				className: cn("flex size-8 items-center justify-center rounded-xs transition-colors duration-150 ease-standard", "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--focus-ring-color)]", active ? "bg-surface-brand text-text-on-brand" : "text-text-tertiary hover:bg-surface-muted hover:text-text-primary"),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
					"aria-hidden": "true",
					className: "size-4"
				})
			}, value);
		})
	});
}
var INVALID = "—";
function toDate(value) {
	const date = value instanceof Date ? value : new Date(value);
	return Number.isNaN(date.getTime()) ? void 0 : date;
}
var RELATIVE_UNITS = [
	["year", 31536e6],
	["month", 2592e6],
	["week", 6048e5],
	["day", 864e5],
	["hour", 36e5],
	["minute", 6e4],
	["second", 1e3]
];
var FILE_SIZE_UNITS = [
	"byte",
	"kilobyte",
	"megabyte",
	"gigabyte",
	"terabyte"
];
function createFormatters(locale) {
	const date = new Intl.DateTimeFormat(locale, { dateStyle: "medium" });
	const dateTime = new Intl.DateTimeFormat(locale, {
		dateStyle: "medium",
		timeStyle: "short"
	});
	const relative = new Intl.RelativeTimeFormat(locale, { numeric: "auto" });
	const number = new Intl.NumberFormat(locale);
	const percent = new Intl.NumberFormat(locale, {
		style: "percent",
		maximumFractionDigits: 1
	});
	const list = new Intl.ListFormat(locale, {
		style: "long",
		type: "conjunction"
	});
	const currencyCache = /* @__PURE__ */ new Map();
	const displayNames = (type) => {
		try {
			return new Intl.DisplayNames([locale], { type });
		} catch {
			return;
		}
	};
	const languageNames = displayNames("language");
	const regionNames = displayNames("region");
	return {
		locale,
		formatDate(value, options) {
			const parsed = toDate(value);
			if (!parsed) return INVALID;
			return options ? new Intl.DateTimeFormat(locale, options).format(parsed) : date.format(parsed);
		},
		formatDateTime(value, options) {
			const parsed = toDate(value);
			if (!parsed) return INVALID;
			return options ? new Intl.DateTimeFormat(locale, options).format(parsed) : dateTime.format(parsed);
		},
		formatRelativeTime(value, now = /* @__PURE__ */ new Date()) {
			const parsed = toDate(value);
			if (!parsed) return INVALID;
			const deltaMs = parsed.getTime() - now.getTime();
			const match = RELATIVE_UNITS.find(([, size]) => Math.abs(deltaMs) >= size) ?? RELATIVE_UNITS.at(-1);
			return relative.format(Math.round(deltaMs / match[1]), match[0]);
		},
		formatNumber(value, options) {
			if (!Number.isFinite(value)) return INVALID;
			return options ? new Intl.NumberFormat(locale, options).format(value) : number.format(value);
		},
		formatCurrency(value, currency, options) {
			if (!Number.isFinite(value)) return INVALID;
			const cacheKey = `${currency}:${JSON.stringify(options ?? {})}`;
			let formatter = currencyCache.get(cacheKey);
			if (!formatter) {
				formatter = new Intl.NumberFormat(locale, {
					style: "currency",
					currency,
					...options
				});
				currencyCache.set(cacheKey, formatter);
			}
			return formatter.format(value);
		},
		formatPercentage(value, options) {
			if (!Number.isFinite(value)) return INVALID;
			return options ? new Intl.NumberFormat(locale, {
				style: "percent",
				...options
			}).format(value) : percent.format(value);
		},
		formatList(values, type) {
			const items = values.filter((item) => item.length > 0);
			if (items.length === 0) return INVALID;
			return type ? new Intl.ListFormat(locale, {
				style: "long",
				type
			}).format(items) : list.format(items);
		},
		formatLocaleName(code) {
			return languageNames?.of(code) ?? code;
		},
		formatRegionName(region) {
			return regionNames?.of(region) ?? region;
		},
		formatFileSize(bytes) {
			if (!Number.isFinite(bytes) || bytes < 0) return INVALID;
			let size = bytes;
			let unitIndex = 0;
			while (size >= 1024 && unitIndex < FILE_SIZE_UNITS.length - 1) {
				size /= 1024;
				unitIndex += 1;
			}
			return new Intl.NumberFormat(locale, {
				style: "unit",
				unit: FILE_SIZE_UNITS[unitIndex],
				unitDisplay: "short",
				maximumFractionDigits: size < 10 && unitIndex > 0 ? 1 : 0
			}).format(size);
		}
	};
}
var cache = /* @__PURE__ */ new Map();
/** Cached across renders and components: one formatter set per locale. */
function getFormatters(locale) {
	let formatters = cache.get(locale);
	if (!formatters) {
		formatters = createFormatters(locale);
		cache.set(locale, formatters);
	}
	return formatters;
}
function useLocalizedNavigation() {
	const navigate = useNavigate();
	const pathname = useRouterState({ select: (state) => state.location.pathname });
	const { manifest, setLocale } = useLocalization();
	return import_react.useMemo(() => {
		const segments = pathname.split("/").filter(Boolean);
		const first = segments[0];
		const urlLocale = manifest && first ? normalizeLocale(first, manifest) : void 0;
		const hasPrefix = Boolean(urlLocale) && first === urlLocale;
		const basePath = `/${(hasPrefix ? segments.slice(1) : segments).join("/")}`;
		const buildLocalizedPath = (locale, path) => {
			const target = path ?? basePath;
			const clean = target === "/" ? "" : target.replace(/^\/+/, "/");
			return hasPrefix ? `/${locale}${clean}` : clean || "/";
		};
		return {
			basePath,
			urlLocale,
			buildLocalizedPath,
			changeLocale: (locale) => {
				setLocale(locale);
				if (hasPrefix) navigate({
					to: buildLocalizedPath(locale),
					replace: true
				});
			}
		};
	}, [
		pathname,
		manifest,
		navigate,
		setLocale
	]);
}
/**
* RBI-branded language switcher.
*
* Options come from the runtime manifest, so publishing a new language makes it
* selectable without a frontend deployment. No flags (a language is not a
* country); display names come from the localization bundle with an
* `Intl.DisplayNames` fallback, and the locale code is only ever a hint.
*/
function LanguageSwitcher({ className }) {
	const { availableLocales, locale, status } = useLocalization();
	const { changeLocale } = useLocalizedNavigation();
	const { t } = useTranslation("common");
	if (status !== "ready" || availableLocales.length <= 1) return null;
	const labelFor = (code, displayNameKey) => {
		const translated = t(displayNameKey, { defaultValue: "" });
		if (translated) return translated;
		return getFormatters(locale).formatLocaleName(code);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cn("flex min-w-0 shrink-0 items-center gap-1.5", className),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Languages, {
				"aria-hidden": "true",
				className: "hidden size-4 shrink-0 text-text-tertiary sm:block"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
				className: "sr-only",
				htmlFor: "language-switcher",
				children: t("language.switcherAria")
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
				id: "language-switcher",
				value: locale,
				onChange: (event) => changeLocale(event.target.value),
				className: cn("h-9 min-w-0 max-w-[10rem] rounded-sm border border-border-subtle bg-transparent px-2 text-sm font-medium", "text-text-primary transition-colors duration-150 ease-standard hover:border-border-default", "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--focus-ring-color)]"),
				children: availableLocales.map((entry) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
					value: entry.code,
					children: labelFor(entry.code, entry.displayNameKey)
				}, entry.code))
			})
		]
	});
}
var assetUrl = (filename) => `/assets/logos/${filename}`;
/**
* Intrinsic aspect ratios of the shipped artwork. Declaring width and height on
* every `<img>` reserves layout space and prevents shift while the asset loads.
*/
var SQUARED_LOCKUP = {
	width: 1400,
	height: 415
};
var PRIMARY_LOCKUP = {
	width: 1400,
	height: 410
};
var BANK_LOCKUP = {
	width: 1200,
	height: 302
};
var BANK_MARK = {
	width: 385,
	height: 385
};
var rbiLogoAssets = {
	colour: {
		url: assetUrl("rbi-logo-col-pos.png"),
		...SQUARED_LOCKUP,
		approvedOn: "White and warm grey surfaces",
		officialName: "RBI-Logo-Bank international Make it happen-St-Squared-Col-Pos-RGB"
	},
	colourInverse: {
		url: assetUrl("rbi-logo-col-neg.png"),
		...SQUARED_LOCKUP,
		approvedOn: "Off-black and photographic surfaces",
		officialName: "RBI-Logo-Bank international Make it happen-St-Squared-Col-Neg-RGB"
	},
	mono: {
		url: assetUrl("rbi-logo-mono-pos.png"),
		...PRIMARY_LOCKUP,
		approvedOn: "Single-colour reproduction on light surfaces",
		officialName: "RBI-Logo-Bank international Make it happen-St-Mono-Pos-RGB"
	},
	monoInverse: {
		url: assetUrl("rbi-logo-mono-neg.png"),
		...PRIMARY_LOCKUP,
		approvedOn: "Single-colour reproduction on off-black or yellow surfaces",
		officialName: "RBI-Logo-Bank international Make it happen-St-Mono-Neg-RGB"
	},
	yellowInverse: {
		url: assetUrl("rbi-logo-yellow-neg.png"),
		...PRIMARY_LOCKUP,
		approvedOn: "Off-black surfaces only",
		officialName: "RBI-Logo-Bank international Make it happen-St-Yell-Neg-RGB"
	},
	bankMono: {
		url: assetUrl("rbi-bank-mono-pos.png"),
		...BANK_LOCKUP,
		approvedOn: "White and warm grey surfaces",
		officialName: "RBI-Logo-Bank-St-Mono-Pos-RGB"
	},
	bankYellowInverse: {
		url: assetUrl("rbi-bank-yellow-neg.png"),
		...BANK_LOCKUP,
		approvedOn: "Off-black surfaces only",
		officialName: "RBI-Logo-Bank-St-Yell-Neg-RGB"
	},
	bankMark: {
		url: assetUrl("rbi-bank-squared-col.png"),
		...BANK_MARK,
		approvedOn: "Any surface — the squared mark carries its own yellow field",
		officialName: "RBI-Logo-Bank-St-Squared-Col-Neg-RGB"
	}
};
/** Optical sizes, not raw pixel heights — the lock-up keeps its aspect ratio. */
var heightClass = {
	xs: "h-5",
	sm: "h-6",
	md: "h-9",
	lg: "h-12",
	xl: "h-16"
};
/** Accessible names per lock-up family, so alt text always matches the artwork. */
var altText = {
	colour: "Raiffeisen Bank International — Make it happen",
	colourInverse: "Raiffeisen Bank International — Make it happen",
	mono: "Raiffeisen Bank International — Make it happen",
	monoInverse: "Raiffeisen Bank International — Make it happen",
	yellowInverse: "Raiffeisen Bank International — Make it happen",
	bankMono: "Raiffeisen Bank",
	bankYellowInverse: "Raiffeisen Bank",
	bankMark: "Raiffeisen Bank"
};
/**
* Renders the official RBI "Make it happen" lock-up.
*
* The artwork is a supplied brand asset served as an image. It is deliberately
* not reproduced as inline SVG paths or as text, and the component exposes no
* colour props: the only way to change its appearance is to choose a different
* approved variant.
*/
function RbiLogo({ variant = "colour", size = "md", decorative = false, className, ...props }) {
	const asset = rbiLogoAssets[variant];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
		src: asset.url,
		width: asset.width,
		height: asset.height,
		alt: decorative ? "" : altText[variant],
		"aria-hidden": decorative || void 0,
		className: cn("w-auto object-contain", heightClass[size], className),
		...props
	});
}
function RegistryShell() {
	const { t } = useTranslation("registry");
	const bt = useBusinessText();
	const pathname = useRouterState({ select: (state) => state.location.pathname });
	const [open, setOpen] = (0, import_react.useState)(false);
	const cache = useQueryClient();
	const profile = useProfile();
	const roles = profileList(profile.data, "roles");
	const activeRole = getActiveRole() ?? roles[0] ?? "";
	(0, import_react.useEffect)(() => {
		if (!getActiveRole() && roles.length === 1 && roles[0]) setActiveRole(roles[0]);
	}, [roles]);
	const changeRole = useMutation({
		mutationFn: (role) => apiClient.postLegacy("/api/me/active-role", { body: { roleCode: role } }),
		onSuccess: async (_result, role) => {
			setActiveRole(role);
			await cache.invalidateQueries();
			location.assign("/app");
		}
	});
	const modules = profileList(profile.data, "availableModules");
	const visibleResources = registryResources.filter((item) => isVisible(item.key, modules));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-surface text-text-primary",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
			className: "glass-strong sticky top-0 z-40 border-b border-border-subtle",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex h-16 w-full items-center gap-4 px-4 lg:px-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/app",
					className: "flex min-w-0 items-center gap-3",
					"aria-label": t("shell.homeLabel"),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RbiLogo, { className: "h-9 w-auto" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "hidden truncate border-l border-border-subtle pl-3 text-sm font-bold sm:block",
						children: t("shell.product")
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "ml-auto flex items-center gap-2",
					children: [
						roles.length > 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "hidden items-center gap-2 text-xs font-semibold md:flex",
							children: [bt("Aktivna uloga", "Active role"), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
								className: "h-9 max-w-52 rounded-sm border border-border-subtle bg-surface-default px-2",
								value: activeRole,
								disabled: changeRole.isPending,
								onChange: (event) => changeRole.mutate(event.target.value),
								children: roles.map((role) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: role }, role))
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "hidden text-right text-xs text-text-secondary md:block",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", {
								className: "block text-text-primary",
								children: String(profile.data?.["displayName"] ?? profile.data?.["DisplayName"] ?? "")
							}), activeRole || roles.join(", ")]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ThemeToggle, {}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LanguageSwitcher, { className: "hidden sm:flex" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "ghost",
							size: "icon",
							title: t("shell.logout", { defaultValue: "Odjava" }),
							onClick: () => {
								clearActiveRole();
								keycloak.logout({ redirectUri: location.origin });
							},
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogOut, { className: "size-4" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "ghost",
							size: "icon",
							className: "lg:hidden",
							onClick: () => setOpen((value) => !value),
							"aria-label": t("shell.menu"),
							children: open ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, {}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Menu, {})
						})
					]
				})]
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid w-full lg:grid-cols-[17rem_minmax(0,1fr)]",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("aside", {
				className: `${open ? "block" : "hidden"} border-r border-border-subtle bg-surface-subtle p-4 lg:block lg:min-h-[calc(100vh-4rem)]`,
				children: [
					"work",
					"operations",
					"administration"
				].map((area) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "px-3 text-eyebrow text-text-tertiary",
						children: t(`areas.${area}`)
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
						className: "mt-2 space-y-1",
						"aria-label": t(`areas.${area}`),
						children: visibleResources.filter((item) => item.area === area).map((item) => {
							const active = item.path === "/app" ? pathname === item.path : pathname.startsWith(item.path);
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: item.path,
								onClick: () => setOpen(false),
								className: `flex min-h-11 items-center gap-3 rounded-sm px-3 py-2 text-sm font-medium transition-colors ${active ? "bg-surface-brand text-text-on-brand" : "text-text-secondary hover:bg-surface-muted hover:text-text-primary"}`,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(item.icon, {
									className: "size-4 shrink-0",
									"aria-hidden": "true"
								}), t(`resources.${item.key}.title`)]
							}, item.key);
						})
					})]
				}, area))
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
				id: "main-content",
				className: "min-w-0 px-4 py-8 lg:px-10 lg:py-10",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {})
			})]
		})]
	});
}
var moduleByResource = {
	orders: "orders",
	tasks: "tasks",
	notifications: "notifications",
	codeLists: "codebooks",
	audit: "audit",
	health: "health",
	users: "access-management",
	roles: "access-management",
	appraisers: "orders",
	protocol: "orders",
	reports: "orders",
	documents: "orders",
	branches: "orders"
};
function isVisible(key, modules) {
	if (key === "dashboard" || modules.length === 0) return true;
	const required = moduleByResource[key];
	return !required || modules.includes(required);
}
var SplitComponent = RegistryShell;
//#endregion
export { SplitComponent as component };
