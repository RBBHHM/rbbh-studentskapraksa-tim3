import { a as __toESM } from "./rolldown-runtime-D7D4PA-g.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { r as apiClient } from "./http-client-CjYYYiH6.mjs";
import { M as Download, f as Send, m as RefreshCw } from "../_libs/lucide-react.mjs";
import { t as Button } from "./button-2bc_dve7.mjs";
import { n as Text, t as Heading } from "./typography-48X1uu2Z.mjs";
import { t as Input } from "./input-CMFRGsxE.mjs";
import { t as downloadAuthenticatedFile } from "./file-client-CZFc4nmz.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/app.reports-Hi-Z6xrD.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var pick = (row, ...keys) => keys.map((key) => row[key]).find((value) => value != null);
var unwrap = (raw) => {
	const root = raw?.["data"] ?? raw;
	const items = Array.isArray(root) ? root : root?.["items"] ?? root?.["Items"];
	return Array.isArray(items) ? items : [];
};
function ReportsPage() {
	const cache = useQueryClient();
	const [endDate, setEndDate] = (0, import_react.useState)("");
	const [asOfDate, setAsOfDate] = (0, import_react.useState)("");
	const [option, setOption] = (0, import_react.useState)(1);
	const [minDays, setMinDays] = (0, import_react.useState)(5);
	const orders = useQuery({
		queryKey: [
			"reports",
			"orders",
			endDate
		],
		queryFn: async () => unwrap(await apiClient.getLegacy("/api/reports/orders", { query: {
			format: "json",
			endDate: endDate || void 0
		} }))
	});
	const reminders = useQuery({
		queryKey: [
			"reports",
			"reminders",
			minDays
		],
		queryFn: async () => unwrap(await apiClient.getLegacy("/api/reports/appraiser-reminders/", { query: {
			minBusinessDaysOverdue: minDays,
			pageSize: 200
		} }))
	});
	const send = useMutation({
		mutationFn: (orderId) => apiClient.postLegacy(`/api/reports/appraiser-reminders/${orderId}/send`),
		onSuccess: () => cache.invalidateQueries({ queryKey: ["reports", "reminders"] })
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-wrap items-start justify-between gap-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-eyebrow text-text-tertiary",
					children: "Analitika"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heading, {
					level: 1,
					size: 4,
					className: "mt-2",
					children: "Izvještaji"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, {
					tone: "secondary",
					className: "mt-2",
					children: "Operativni pregled, Excel izvještaji koncentracije i rokova te podsjetnici vještacima."
				})
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				variant: "secondary",
				onClick: () => {
					orders.refetch();
					reminders.refetch();
				},
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "size-4" }), "Osvježi"]
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-7 grid gap-4 lg:grid-cols-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-sm border border-border-subtle bg-surface-default p-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-bold",
						children: "Vremena obrade narudžbi"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "mt-4 grid gap-1 text-sm font-semibold",
						children: ["Presjek do datuma", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							type: "date",
							value: endDate,
							onChange: (event) => setEndDate(event.target.value)
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						className: "mt-3",
						variant: "secondary",
						onClick: () => downloadAuthenticatedFile(`/api/reports/orders?format=xlsx${endDate ? `&endDate=${endDate}` : ""}`, "vremena-obrade.xlsx"),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "size-4" }), "Preuzmi Excel"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						className: "mt-3 ml-2",
						variant: "secondary",
						onClick: () => downloadAuthenticatedFile(`/api/reports/timeline${endDate ? `?endDate=${endDate}` : ""}`, "vremenska-linija-narudzbi.xlsx"),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "size-4" }), "Detaljna vremenska linija"]
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-sm border border-border-subtle bg-surface-default p-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-bold",
						children: "Koncentracija vještaka"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-4 grid gap-3 sm:grid-cols-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "grid gap-1 text-sm font-semibold",
							children: ["Opcija", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
								className: "h-10 rounded-sm border border-border-subtle bg-surface-default px-3",
								value: option,
								onChange: (event) => setOption(Number(event.target.value)),
								children: [
									1,
									2,
									3,
									4,
									5
								].map((value) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
									value,
									children: ["Opcija ", value]
								}, value))
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "grid gap-1 text-sm font-semibold",
							children: ["Datum presjeka", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								type: "date",
								value: asOfDate,
								onChange: (event) => setAsOfDate(event.target.value)
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						className: "mt-3",
						variant: "secondary",
						onClick: () => downloadAuthenticatedFile(`/api/reports/concentration?option=${option}${asOfDate ? `&asOfDate=${asOfDate}` : ""}`, "koncentracija-vjestaka.xlsx"),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "size-4" }), "Preuzmi Excel"]
					})
				]
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-6 rounded-sm border border-border-subtle bg-surface-default p-5",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-end justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-bold",
					children: "Zakašnjele procjene"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-text-secondary",
					children: "Narudžbe za koje je moguće poslati podsjetnik vještaku."
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "grid gap-1 text-xs font-semibold",
					children: ["Minimalno radnih dana", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						className: "w-32",
						type: "number",
						min: 1,
						value: minDays,
						onChange: (event) => setMinDays(Number(event.target.value))
					})]
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 divide-y divide-border-subtle",
				children: [reminders.data?.map((row, index) => {
					const orderId = Number(pick(row, "orderId", "OrderId", "id", "Id"));
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-center justify-between gap-3 py-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-semibold",
							children: String(pick(row, "orderNumber", "OrderNumber", "clientName", "ClientName") ?? `Narudžba #${orderId}`)
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-xs text-text-secondary",
							children: [
								String(pick(row, "appraiserName", "AppraiserName") ?? "—"),
								" ·",
								" ",
								String(pick(row, "businessDaysOverdue", "BusinessDaysOverdue") ?? "—"),
								" radnih dana"
							]
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							size: "sm",
							variant: "secondary",
							disabled: send.isPending,
							onClick: () => send.mutate(orderId),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Send, { className: "size-4" }), "Pošalji podsjetnik"]
						})]
					}, orderId || index);
				}), !reminders.isLoading && !reminders.data?.length && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "py-4 text-sm text-text-secondary",
					children: "Nema zakašnjelih procjena."
				})]
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-6 overflow-x-auto rounded-sm border border-border-subtle bg-surface-default",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
				className: "w-full text-left text-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
					className: "bg-surface-subtle",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: [
						"Narudžba",
						"Klijent",
						"Status",
						"Kreirano",
						"Poslano",
						"Završeno"
					].map((label) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
						className: "px-4 py-3",
						children: label
					}, label)) })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", {
					className: "divide-y divide-border-subtle",
					children: orders.data?.map((row, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-4 py-3 font-semibold",
							children: String(pick(row, "orderNumber", "OrderNumber") ?? "—")
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-4 py-3",
							children: String(pick(row, "clientName", "ClientName") ?? "—")
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-4 py-3",
							children: String(pick(row, "statusLabel", "StatusLabel", "status", "Status") ?? "—")
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-4 py-3",
							children: formatDate(pick(row, "createdAt", "CreatedAt"))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-4 py-3",
							children: formatDate(pick(row, "sentAt", "SentAt", "submittedAt", "SubmittedAt"))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-4 py-3",
							children: formatDate(pick(row, "completedAt", "CompletedAt"))
						})
					] }, index))
				})]
			})
		})
	] });
}
var formatDate = (value) => value ? new Intl.DateTimeFormat("bs-BA").format(new Date(String(value))) : "—";
var SplitComponent = ReportsPage;
//#endregion
export { SplitComponent as component };
