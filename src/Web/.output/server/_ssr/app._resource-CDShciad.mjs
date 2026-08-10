import { _ as notFound } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { n as useTranslation } from "../_libs/react-i18next.mjs";
import { n as Route$14 } from "./router-4YZAYmU6.mjs";
import { r as apiClient, t as ApiError } from "./http-client-CjYYYiH6.mjs";
import { m as RefreshCw, z as CircleAlert } from "../_libs/lucide-react.mjs";
import { t as Button } from "./button-2bc_dve7.mjs";
import { n as resourcesBySlug } from "./resources-981scxEj.mjs";
import { n as Text, t as Heading } from "./typography-48X1uu2Z.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/app._resource-CDShciad.js
var import_jsx_runtime = require_jsx_runtime();
/**
* One temporary boundary for the existing API's raw arrays and PagedResult<T>.
* Feature screens never unwrap transport shapes themselves. Generated OpenAPI
* clients can replace this generic reader feature by feature.
*/
async function getResourceRecords(path) {
	const candidate = unwrapCollection(await apiClient.getLegacy(path));
	if (!Array.isArray(candidate)) throw new ApiError(502, {
		code: "unexpected_response_shape",
		message: "The API did not return a collection."
	}, "resource-boundary");
	return candidate.filter(isRecord);
}
function unwrapCollection(payload) {
	if (Array.isArray(payload)) return payload;
	if (!isRecord(payload)) return payload;
	for (const key of [
		"items",
		"data",
		"results",
		"value"
	]) {
		const candidate = payload[key];
		if (Array.isArray(candidate)) return candidate;
		if (isRecord(candidate)) {
			const nested = unwrapCollection(candidate);
			if (Array.isArray(nested)) return nested;
		}
	}
	return payload;
}
function isRecord(value) {
	return typeof value === "object" && value !== null && !Array.isArray(value);
}
function ResourcePage({ resource }) {
	const { t } = useTranslation("registry");
	const query = useQuery({
		queryKey: ["registry", resource.key],
		queryFn: () => getResourceRecords(resource.endpoint),
		enabled: Boolean(resource.endpoint)
	});
	const records = query.data ?? [];
	const firstRecord = records[0];
	const columns = firstRecord ? Object.keys(firstRecord).filter((key) => isReadable(firstRecord[key])).slice(0, 6) : [];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		"aria-labelledby": `${resource.key}-heading`,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-eyebrow text-text-tertiary",
					children: t(`areas.${resource.area}`)
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heading, {
					level: 1,
					size: 4,
					id: `${resource.key}-heading`,
					className: "mt-2",
					children: t(`resources.${resource.key}.title`)
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, {
					tone: "secondary",
					className: "mt-2 max-w-prose",
					children: t(`resources.${resource.key}.description`)
				})
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				variant: "secondary",
				onClick: () => query.refetch(),
				disabled: query.isFetching,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: `size-4 ${query.isFetching ? "animate-spin" : ""}` }), t("actions.refresh")]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-8 overflow-hidden rounded-sm border border-border-subtle bg-surface-default",
			children: [
				!resource.endpoint && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "px-6 py-14 sm:px-10",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "max-w-2xl",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-eyebrow text-text-tertiary",
								children: t("states.integrationEyebrow")
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "mt-3 text-xl font-bold text-text-primary",
								children: t("states.integrationTitle")
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, {
								tone: "secondary",
								className: "mt-3",
								children: t("states.integrationBody")
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", {
								className: "mt-5 block rounded-xs bg-surface-sunken p-4 font-mono text-xs text-text-secondary",
								children: t(`resources.${resource.key}.plannedEndpoint`)
							})
						]
					})
				}),
				query.isLoading && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "space-y-3 p-6",
					"aria-label": t("states.loading"),
					children: [
						1,
						2,
						3,
						4
					].map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-10 animate-pulse rounded-xs bg-surface-muted" }, item))
				}),
				query.isError && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col items-center px-6 py-16 text-center",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "size-8 text-feedback-danger" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "mt-4 font-bold",
							children: t("states.errorTitle")
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, {
							tone: "secondary",
							className: "mt-2 max-w-prose",
							children: t("states.errorBody")
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							className: "mt-5",
							onClick: () => query.refetch(),
							children: t("actions.tryAgain")
						})
					]
				}),
				query.isSuccess && records.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "px-6 py-16 text-center",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-bold",
						children: t("states.emptyTitle")
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, {
						tone: "secondary",
						className: "mt-2",
						children: t("states.emptyBody")
					})]
				}),
				query.isSuccess && records.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "overflow-x-auto",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
						className: "w-full text-left text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
							className: "bg-surface-subtle text-text-secondary",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: columns.map((column) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "whitespace-nowrap px-4 py-3 font-semibold",
								children: humanize(column)
							}, column)) })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", {
							className: "divide-y divide-border-subtle",
							children: records.map((record, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", {
								className: "hover:bg-surface-subtle",
								children: columns.map((column) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "max-w-72 truncate px-4 py-3 text-text-primary",
									children: formatValue(record[column])
								}, column))
							}, String(record["id"] ?? record["Id"] ?? index)))
						})]
					})
				})
			]
		})]
	});
}
function isReadable(value) {
	return value == null || [
		"string",
		"number",
		"boolean"
	].includes(typeof value);
}
function humanize(value) {
	return value.replace(/([a-z])([A-Z])/g, "$1 $2").replaceAll("_", " ").replace(/^./, (letter) => letter.toUpperCase());
}
function formatValue(value) {
	if (value == null || value === "") return "—";
	if (typeof value === "boolean") return value ? "Da" : "Ne";
	return String(value);
}
function MigratedResourceRoute() {
	const { resource: slug } = Route$14.useParams();
	const resource = resourcesBySlug.get(slug);
	if (!resource) throw notFound();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResourcePage, { resource });
}
//#endregion
export { MigratedResourceRoute as component };
