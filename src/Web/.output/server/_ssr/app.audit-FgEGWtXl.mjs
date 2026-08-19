import { a as __toESM } from "./rolldown-runtime-D7D4PA-g.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { r as apiClient } from "./http-client-DEtq0LLv.mjs";
import { M as Download, j as Eye, m as RefreshCw, p as Search, t as X } from "../_libs/lucide-react.mjs";
import { t as Button } from "./button-BLuTS1CJ.mjs";
import { n as Text, t as Heading } from "./typography-DerBRbfa.mjs";
import { a as DialogTitle, i as DialogHeader, n as DialogContent, r as DialogDescription, t as Dialog } from "./dialog-BUF0JyRU.mjs";
import { t as Input } from "./input-TqSExkUa.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/app.audit-FgEGWtXl.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var empty = {
	search: "",
	module: "",
	actorUsername: "",
	actorRole: "",
	status: "",
	severity: "",
	from: "",
	to: ""
};
var pick = (row, ...keys) => keys.map((key) => row[key]).find((value) => value != null);
var unwrap = (raw) => {
	const root = raw?.["data"] ?? raw;
	const items = Array.isArray(root) ? root : root?.["items"] ?? root?.["Items"];
	return Array.isArray(items) ? items : [];
};
function AuditPage() {
	const [filters, setFilters] = (0, import_react.useState)(empty);
	const [selected, setSelected] = (0, import_react.useState)();
	const query = useQuery({
		queryKey: ["audit", filters],
		queryFn: async () => unwrap(await apiClient.getLegacy("/api/audit", { query: {
			Search: filters.search || void 0,
			Module: filters.module || void 0,
			ActorUsername: filters.actorUsername || void 0,
			ActorRole: filters.actorRole || void 0,
			Status: filters.status || void 0,
			Severity: filters.severity || void 0,
			From: filters.from || void 0,
			To: filters.to ? `${filters.to}T23:59:59` : void 0,
			PageSize: 5e3
		} }))
	});
	const columns = (0, import_react.useMemo)(() => [
		"timestampUtc",
		"actorUsername",
		"activeRole",
		"action",
		"module",
		"entityDisplayName",
		"status",
		"severity"
	], []);
	const update = (key, value) => setFilters((current) => ({
		...current,
		[key]: value
	}));
	const exportCsv = () => {
		const rows = query.data ?? [];
		const csv = [columns.join(";"), ...rows.map((row) => columns.map((column) => `"${String(pick(row, column, column[0].toUpperCase() + column.slice(1)) ?? "").replaceAll("\"", "\"\"")}"`).join(";"))].join("\r\n");
		const url = URL.createObjectURL(new Blob(["﻿", csv], { type: "text/csv" }));
		const anchor = document.createElement("a");
		anchor.href = url;
		anchor.download = `audit-${(/* @__PURE__ */ new Date()).toISOString().slice(0, 10)}.csv`;
		anchor.click();
		URL.revokeObjectURL(url);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "min-w-0 overflow-hidden",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-start justify-between gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-eyebrow text-text-tertiary",
						children: "Administracija"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heading, {
						level: 1,
						size: 4,
						className: "mt-2",
						children: "Audit log"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, {
						tone: "secondary",
						className: "mt-2",
						children: "Sigurnosni i poslovni događaji s akterom, aktivnom ulogom, vremenom i ishodom."
					})
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "secondary",
						onClick: exportCsv,
						disabled: !query.data?.length,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "size-4" }), "CSV"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "secondary",
						onClick: () => query.refetch(),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "size-4" }), "Osvježi"]
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6 grid min-w-0 gap-3 rounded-sm border border-border-subtle bg-surface-default p-4 md:grid-cols-2 xl:grid-cols-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "grid min-w-0 gap-1 text-xs font-semibold xl:col-span-2",
						children: ["Pretraga", /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex min-w-0 items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "size-4 text-text-tertiary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								className: "min-w-0 w-full",
								placeholder: "Akcija, korisnik ili entitet…",
								value: filters.search,
								onChange: (event) => update("search", event.target.value)
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Korisnik",
						value: filters.actorUsername,
						onChange: (value) => update("actorUsername", value)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Aktivna rola",
						value: filters.actorRole,
						onChange: (value) => update("actorRole", value)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Select, {
						label: "Modul",
						value: filters.module,
						values: [
							"Users",
							"Roles",
							"Codebooks",
							"Security",
							"AppraisalOrders",
							"Documents",
							"System"
						],
						onChange: (value) => update("module", value)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Select, {
						label: "Status",
						value: filters.status,
						values: [
							"Success",
							"Failed",
							"Forbidden",
							"Conflict",
							"ValidationFailed",
							"SystemError"
						],
						onChange: (value) => update("status", value)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Select, {
						label: "Ozbiljnost",
						value: filters.severity,
						values: [
							"Info",
							"Warning",
							"Security",
							"Critical"
						],
						onChange: (value) => update("severity", value)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid min-w-0 grid-cols-1 gap-2 sm:grid-cols-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "grid min-w-0 gap-1 text-xs font-semibold",
							children: ["Od", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								className: "min-w-0 w-full",
								type: "date",
								value: filters.from,
								onChange: (event) => update("from", event.target.value)
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "grid min-w-0 gap-1 text-xs font-semibold",
							children: ["Do", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								type: "date",
								min: filters.from,
								value: filters.to,
								onChange: (event) => update("to", event.target.value)
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						className: "md:col-span-2 xl:col-span-4",
						variant: "ghost",
						onClick: () => setFilters(empty),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-4" }), "Očisti filtere"]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6 max-w-full overflow-x-auto rounded-sm border border-border-subtle bg-surface-default",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
					className: "min-w-max text-left text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
						className: "bg-surface-subtle",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: [
							"Vrijeme",
							"Korisnik",
							"Rola",
							"Akcija",
							"Modul",
							"Entitet",
							"Status",
							"Ozbiljnost",
							"Detalj"
						].map((label) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "whitespace-nowrap px-4 py-3",
							children: label
						}, label)) })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", {
						className: "divide-y divide-border-subtle",
						children: query.data?.map((row, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [columns.map((column) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "max-w-64 truncate px-4 py-3",
							children: column === "timestampUtc" ? date(pick(row, column, "TimestampUtc")) : String(pick(row, column, column[0].toUpperCase() + column.slice(1)) ?? "—")
						}, column)), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-4 py-3",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "icon",
								variant: "ghost",
								onClick: () => setSelected(row),
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "size-4" })
							})
						})] }, index))
					})]
				}), !query.isLoading && !query.data?.length && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "p-8 text-center text-text-secondary",
					children: "Nema zapisa za odabrane filtere."
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: Boolean(selected),
				onOpenChange: (open) => !open && setSelected(void 0),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
					className: "max-h-[85vh] max-w-2xl overflow-y-auto",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Detalj audit zapisa" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, { children: "Neizmijenjeni podaci zabilježeni na backendu." })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dl", {
						className: "grid gap-3 sm:grid-cols-2",
						children: Object.entries(selected ?? {}).map(([key, value]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "border-b border-border-subtle pb-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
								className: "text-xs font-bold uppercase text-text-tertiary",
								children: key.replace(/([a-z])([A-Z])/g, "$1 $2")
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
								className: "mt-1 break-words text-sm",
								children: typeof value === "object" ? JSON.stringify(value) : String(value ?? "—")
							})]
						}, key))
					})]
				})
			})
		]
	});
}
function Field({ label, value, onChange }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
		className: "grid min-w-0 gap-1 text-xs font-semibold",
		children: [label, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
			value,
			onChange: (event) => onChange(event.target.value)
		})]
	});
}
function Select({ label, value, values, onChange }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
		className: "grid min-w-0 gap-1 text-xs font-semibold",
		children: [label, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
			className: "h-10 min-w-0 max-w-full rounded-sm border border-border-subtle bg-surface-default px-3",
			value,
			onChange: (event) => onChange(event.target.value),
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
				value: "",
				children: "Sve"
			}), values.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: item }, item))]
		})]
	});
}
var date = (value) => value ? new Intl.DateTimeFormat("bs-BA", {
	dateStyle: "short",
	timeStyle: "medium"
}).format(new Date(String(value))) : "—";
var SplitComponent = AuditPage;
//#endregion
export { SplitComponent as component };
