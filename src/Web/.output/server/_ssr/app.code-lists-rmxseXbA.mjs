import { a as __toESM } from "./rolldown-runtime-D7D4PA-g.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { r as apiClient } from "./http-client-CjYYYiH6.mjs";
import { M as Download, _ as Pencil, c as Trash2, g as Plus, h as Power, m as RefreshCw, o as Upload } from "../_libs/lucide-react.mjs";
import { t as Button } from "./button-2bc_dve7.mjs";
import { n as Text, t as Heading } from "./typography-48X1uu2Z.mjs";
import { a as DialogTitle, i as DialogHeader, n as DialogContent, r as DialogDescription, t as Dialog } from "./dialog-DZAL9gfI.mjs";
import { t as Input } from "./input-CMFRGsxE.mjs";
import { t as downloadAuthenticatedFile } from "./file-client-CZFc4nmz.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/app.code-lists-rmxseXbA.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var pick = (r, ...k) => k.map((x) => r[x]).find((v) => v != null);
var unwrap = (raw) => {
	const root = raw?.["data"] ?? raw;
	const items = Array.isArray(root) ? root : root?.["items"] ?? root?.["Items"];
	return Array.isArray(items) ? items : [];
};
function CodebooksPage() {
	const cache = useQueryClient();
	const [selected, setSelected] = (0, import_react.useState)();
	const [bookOpen, setBookOpen] = (0, import_react.useState)(false);
	const [valueOpen, setValueOpen] = (0, import_react.useState)(false);
	const [editingBook, setEditingBook] = (0, import_react.useState)(false);
	const [editingValueId, setEditingValueId] = (0, import_react.useState)();
	const [importFile, setImportFile] = (0, import_react.useState)();
	const [previewToken, setPreviewToken] = (0, import_react.useState)("");
	const [importOpen, setImportOpen] = (0, import_react.useState)(false);
	const [book, setBook] = (0, import_react.useState)({
		code: "",
		name: "",
		description: "",
		category: ""
	});
	const [value, setValue] = (0, import_react.useState)({
		code: "",
		label: "",
		description: "",
		sortOrder: 0
	});
	const books = useQuery({
		queryKey: ["codebooks"],
		queryFn: async () => unwrap(await apiClient.getLegacy("/api/admin/codebooks/"))
	});
	const values = useQuery({
		queryKey: [
			"codebooks",
			selected,
			"values"
		],
		queryFn: async () => unwrap(await apiClient.getLegacy(`/api/codebooks/${selected}/values`)),
		enabled: Boolean(selected)
	});
	const refresh = () => cache.invalidateQueries({ queryKey: ["codebooks"] });
	const mutate = useMutation({
		mutationFn: ({ url, method, body }) => method === "delete" ? apiClient.deleteLegacy(url) : method === "put" ? apiClient.putLegacy(url, { body }) : apiClient.postLegacy(url, body ? { body } : {}),
		onSuccess: async () => {
			setBookOpen(false);
			setValueOpen(false);
			setEditingBook(false);
			setEditingValueId(void 0);
			await refresh();
		}
	});
	const importPreview = useMutation({ mutationFn: async () => {
		const data = new FormData();
		if (!importFile || !selected) throw new Error("Odaberite šifarnik i datoteku.");
		data.append("file", importFile);
		const result = await apiClient.postLegacy("/api/codebooks/import-export/preview", {
			query: {
				codebookType: selected,
				mode: 0
			},
			body: data
		});
		setPreviewToken(String(pick(result, "previewToken", "PreviewToken") ?? ""));
		return result;
	} });
	const confirmImport = useMutation({
		mutationFn: () => apiClient.postLegacy("/api/codebooks/import-export/confirm", { body: { previewToken } }),
		onSuccess: async () => {
			setImportOpen(false);
			setImportFile(void 0);
			setPreviewToken("");
			await refresh();
		}
	});
	const editBook = (row) => {
		setBook({
			code: String(pick(row, "code", "Code") ?? ""),
			name: String(pick(row, "name", "Name") ?? ""),
			description: String(pick(row, "description", "Description") ?? ""),
			category: String(pick(row, "category", "Category") ?? "")
		});
		setEditingBook(true);
		setBookOpen(true);
	};
	const editValue = (row) => {
		setEditingValueId(Number(pick(row, "id", "Id")));
		setValue({
			code: String(pick(row, "code", "Code") ?? ""),
			label: String(pick(row, "label", "Label") ?? ""),
			description: String(pick(row, "description", "Description") ?? ""),
			sortOrder: Number(pick(row, "sortOrder", "SortOrder") ?? 0)
		});
		setValueOpen(true);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "min-w-0",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-start justify-between gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-eyebrow text-text-tertiary",
							children: "Administracija"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heading, {
							level: 1,
							size: 4,
							className: "mt-2",
							children: "Šifarnici"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, {
							tone: "secondary",
							className: "mt-2",
							children: "Kontejneri i vrijednosti centralnih poslovnih šifarnika."
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "secondary",
						onClick: () => books.refetch(),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "size-4" }), "Osvježi"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						onClick: () => {
							setEditingBook(false);
							setBook({
								code: "",
								name: "",
								description: "",
								category: ""
							});
							setBookOpen(true);
						},
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-4" }), "Novi šifarnik"]
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-7 grid min-w-0 gap-6 xl:grid-cols-[minmax(18rem,22rem)_minmax(0,1fr)]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "min-w-0 rounded-sm border border-border-subtle bg-surface-default p-3",
					children: books.data?.map((b, i) => {
						const code = String(pick(b, "code", "Code"));
						const active = pick(b, "isActive", "IsActive") !== false;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: `mb-1 grid min-w-0 grid-cols-[minmax(0,1fr)_auto] items-center gap-2 rounded-sm p-2 text-left ${selected === code ? "bg-surface-brand text-text-on-brand" : "hover:bg-surface-subtle"}`,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								className: "grid min-w-0 gap-1 text-left",
								onClick: () => setSelected(code),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "min-w-0",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", {
										className: "block break-words",
										children: String(pick(b, "name", "Name"))
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", {
										className: "block break-all opacity-70",
										children: code
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs opacity-80",
									children: active ? "Aktivan" : "Neaktivan"
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "flex shrink-0 items-center gap-1",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										size: "icon",
										variant: "ghost",
										title: "Uredi šifarnik",
										onClick: (event) => {
											event.stopPropagation();
											editBook(b);
										},
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, { className: "size-4" })
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										size: "icon",
										variant: "ghost",
										title: active ? "Deaktiviraj" : "Aktiviraj",
										onClick: (event) => {
											event.stopPropagation();
											mutate.mutate({
												url: `/api/admin/codebooks/${code}/${active ? "deactivate" : "activate"}`,
												method: "post"
											});
										},
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Power, { className: "size-4" })
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										size: "icon",
										variant: "ghost",
										title: "Obriši šifarnik",
										onClick: (event) => {
											event.stopPropagation();
											if (confirm("Obrisati šifarnik?")) mutate.mutate({
												url: `/api/admin/codebooks/${code}`,
												method: "delete"
											});
										},
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-4" })
									})
								]
							})]
						}, code || i);
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0 rounded-sm border border-border-subtle bg-surface-default p-5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap items-center justify-between gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
								className: "font-bold",
								children: ["Vrijednosti ", selected ?? ""]
							}), selected && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-wrap gap-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
										size: "sm",
										variant: "secondary",
										onClick: () => downloadAuthenticatedFile(`/api/codebooks/import-export/export?codebookType=${encodeURIComponent(selected)}&format=xlsx&includeInactive=true`, `${selected}.xlsx`),
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "size-4" }), "Izvoz"]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
										size: "sm",
										variant: "secondary",
										onClick: () => setImportOpen(true),
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, { className: "size-4" }), "Uvoz"]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
										size: "sm",
										onClick: () => {
											setEditingValueId(void 0);
											setValue({
												code: "",
												label: "",
												description: "",
												sortOrder: 0
											});
											setValueOpen(true);
										},
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-4" }), "Nova vrijednost"]
									})
								]
							})]
						}),
						!selected && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-8 text-center text-text-secondary",
							children: "Odaberite šifarnik."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-4 divide-y divide-border-subtle",
							children: values.data?.map((v, i) => {
								const id = Number(pick(v, "id", "Id"));
								const active = pick(v, "isActive", "IsActive") !== false;
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between gap-3 py-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: String(pick(v, "label", "Label")) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs text-text-tertiary",
										children: String(pick(v, "code", "Code"))
									})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex gap-1",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
												size: "icon",
												variant: "ghost",
												title: "Uredi",
												onClick: () => editValue(v),
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, { className: "size-4" })
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
												size: "icon",
												variant: "ghost",
												onClick: () => mutate.mutate({
													url: `/api/codebooks/${selected}/values/${id}/${active ? "deactivate" : "activate"}`,
													method: "post",
													body: active ? { reason: "Administrativna izmjena" } : void 0
												}),
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Power, { className: "size-4" })
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
												size: "icon",
												variant: "ghost",
												onClick: () => confirm("Obrisati vrijednost?") && mutate.mutate({
													url: `/api/codebooks/${selected}/values/${id}`,
													method: "delete"
												}),
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-4" })
											})
										]
									})]
								}, id || i);
							})
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: bookOpen,
				onOpenChange: setBookOpen,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: editingBook ? "Uredi šifarnik" : "Novi šifarnik" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, { children: "Kod mora biti jedinstven." })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					className: "grid gap-3",
					onSubmit: (e) => {
						e.preventDefault();
						mutate.mutate({
							url: editingBook ? `/api/admin/codebooks/${book.code}` : "/api/admin/codebooks/",
							method: editingBook ? "put" : "post",
							body: editingBook ? {
								name: book.name,
								description: book.description,
								category: book.category
							} : book
						});
					},
					children: [Object.entries(book).map(([k, v]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "grid gap-1 text-sm font-bold",
						children: [k, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							required: k === "code" || k === "name",
							disabled: editingBook && k === "code",
							value: v,
							onChange: (e) => setBook({
								...book,
								[k]: e.target.value
							})
						})]
					}, k)), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "submit",
						children: "Sačuvaj"
					})]
				})] })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: valueOpen,
				onOpenChange: setValueOpen,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: editingValueId ? "Uredi vrijednost" : "Nova vrijednost" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogDescription, { children: [
					"Vrijednost se dodaje u ",
					selected,
					"."
				] })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					className: "grid gap-3",
					onSubmit: (e) => {
						e.preventDefault();
						mutate.mutate({
							url: `/api/codebooks/${selected}/values${editingValueId ? `/${editingValueId}` : ""}`,
							method: editingValueId ? "put" : "post",
							body: editingValueId ? {
								label: value.label,
								description: value.description,
								sortOrder: value.sortOrder
							} : value
						});
					},
					children: [Object.entries(value).map(([k, v]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "grid gap-1 text-sm font-bold",
						children: [k, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							required: k === "code" || k === "label",
							disabled: Boolean(editingValueId) && k === "code",
							type: k === "sortOrder" ? "number" : "text",
							value: v,
							onChange: (e) => setValue({
								...value,
								[k]: k === "sortOrder" ? Number(e.target.value) : e.target.value
							})
						})]
					}, k)), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "submit",
						children: "Sačuvaj vrijednost"
					})]
				})] })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: importOpen,
				onOpenChange: setImportOpen,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Uvoz šifarnika" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, { children: "Prvo pregledajte validaciju; upis se izvršava tek nakon potvrde." })] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						type: "file",
						accept: ".csv,.xlsx",
						onChange: (event) => setImportFile(event.target.files?.[0])
					}),
					importPreview.data && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("pre", {
						className: "max-h-64 overflow-auto rounded-sm bg-surface-subtle p-3 text-xs",
						children: JSON.stringify(importPreview.data, null, 2)
					}),
					importPreview.error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-feedback-danger",
						children: importPreview.error.message
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex justify-end gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "secondary",
							disabled: !importFile || importPreview.isPending,
							onClick: () => importPreview.mutate(),
							children: "Pregled uvoza"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							disabled: !previewToken || confirmImport.isPending,
							onClick: () => confirmImport.mutate(),
							children: "Potvrdi uvoz"
						})]
					})
				] })
			})
		]
	});
}
var SplitComponent = CodebooksPage;
//#endregion
export { SplitComponent as component };
