import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { r as apiClient } from "./http-client-CjYYYiH6.mjs";
import { P as Clock3, R as CircleCheck, m as RefreshCw } from "../_libs/lucide-react.mjs";
import { t as Button } from "./button-2bc_dve7.mjs";
import { t as useBusinessText } from "./use-business-text-CuxR3Fdh.mjs";
import { n as Text, t as Heading } from "./typography-48X1uu2Z.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/app.tasks-LQ29adgD.js
var import_jsx_runtime = require_jsx_runtime();
var pick = (row, ...keys) => keys.map((k) => row[k]).find((v) => v != null);
async function loadTasks() {
	const raw = await apiClient.getLegacy("/api/tasks/my", { query: { pageSize: 100 } });
	const root = raw?.["data"] ?? raw;
	const items = Array.isArray(root) ? root : root?.["items"] ?? root?.["Items"];
	return Array.isArray(items) ? items : [];
}
function TasksPage() {
	const bt = useBusinessText();
	const cache = useQueryClient();
	const query = useQuery({
		queryKey: ["tasks"],
		queryFn: loadTasks
	});
	const accept = useMutation({
		mutationFn: (id) => apiClient.postLegacy(`/api/tasks/${id}/accept`),
		onSuccess: async () => {
			toast.success(bt("Zadatak je prihvaćen.", "Task accepted."));
			await cache.invalidateQueries({ queryKey: ["tasks"] });
		},
		onError: (error) => toast.error(error.message)
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "min-w-0",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-wrap items-start justify-between gap-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "min-w-0",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-eyebrow text-text-tertiary",
						children: bt("Radni proces", "Workflow")
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heading, {
						level: 1,
						size: 4,
						className: "mt-2",
						children: bt("Moji zadaci", "My tasks")
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, {
						tone: "secondary",
						className: "mt-2",
						children: bt("Zadaci dodijeljeni vama ili vašoj aktivnoj ulozi.", "Tasks assigned to you or your active role.")
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				variant: "secondary",
				onClick: () => query.refetch(),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "size-4" }), bt("Osvježi", "Refresh")]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-7 grid gap-3",
			children: [
				query.isLoading && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: bt("Učitavanje…", "Loading…") }),
				query.isError && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-feedback-danger",
					children: query.error.message
				}),
				query.data?.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-sm border border-border-subtle bg-surface-default p-10 text-center",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "mx-auto size-8 text-feedback-success" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "mt-3 font-bold",
						children: bt("Nema otvorenih zadataka", "No open tasks")
					})]
				}),
				query.data?.map((task, index) => {
					const id = Number(pick(task, "id", "Id"));
					const orderId = Number(pick(task, "orderId", "OrderId"));
					const locked = Boolean(pick(task, "isLocked", "IsLocked"));
					return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("article", {
						className: "rounded-sm border border-border-subtle bg-surface-default p-5",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap items-start justify-between gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
										className: "font-bold",
										children: String(pick(task, "title", "Title") ?? "Zadatak")
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-1 text-sm text-text-secondary",
										children: String(pick(task, "orderTitle", "OrderTitle") ?? "")
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mt-3 flex flex-wrap gap-4 text-xs text-text-tertiary",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["#", String(pick(task, "orderNumber", "OrderNumber") ?? orderId)] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "inline-flex gap-1",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock3, { className: "size-3" }), String(pick(task, "dueDate", "DueDate") ?? bt("Bez roka", "No due date"))]
										})]
									})
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-wrap gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: "secondary",
									onClick: () => location.assign(`/app/orders/${orderId}`),
									children: bt("Otvori narudžbu", "Open order")
								}), !locked && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									onClick: () => accept.mutate(id),
									disabled: accept.isPending,
									children: bt("Prihvati zadatak", "Accept task")
								})]
							})]
						})
					}, id || index);
				})
			]
		})]
	});
}
var SplitComponent = TasksPage;
//#endregion
export { SplitComponent as component };
