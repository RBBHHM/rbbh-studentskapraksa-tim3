import { a as __toESM } from "./rolldown-runtime-D7D4PA-g.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { r as apiClient } from "./http-client-DEtq0LLv.mjs";
import { M as Download, m as RefreshCw, p as Search } from "../_libs/lucide-react.mjs";
import { t as Button } from "./button-BLuTS1CJ.mjs";
import { n as Text, t as Heading } from "./typography-DerBRbfa.mjs";
import { t as Input } from "./input-TqSExkUa.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/app.branches-BAeofxEa.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function unwrap(raw) {
	const root = raw?.["data"] ?? raw;
	const value = Array.isArray(root) ? root : root?.["items"] ?? root?.["Items"] ?? root?.["results"];
	return Array.isArray(value) ? value : [];
}
function RecordsPage({ title, description, endpoint, area = "Operacije" }) {
	const [search, setSearch] = (0, import_react.useState)("");
	const query = useQuery({
		queryKey: [endpoint],
		queryFn: async () => unwrap(await apiClient.getLegacy(endpoint, { query: { PageSize: 250 } }))
	});
	const filtered = (0, import_react.useMemo)(() => query.data?.filter((r) => JSON.stringify(r).toLocaleLowerCase("bs").includes(search.toLocaleLowerCase("bs"))) ?? [], [query.data, search]);
	const columns = (0, import_react.useMemo)(() => {
		const first = filtered[0];
		return first ? Object.keys(first).filter((k) => {
			const v = first[k];
			return v == null || [
				"string",
				"number",
				"boolean"
			].includes(typeof v);
		}).slice(0, 10) : [];
	}, [filtered]);
	const exportCsv = () => {
		const csv = [columns.join(";"), ...filtered.map((r) => columns.map((c) => `"${String(r[c] ?? "").replaceAll("\"", "\"\"")}"`).join(";"))].join("\r\n");
		const url = URL.createObjectURL(new Blob(["﻿", csv], { type: "text/csv" }));
		const a = document.createElement("a");
		a.href = url;
		a.download = `${title.toLowerCase().replaceAll(" ", "-")}.csv`;
		a.click();
		URL.revokeObjectURL(url);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-wrap items-start justify-between gap-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-eyebrow text-text-tertiary",
					children: area
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heading, {
					level: 1,
					size: 4,
					className: "mt-2",
					children: title
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, {
					tone: "secondary",
					className: "mt-2",
					children: description
				})
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					variant: "secondary",
					onClick: () => query.refetch(),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "size-4" }), "Osvježi"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					variant: "secondary",
					onClick: exportCsv,
					disabled: !filtered.length,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "size-4" }), "CSV"]
				})]
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-6 flex max-w-md items-center gap-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "size-4 text-text-tertiary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
				value: search,
				onChange: (e) => setSearch(e.target.value),
				placeholder: "Filtriraj prikazane rezultate…"
			})]
		}),
		query.isError && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-6 text-feedback-danger",
			children: query.error.message
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-6 overflow-x-auto rounded-sm border border-border-subtle bg-surface-default",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
					className: "w-full text-left text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
						className: "bg-surface-subtle",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: columns.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "whitespace-nowrap px-4 py-3",
							children: human(c)
						}, c)) })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", {
						className: "divide-y divide-border-subtle",
						children: filtered.map((r, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: columns.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "max-w-80 truncate px-4 py-3",
							title: String(r[c] ?? ""),
							children: format(r[c])
						}, c)) }, String(r["id"] ?? r["Id"] ?? i)))
					})]
				}),
				query.isLoading && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "p-8",
					children: "Učitavanje…"
				}),
				!query.isLoading && !filtered.length && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "p-8 text-center text-text-secondary",
					children: "Nema podataka za prikaz."
				})
			]
		})
	] });
}
var human = (v) => v.replace(/([a-z])([A-Z])/g, "$1 $2").replaceAll("_", " ").replace(/^./, (x) => x.toUpperCase());
var format = (v) => v == null || v === "" ? "—" : typeof v === "boolean" ? v ? "Da" : "Ne" : String(v);
var SplitComponent = () => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RecordsPage, {
	title: "Poslovnice",
	description: "Referentni pregled poslovnica i pripadajućih gradova.",
	endpoint: "/api/branches/",
	area: "Administracija"
});
//#endregion
export { SplitComponent as component };
