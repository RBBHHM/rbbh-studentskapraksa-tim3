import { a as __toESM } from "./rolldown-runtime-D7D4PA-g.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { r as apiClient } from "./http-client-CjYYYiH6.mjs";
import { M as Download, V as BriefcaseBusiness, W as Ban, _ as Pencil, g as Plus, m as RefreshCw, o as Upload, s as TreePalm } from "../_libs/lucide-react.mjs";
import { t as Button } from "./button-2bc_dve7.mjs";
import { n as Text, t as Heading } from "./typography-48X1uu2Z.mjs";
import { a as DialogTitle, i as DialogHeader, n as DialogContent, r as DialogDescription, t as Dialog } from "./dialog-DZAL9gfI.mjs";
import { t as Input } from "./input-CMFRGsxE.mjs";
import { t as downloadAuthenticatedFile } from "./file-client-CZFc4nmz.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/app.appraisers-Cn9dC78H.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var empty = {
	name: "",
	city: "",
	legalForm: "Individual",
	contactEmail: "",
	contactPhone: "",
	notes: "",
	supportedPropertyTypes: "",
	supportedCities: "",
	clientScope: "Sve"
};
var val = (r, ...keys) => keys.map((k) => r[k]).find((x) => x != null);
async function list(filters) {
	const raw = await apiClient.getLegacy("/api/appraisers/", { query: {
		Search: filters.search || void 0,
		City: filters.city || void 0,
		OnLeave: filters.onLeave === "all" ? void 0 : filters.onLeave === "true",
		Blacklisted: filters.blacklisted === "all" ? void 0 : filters.blacklisted === "true",
		Active: filters.active === "all" ? void 0 : filters.active === "true",
		PageSize: 100
	} });
	const root = raw?.["data"] ?? raw;
	const items = Array.isArray(root) ? root : root?.["items"] ?? root?.["Items"];
	return Array.isArray(items) ? items : [];
}
function AppraisersPage() {
	const cache = useQueryClient();
	const [search, setSearch] = (0, import_react.useState)("");
	const [city, setCity] = (0, import_react.useState)("");
	const [onLeave, setOnLeave] = (0, import_react.useState)("all");
	const [blacklisted, setBlacklisted] = (0, import_react.useState)("all");
	const [active, setActive] = (0, import_react.useState)("true");
	const [importOpen, setImportOpen] = (0, import_react.useState)(false);
	const [importFile, setImportFile] = (0, import_react.useState)();
	const [previewToken, setPreviewToken] = (0, import_react.useState)("");
	const [open, setOpen] = (0, import_react.useState)(false);
	const [editingId, setEditingId] = (0, import_react.useState)();
	const [form, setForm] = (0, import_react.useState)(empty);
	const filters = {
		search,
		city,
		onLeave,
		blacklisted,
		active
	};
	const query = useQuery({
		queryKey: ["appraisers", filters],
		queryFn: () => list(filters)
	});
	const invalidate = () => cache.invalidateQueries({ queryKey: ["appraisers"] });
	const create = useMutation({
		mutationFn: () => editingId ? apiClient.putLegacy(`/api/appraisers/${editingId}`, { body: form }) : apiClient.postLegacy("/api/appraisers/", { body: form }),
		onSuccess: async () => {
			setOpen(false);
			setEditingId(void 0);
			setForm(empty);
			await invalidate();
		}
	});
	const openCreate = () => {
		setEditingId(void 0);
		setForm(empty);
		setOpen(true);
	};
	const openEdit = (appraiser) => {
		setEditingId(Number(val(appraiser, "id", "Id")));
		setForm({
			name: String(val(appraiser, "name", "Name") ?? ""),
			city: String(val(appraiser, "city", "City") ?? ""),
			legalForm: String(val(appraiser, "legalForm", "LegalForm") ?? "Individual"),
			contactEmail: String(val(appraiser, "contactEmail", "ContactEmail") ?? ""),
			contactPhone: String(val(appraiser, "contactPhone", "ContactPhone") ?? ""),
			notes: String(val(appraiser, "notes", "Notes") ?? ""),
			supportedPropertyTypes: String(val(appraiser, "supportedPropertyTypes", "SupportedPropertyTypes") ?? ""),
			supportedCities: String(val(appraiser, "supportedCities", "SupportedCities") ?? ""),
			clientScope: String(val(appraiser, "clientScope", "ClientScope") ?? "Sve")
		});
		setOpen(true);
	};
	const flag = useMutation({
		mutationFn: ({ id, suffix, value }) => apiClient.postLegacy(`/api/appraisers/${id}/${suffix}`, { body: { value } }),
		onSuccess: invalidate
	});
	const deactivate = useMutation({
		mutationFn: (id) => apiClient.deleteLegacy(`/api/appraisers/${id}`),
		onSuccess: invalidate
	});
	const importPreview = useMutation({ mutationFn: async () => {
		if (!importFile) throw new Error("Odaberite Excel datoteku.");
		const body = new FormData();
		body.append("file", importFile);
		const result = await apiClient.postLegacy("/api/codebooks/import-export/preview", {
			query: {
				codebookType: "vjestaci",
				mode: 0
			},
			body
		});
		setPreviewToken(String(val(result, "previewToken", "PreviewToken") ?? ""));
		return result;
	} });
	const confirmImport = useMutation({
		mutationFn: () => apiClient.postLegacy("/api/codebooks/import-export/confirm", { body: { previewToken } }),
		onSuccess: async () => {
			setImportOpen(false);
			setImportFile(void 0);
			setPreviewToken("");
			await invalidate();
		}
	});
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
					children: "Vještaci"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, {
					tone: "secondary",
					className: "mt-2",
					children: "Master podaci, dostupnost, opterećenje i blacklist status."
				})
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "secondary",
						onClick: () => setImportOpen(true),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, { className: "size-4" }), "Uvezi"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "secondary",
						onClick: () => downloadAuthenticatedFile("/api/codebooks/import-export/export?codebookType=vjestaci&format=xlsx&includeInactive=true", "vjestaci.xlsx"),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "size-4" }), "Izvezi"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "secondary",
						onClick: () => query.refetch(),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "size-4" }), "Osvježi"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						onClick: openCreate,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-4" }), "Novi vještak"]
					})
				]
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-6 grid gap-3 md:grid-cols-5",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					placeholder: "Pretraga po nazivu…",
					value: search,
					onChange: (e) => setSearch(e.target.value)
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					placeholder: "Grad",
					value: city,
					onChange: (e) => setCity(e.target.value)
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FilterSelect, {
					label: "Godišnji odmor",
					value: onLeave,
					onChange: setOnLeave
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FilterSelect, {
					label: "Crna lista",
					value: blacklisted,
					onChange: setBlacklisted
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FilterSelect, {
					label: "Aktivnost",
					value: active,
					onChange: setActive
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-6 overflow-x-auto rounded-sm border border-border-subtle bg-surface-default",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
				className: "w-full text-left text-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
					className: "bg-surface-subtle",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: [
						"Naziv",
						"Grad",
						"Tip",
						"Aktivne procjene",
						"GO",
						"Blacklist",
						"Aktivan",
						"Akcije"
					].map((h) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
						className: "px-4 py-3",
						children: h
					}, h)) })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", {
					className: "divide-y divide-border-subtle",
					children: query.data?.map((a, i) => {
						const id = Number(val(a, "id", "Id"));
						const leave = Boolean(val(a, "isOnLeave", "IsOnLeave"));
						const black = Boolean(val(a, "isBlacklisted", "IsBlacklisted"));
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
								className: "px-4 py-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: String(val(a, "name", "Name")) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-text-tertiary",
									children: String(val(a, "contactEmail", "ContactEmail") ?? "")
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-4 py-3",
								children: String(val(a, "city", "City") ?? "—")
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-4 py-3",
								children: String(val(a, "legalFormLabel", "LegalForm") ?? "—")
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-4 py-3",
								children: String(val(a, "activeAssignmentCount", "ActiveAssignmentCount") ?? 0)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-4 py-3",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									size: "icon",
									variant: "ghost",
									onClick: () => flag.mutate({
										id,
										suffix: "on-leave",
										value: !leave
									}),
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TreePalm, { className: `size-4 ${leave ? "text-feedback-warning" : "text-text-tertiary"}` })
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-4 py-3",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									size: "icon",
									variant: "ghost",
									onClick: () => flag.mutate({
										id,
										suffix: "blacklist",
										value: !black
									}),
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Ban, { className: `size-4 ${black ? "text-feedback-danger" : "text-text-tertiary"}` })
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-4 py-3",
								children: val(a, "isActive", "IsActive") ? "Da" : "Ne"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-4 py-3",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex gap-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										size: "icon",
										variant: "ghost",
										title: "Uredi",
										onClick: () => openEdit(a),
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, { className: "size-4" })
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										size: "sm",
										variant: "secondary",
										onClick: () => confirm("Deaktivirati vještaka?") && deactivate.mutate(id),
										children: "Deaktiviraj"
									})]
								})
							})
						] }, id || i);
					})
				})]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
			open,
			onOpenChange: (next) => {
				setOpen(next);
				if (!next) setEditingId(void 0);
			},
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
				className: "max-w-2xl",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: editingId ? "Uredi vještaka" : "Novi vještak" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, { children: "Podaci se koriste kod automatskog i ručnog odabira." })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					className: "grid gap-4 sm:grid-cols-2",
					onSubmit: (e) => {
						e.preventDefault();
						create.mutate();
					},
					children: [fields.map(([k, l]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "grid gap-1 text-sm font-semibold",
						children: [l, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							required: k === "name" || k === "legalForm",
							value: String(form[k] ?? ""),
							onChange: (e) => setForm({
								...form,
								[k]: e.target.value
							})
						})]
					}, k)), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						className: "sm:col-span-2",
						type: "submit",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BriefcaseBusiness, { className: "size-4" }), editingId ? "Sačuvaj izmjene" : "Sačuvaj vještaka"]
					})]
				})]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
			open: importOpen,
			onOpenChange: setImportOpen,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Uvoz vještaka" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, { children: "Prvo se radi validacijski pregled, a podaci se upisuju tek nakon potvrde." })] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					type: "file",
					accept: ".xlsx,.xls,.csv",
					onChange: (e) => setImportFile(e.target.files?.[0])
				}),
				!previewToken ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					onClick: () => importPreview.mutate(),
					disabled: !importFile || importPreview.isPending,
					children: "Pregledaj uvoz"
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-sm border border-feedback-success p-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm font-semibold",
						children: "Datoteka je validirana i spremna za upis."
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						className: "mt-3",
						onClick: () => confirmImport.mutate(),
						disabled: confirmImport.isPending,
						children: "Potvrdi uvoz"
					})]
				}),
				(importPreview.error || confirmImport.error) && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-feedback-danger",
					children: (importPreview.error ?? confirmImport.error)?.message
				})
			] })
		})
	] });
}
var fields = [
	["name", "Naziv"],
	["city", "Grad"],
	["legalForm", "Pravni oblik"],
	["contactEmail", "E-mail"],
	["contactPhone", "Telefon"],
	["supportedPropertyTypes", "Tipovi nekretnina"],
	["supportedCities", "Podržani gradovi"],
	["clientScope", "Opseg klijenata"],
	["notes", "Napomena"]
];
function FilterSelect({ label, value, onChange }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
		"aria-label": label,
		className: "h-10 rounded-sm border border-border-subtle bg-surface-default px-3 text-sm",
		value,
		onChange: (event) => onChange(event.target.value),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
				value: "all",
				children: [label, ": svi"]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
				value: "true",
				children: [label, ": da"]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
				value: "false",
				children: [label, ": ne"]
			})
		]
	});
}
var SplitComponent = AppraisersPage;
//#endregion
export { SplitComponent as component };
