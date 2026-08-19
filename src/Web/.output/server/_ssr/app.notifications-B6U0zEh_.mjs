import { a as __toESM } from "./rolldown-runtime-D7D4PA-g.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { r as apiClient } from "./http-client-DEtq0LLv.mjs";
import { B as Check, U as Bell, m as RefreshCw } from "../_libs/lucide-react.mjs";
import { t as Button } from "./button-BLuTS1CJ.mjs";
import { t as useBusinessText } from "./use-business-text-CuxR3Fdh.mjs";
import { n as Text, t as Heading } from "./typography-DerBRbfa.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/app.notifications-B6U0zEh_.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var get = (r, ...k) => k.map((x) => r[x]).find((v) => v != null);
async function load(unreadOnly) {
	const raw = await apiClient.getLegacy("/api/notifications/mine", { query: {
		page: 1,
		pageSize: 100,
		unreadOnly
	} });
	const root = raw?.["data"] ?? raw;
	const items = Array.isArray(root) ? root : root?.["items"] ?? root?.["Items"];
	return Array.isArray(items) ? items : [];
}
function NotificationsPage() {
	const bt = useBusinessText();
	const [unreadOnly, setUnreadOnly] = (0, import_react.useState)(false);
	const cache = useQueryClient();
	const query = useQuery({
		queryKey: ["notifications", unreadOnly],
		queryFn: () => load(unreadOnly)
	});
	const read = useMutation({
		mutationFn: (id) => apiClient.postLegacy(`/api/notifications/${id}/read`),
		onSuccess: async () => {
			toast.success(bt("Obavještenje je označeno kao pročitano.", "Notification marked as read."));
			await cache.invalidateQueries({ queryKey: ["notifications"] });
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
						children: bt("Operacije", "Operations")
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heading, {
						level: 1,
						size: 4,
						className: "mt-2",
						children: bt("Obavještenja", "Notifications")
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, {
						tone: "secondary",
						className: "mt-2",
						children: bt("Sistemske i workflow poruke namijenjene vašem profilu.", "System and workflow messages for your profile.")
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: unreadOnly ? "default" : "secondary",
					onClick: () => setUnreadOnly((value) => !value),
					children: bt("Samo nepročitane", "Unread only")
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					variant: "secondary",
					onClick: () => query.refetch(),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "size-4" }), bt("Osvježi", "Refresh")]
				})]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-7 grid gap-3",
			children: [
				query.data?.map((n, i) => {
					const id = Number(get(n, "id", "Id"));
					const isRead = Boolean(get(n, "isRead", "IsRead"));
					return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("article", {
						className: `rounded-sm border p-5 ${isRead ? "border-border-subtle bg-surface-default" : "border-border-brand bg-surface-brand-subtle"}`,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap items-start gap-4 sm:flex-nowrap",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bell, { className: "mt-1 size-5 shrink-0" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "min-w-0 flex-1",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
											className: "font-bold",
											children: String(get(n, "title", "Title") ?? bt("Obavještenje", "Notification"))
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "mt-2 text-sm text-text-secondary",
											children: String(get(n, "message", "Message", "body", "Body") ?? "")
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "mt-3 text-xs text-text-tertiary",
											children: String(get(n, "createdAt", "CreatedAt") ?? "")
										})
									]
								}),
								!isRead && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									size: "sm",
									variant: "secondary",
									onClick: () => read.mutate(id),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "size-4" }), bt("Označi pročitano", "Mark as read")]
								})
							]
						})
					}, id || i);
				}),
				query.data?.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "rounded-sm border border-border-subtle p-10 text-center",
					children: bt("Nema obavještenja.", "No notifications.")
				}),
				query.isError && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-feedback-danger",
					children: query.error.message
				})
			]
		})]
	});
}
var SplitComponent = NotificationsPage;
//#endregion
export { SplitComponent as component };
