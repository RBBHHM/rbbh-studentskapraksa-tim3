import { a as __toESM } from "./rolldown-runtime-D7D4PA-g.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { r as apiClient } from "./http-client-DEtq0LLv.mjs";
import { D as FileUp, M as Download, c as Trash2 } from "../_libs/lucide-react.mjs";
import { t as Button } from "./button-BLuTS1CJ.mjs";
import { n as Text, t as Heading } from "./typography-DerBRbfa.mjs";
import { t as Input } from "./input-TqSExkUa.mjs";
import { t as downloadAuthenticatedFile } from "./file-client-hwDrhdLE.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/app.documents-KJ1sK8zf.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var pick = (r, ...k) => k.map((x) => r[x]).find((v) => v != null);
async function load() {
	const raw = await apiClient.getLegacy("/api/shared-documents/");
	const root = raw?.["data"] ?? raw;
	return Array.isArray(root) ? root : [];
}
function SharedDocumentsPage() {
	const cache = useQueryClient();
	const [title, setTitle] = (0, import_react.useState)("");
	const [category, setCategory] = (0, import_react.useState)("Ostalo");
	const query = useQuery({
		queryKey: ["shared-documents"],
		queryFn: load
	});
	const refresh = () => cache.invalidateQueries({ queryKey: ["shared-documents"] });
	const upload = useMutation({
		mutationFn: (file) => {
			const body = new FormData();
			body.append("file", file);
			body.append("title", title);
			body.append("category", category);
			return apiClient.postLegacy("/api/shared-documents/", { body });
		},
		onSuccess: refresh
	});
	const remove = useMutation({
		mutationFn: (id) => apiClient.deleteLegacy(`/api/shared-documents/${id}`),
		onSuccess: refresh
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-eyebrow text-text-tertiary",
				children: "Operacije"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heading, {
				level: 1,
				size: 4,
				className: "mt-2",
				children: "Zajednički dokumenti"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, {
				tone: "secondary",
				className: "mt-2",
				children: "Cjenovnici, obrasci i zajednička dokumentacija dostupna učesnicima procesa."
			})
		] }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-6 flex flex-wrap items-end gap-3 rounded-sm border border-border-subtle bg-surface-default p-5",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "grid gap-1 text-sm font-bold",
					children: ["Naslov", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: title,
						onChange: (e) => setTitle(e.target.value)
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "grid gap-1 text-sm font-bold",
					children: ["Kategorija", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: category,
						onChange: (e) => setCategory(e.target.value)
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "inline-flex h-10 cursor-pointer items-center gap-2 rounded-sm bg-surface-brand px-4 text-sm font-bold text-text-on-brand",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileUp, { className: "size-4" }),
						"Dodaj dokument",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							className: "sr-only",
							type: "file",
							onChange: (e) => {
								const f = e.target.files?.[0];
								if (f && title) upload.mutate(f);
							}
						})
					]
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-3",
			children: query.data?.map((d, i) => {
				const id = Number(pick(d, "id", "Id"));
				const name = String(pick(d, "fileName", "FileName", "title", "Title") ?? `dokument-${id}`);
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
					className: "rounded-sm border border-border-subtle bg-surface-default p-5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-bold",
							children: String(pick(d, "title", "Title") ?? name)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-xs text-text-tertiary",
							children: String(pick(d, "category", "Category") ?? "—")
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-4 flex gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								size: "sm",
								variant: "secondary",
								onClick: () => downloadAuthenticatedFile(`/api/shared-documents/${id}/download`, name),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "size-4" }), "Preuzmi"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "icon",
								variant: "ghost",
								onClick: () => confirm("Obrisati dokument?") && remove.mutate(id),
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-4" })
							})]
						})
					]
				}, id || i);
			})
		})
	] });
}
var SplitComponent = SharedDocumentsPage;
//#endregion
export { SplitComponent as component };
