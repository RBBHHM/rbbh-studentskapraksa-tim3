import { a as __toESM } from "./rolldown-runtime-D7D4PA-g.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { r as apiClient } from "./http-client-DEtq0LLv.mjs";
import { j as Eye, m as RefreshCw, p as Search } from "../_libs/lucide-react.mjs";
import { t as Button } from "./button-BLuTS1CJ.mjs";
import { n as Text, t as Heading } from "./typography-DerBRbfa.mjs";
import { a as DialogTitle, i as DialogHeader, n as DialogContent, r as DialogDescription, t as Dialog } from "./dialog-BUF0JyRU.mjs";
import { t as Input } from "./input-TqSExkUa.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/app.protocol-BIwTp0El.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var pick = (row, ...keys) => keys.map((key) => row[key]).find((value) => value != null);
var unwrap = (raw) => {
	const root = raw?.["data"] ?? raw;
	const items = Array.isArray(root) ? root : root?.["items"] ?? root?.["Items"];
	return Array.isArray(items) ? items : [];
};
function ProtocolPage() {
	const [search, setSearch] = (0, import_react.useState)("");
	const [selectedId, setSelectedId] = (0, import_react.useState)();
	const query = useQuery({
		queryKey: ["protocol"],
		queryFn: async () => unwrap(await apiClient.getLegacy("/api/protocol/orders", { query: { PageSize: 250 } }))
	});
	const detail = useQuery({
		queryKey: ["protocol", selectedId],
		queryFn: async () => apiClient.getLegacy(`/api/protocol/orders/${selectedId}`),
		enabled: Boolean(selectedId)
	});
	const rows = (0, import_react.useMemo)(() => query.data?.filter((row) => JSON.stringify(row).toLocaleLowerCase("bs").includes(search.toLocaleLowerCase("bs"))) ?? [], [query.data, search]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-wrap items-start justify-between gap-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-eyebrow text-text-tertiary",
					children: "Operacije"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heading, {
					level: 1,
					size: 4,
					className: "mt-2",
					children: "Protokol narudžbi"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, {
					tone: "secondary",
					className: "mt-2",
					children: "Evidencija prijema, otpreme, odgovornih osoba i potpunog kretanja svake narudžbe."
				})
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				variant: "secondary",
				onClick: () => query.refetch(),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "size-4" }), "Osvježi"]
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-6 flex max-w-md items-center gap-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "size-4 text-text-tertiary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
				placeholder: "Broj protokola, narudžba ili klijent…",
				value: search,
				onChange: (event) => setSearch(event.target.value)
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-6 overflow-x-auto rounded-sm border border-border-subtle bg-surface-default",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
				className: "w-full text-left text-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
					className: "bg-surface-subtle",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: [
						"Broj protokola",
						"Narudžba",
						"Klijent",
						"Zaprimljeno",
						"Poslano",
						"Status",
						"Detalji"
					].map((label) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
						className: "px-4 py-3",
						children: label
					}, label)) })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", {
					className: "divide-y divide-border-subtle",
					children: rows.map((row, index) => {
						const id = Number(pick(row, "orderId", "OrderId", "id", "Id"));
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-4 py-3 font-semibold",
								children: String(pick(row, "protocolNumber", "ProtocolNumber") ?? "—")
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-4 py-3",
								children: String(pick(row, "orderNumber", "OrderNumber") ?? id)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-4 py-3",
								children: String(pick(row, "clientName", "ClientName") ?? "—")
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-4 py-3",
								children: date(pick(row, "receivedAt", "ReceivedAt", "createdAt", "CreatedAt"))
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-4 py-3",
								children: date(pick(row, "sentAt", "SentAt"))
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-4 py-3",
								children: String(pick(row, "statusLabel", "StatusLabel", "status", "Status") ?? "—")
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-4 py-3",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									size: "icon",
									variant: "ghost",
									title: "Otvori detalje",
									onClick: () => setSelectedId(id),
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "size-4" })
								})
							})
						] }, id || index);
					})
				})]
			}), !query.isLoading && !rows.length && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "p-8 text-center text-text-secondary",
				children: "Nema protokolarnih zapisa."
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
			open: Boolean(selectedId),
			onOpenChange: (open) => !open && setSelectedId(void 0),
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
				className: "max-h-[85vh] max-w-2xl overflow-y-auto",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Detalj protokola" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, { children: "Potpuna evidencija za odabranu narudžbu." })] }), detail.isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Učitavanje…" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dl", {
					className: "grid gap-3 sm:grid-cols-2",
					children: Object.entries(detail.data?.["data"] ?? detail.data ?? {}).map(([key, value]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "border-b border-border-subtle pb-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
							className: "text-xs font-bold uppercase text-text-tertiary",
							children: human(key)
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
							className: "mt-1 break-words text-sm",
							children: format(value)
						})]
					}, key))
				})]
			})
		})
	] });
}
var date = (value) => value ? new Intl.DateTimeFormat("bs-BA", {
	dateStyle: "medium",
	timeStyle: "short"
}).format(new Date(String(value))) : "—";
var human = (value) => value.replace(/([a-z])([A-Z])/g, "$1 $2").replace(/^./, (char) => char.toUpperCase());
var format = (value) => value == null ? "—" : typeof value === "object" ? JSON.stringify(value) : String(value);
var SplitComponent = ProtocolPage;
//#endregion
export { SplitComponent as component };
