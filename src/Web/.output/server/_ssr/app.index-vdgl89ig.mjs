import { f as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { r as apiClient } from "./http-client-DEtq0LLv.mjs";
import { F as ClipboardList, G as ArrowRight, I as ClipboardCheck, U as Bell, i as UserRoundSearch } from "../_libs/lucide-react.mjs";
import { n as useProfile, t as profileList } from "./use-profile-DMp4VCaS.mjs";
import { n as Text, t as Heading } from "./typography-DerBRbfa.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/app.index-vdgl89ig.js
var import_jsx_runtime = require_jsx_runtime();
var data = (raw) => raw?.["data"] ?? raw;
var count = (v) => Array.isArray(v) ? v.length : Number(v?.["totalCount"] ?? v?.["TotalCount"] ?? v?.["total"] ?? v?.["Total"] ?? v?.["count"] ?? 0);
function Dashboard() {
	const profile = useProfile();
	const summary = useQuery({
		queryKey: ["dashboard", "orders"],
		queryFn: async () => data(await apiClient.getLegacy("/api/orders/summary"))
	});
	const tasks = useQuery({
		queryKey: ["dashboard", "tasks"],
		queryFn: async () => data(await apiClient.getLegacy("/api/tasks/my", { query: { pageSize: 100 } }))
	});
	const unread = useQuery({
		queryKey: ["dashboard", "notifications"],
		queryFn: async () => data(await apiClient.getLegacy("/api/notifications/unread-count"))
	});
	const cards = [
		{
			label: "Ukupno narudžbi",
			value: count(summary.data),
			icon: ClipboardList,
			to: "/app/orders"
		},
		{
			label: "Moji otvoreni zadaci",
			value: count(tasks.data),
			icon: ClipboardCheck,
			to: "/app/tasks"
		},
		{
			label: "Nepročitane obavijesti",
			value: count(unread.data),
			icon: Bell,
			to: "/app/notifications"
		},
		{
			label: "Aktivne role",
			value: profileList(profile.data, "roles").length,
			icon: UserRoundSearch,
			to: "/app/users"
		}
	];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "rounded-sm bg-surface-inverse p-7 text-text-inverse sm:p-10",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-eyebrow text-text-inverse-muted",
					children: "Digitalizacija procjene nekretnine"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Heading, {
					level: 1,
					size: 5,
					className: "mt-2 text-text-inverse",
					children: [
						"Dobro došli,",
						" ",
						String(profile.data?.["displayName"] ?? profile.data?.["DisplayName"] ?? "korisniče")
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, {
					className: "mt-3 max-w-prose text-text-inverse-muted",
					children: "Radni prostor je prilagođen vašim rolama i permissionima. Izaberite karticu za nastavak rada."
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4",
			children: cards.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: c.to,
				className: "rounded-sm border border-border-subtle bg-surface-default p-5 hover:border-border-brand",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(c.icon, { className: "size-5" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-5 text-3xl font-bold",
						children: c.value
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm text-text-secondary",
						children: c.label
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "mt-4 inline-flex items-center gap-2 text-sm font-semibold",
						children: ["Otvori ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "size-4" })]
					})
				]
			}, c.label))
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-7 rounded-sm border border-border-subtle bg-surface-default p-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-bold",
					children: "Vaš pristup"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-2 text-sm text-text-secondary",
					children: ["Role: ", profileList(profile.data, "roles").join(", ") || "Nije dodijeljena"]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-1 text-sm text-text-secondary",
					children: [
						"Dostupni moduli:",
						" ",
						profileList(profile.data, "availableModules").join(", ") || "Osnovni pristup"
					]
				})
			]
		})
	] });
}
//#endregion
export { Dashboard as component };
