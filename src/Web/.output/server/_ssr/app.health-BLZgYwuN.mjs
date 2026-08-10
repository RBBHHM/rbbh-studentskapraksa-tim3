import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { n as apiBaseUrl } from "./http-client-CjYYYiH6.mjs";
import { L as CircleX, R as CircleCheck, m as RefreshCw } from "../_libs/lucide-react.mjs";
import { t as Button } from "./button-2bc_dve7.mjs";
import { n as Text, t as Heading } from "./typography-48X1uu2Z.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/app.health-BLZgYwuN.js
var import_jsx_runtime = require_jsx_runtime();
var checks = [
	{
		key: "api",
		label: "API",
		path: "/api/health"
	},
	{
		key: "db",
		label: "PostgreSQL",
		path: "/api/health/db"
	},
	{
		key: "storage",
		label: "Skladište dokumenata",
		path: "/api/health/storage"
	},
	{
		key: "auth",
		label: "Keycloak",
		path: "/api/health/auth"
	}
];
async function checkHealth() {
	return Promise.all(checks.map(async (check) => {
		try {
			const response = await fetch(`${apiBaseUrl}${check.path}`);
			return {
				...check,
				ok: response.ok,
				status: response.status
			};
		} catch {
			return {
				...check,
				ok: false,
				status: 0
			};
		}
	}));
}
function HealthPage() {
	const query = useQuery({
		queryKey: ["health"],
		queryFn: checkHealth,
		refetchInterval: 3e4
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-start justify-between",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-eyebrow text-text-tertiary",
				children: "Administracija"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heading, {
				level: 1,
				size: 4,
				className: "mt-2",
				children: "Zdravlje sistema"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, {
				tone: "secondary",
				className: "mt-2",
				children: "Lokalna provjera API-ja i njegovih ključnih zavisnosti."
			})
		] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
			variant: "secondary",
			onClick: () => query.refetch(),
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "size-4" }), "Provjeri"]
		})]
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "mt-7 grid gap-4 sm:grid-cols-2",
		children: query.data?.map((check) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
			className: "flex items-center gap-4 rounded-sm border border-border-subtle bg-surface-default p-6",
			children: [check.ok ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "size-7 text-feedback-success" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleX, { className: "size-7 text-feedback-danger" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-bold",
				children: check.label
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-text-secondary",
				children: check.ok ? "Dostupno" : `Nedostupno (${check.status || "network"})`
			})] })]
		}, check.key))
	})] });
}
var SplitComponent = HealthPage;
//#endregion
export { SplitComponent as component };
