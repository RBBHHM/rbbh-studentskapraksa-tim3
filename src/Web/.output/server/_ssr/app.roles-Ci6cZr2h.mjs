import { a as __toESM } from "./rolldown-runtime-D7D4PA-g.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { r as apiClient } from "./http-client-CjYYYiH6.mjs";
import { M as Download, _ as Pencil, c as Trash2, g as Plus, h as Power, m as RefreshCw, t as X, w as KeyRound } from "../_libs/lucide-react.mjs";
import { t as Button } from "./button-2bc_dve7.mjs";
import { n as Text, t as Heading } from "./typography-48X1uu2Z.mjs";
import { a as DialogTitle, i as DialogHeader, n as DialogContent, r as DialogDescription, t as Dialog } from "./dialog-DZAL9gfI.mjs";
import { t as Input } from "./input-CMFRGsxE.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/app.roles-Ci6cZr2h.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var pick = (r, ...k) => k.map((x) => r[x]).find((v) => v != null);
var rows = (raw) => {
	const root = raw?.["data"] ?? raw;
	const value = Array.isArray(root) ? root : root?.["items"] ?? root?.["Items"];
	return Array.isArray(value) ? value : [];
};
function RolesPage() {
	const cache = useQueryClient();
	const [open, setOpen] = (0, import_react.useState)(false);
	const [editingId, setEditingId] = (0, import_react.useState)();
	const [role, setRole] = (0, import_react.useState)({
		name: "",
		displayName: "",
		description: ""
	});
	const [permissionRole, setPermissionRole] = (0, import_react.useState)();
	const [permissionId, setPermissionId] = (0, import_react.useState)("");
	const query = useQuery({
		queryKey: ["role-definitions"],
		queryFn: async () => rows(await apiClient.getLegacy("/api/admin/roles/"))
	});
	const permissions = useQuery({
		queryKey: ["permissions"],
		queryFn: async () => rows(await apiClient.getLegacy("/api/admin/permissions/"))
	});
	const roleDetail = useQuery({
		queryKey: ["role-definition", pick(permissionRole ?? {}, "id", "Id")],
		queryFn: () => apiClient.getLegacy(`/api/admin/roles/${Number(pick(permissionRole ?? {}, "id", "Id"))}`),
		enabled: Boolean(permissionRole)
	});
	const refresh = () => cache.invalidateQueries({ queryKey: ["role-definitions"] });
	const action = useMutation({
		mutationFn: ({ method, url, body }) => method === "delete" ? apiClient.deleteLegacy(url) : method === "put" ? apiClient.putLegacy(url, { body }) : apiClient.postLegacy(url, body ? { body } : {}),
		onSuccess: async () => {
			setOpen(false);
			setEditingId(void 0);
			setPermissionRole(void 0);
			await refresh();
		}
	});
	const openCreate = () => {
		setEditingId(void 0);
		setRole({
			name: "",
			displayName: "",
			description: ""
		});
		setOpen(true);
	};
	const openEdit = (item) => {
		setEditingId(Number(pick(item, "id", "Id")));
		setRole({
			name: String(pick(item, "name", "Name") ?? ""),
			displayName: String(pick(item, "displayName", "DisplayName") ?? ""),
			description: String(pick(item, "description", "Description") ?? "")
		});
		setOpen(true);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-start justify-between",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-eyebrow text-text-tertiary",
					children: "Administracija"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heading, {
					level: 1,
					size: 4,
					className: "mt-2",
					children: "Role i permissioni"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, {
					tone: "secondary",
					className: "mt-2",
					children: "Definicije poslovnih uloga sinhronizovane s Keycloak realmom."
				})
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "secondary",
						onClick: () => exportRoles(query.data ?? []),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "size-4" }), "Export CSV"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "secondary",
						onClick: () => query.refetch(),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "size-4" }), "Osvježi"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						onClick: openCreate,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-4" }), "Nova rola"]
					})
				]
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-6 rounded-sm border border-border-subtle bg-surface-default p-5",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-bold",
					children: "Centralni katalog permissiona"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-sm text-text-secondary",
					children: "Sve dozvole koje se mogu dodijeliti poslovnim rolama, grupisane prema backend modulu."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-4 flex flex-wrap gap-2",
					children: permissions.data?.map((permission, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "rounded-full border border-border-subtle bg-surface-subtle px-3 py-1 text-xs",
						title: String(pick(permission, "description", "Description") ?? ""),
						children: [
							String(pick(permission, "module", "Module") ?? "Opšte"),
							" ·",
							" ",
							String(pick(permission, "displayName", "DisplayName", "name", "Name", "code", "Code"))
						]
					}, index))
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-7 overflow-x-auto rounded-sm border border-border-subtle bg-surface-default",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
				className: "w-full text-left text-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
					className: "bg-surface-subtle",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: [
						"Naziv",
						"Prikazni naziv",
						"Opis",
						"Tip",
						"Status",
						"Akcije"
					].map((h) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
						className: "px-4 py-3",
						children: h
					}, h)) })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", {
					className: "divide-y divide-border-subtle",
					children: query.data?.map((r, i) => {
						const id = Number(pick(r, "id", "Id"));
						const active = pick(r, "isActive", "IsActive") !== false;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-4 py-3 font-bold",
								children: String(pick(r, "name", "Name"))
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-4 py-3",
								children: String(pick(r, "displayName", "DisplayName") ?? "—")
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-4 py-3",
								children: String(pick(r, "description", "Description") ?? "—")
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-4 py-3",
								children: pick(r, "isSystem", "IsSystem") ? "Sistemska" : "Custom"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-4 py-3",
								children: active ? "Aktivna" : "Neaktivna"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-4 py-3",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex gap-1",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											size: "icon",
											variant: "ghost",
											title: "Uredi",
											onClick: () => openEdit(r),
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, { className: "size-4" })
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											size: "icon",
											variant: "ghost",
											title: "Dodaj permission",
											onClick: () => setPermissionRole(r),
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(KeyRound, { className: "size-4" })
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											size: "icon",
											variant: "ghost",
											title: active ? "Deaktiviraj" : "Aktiviraj",
											onClick: () => action.mutate({
												method: "post",
												url: `/api/admin/roles/${id}/${active ? "deactivate" : "activate"}`
											}),
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Power, { className: "size-4" })
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											size: "icon",
											variant: "ghost",
											title: "Obriši",
											onClick: () => confirm("Obrisati custom rolu?") && action.mutate({
												method: "delete",
												url: `/api/admin/roles/${id}`
											}),
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-4" })
										})
									]
								})
							})
						] }, id || i);
					})
				})]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
			open,
			onOpenChange: setOpen,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: editingId ? "Uredi poslovnu rolu" : "Nova poslovna rola" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, { children: "Rola će biti kreirana u aplikaciji i sinhronizovana u Keycloak." })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				className: "grid gap-3",
				onSubmit: (e) => {
					e.preventDefault();
					action.mutate({
						method: editingId ? "put" : "post",
						url: editingId ? `/api/admin/roles/${editingId}` : "/api/admin/roles/",
						body: editingId ? {
							displayName: role.displayName,
							description: role.description
						} : role
					});
				},
				children: [Object.entries(role).map(([k, v]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "grid gap-1 text-sm font-bold",
					children: [k, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						required: k !== "description",
						disabled: Boolean(editingId) && k === "name",
						value: v,
						onChange: (e) => setRole({
							...role,
							[k]: e.target.value
						})
					})]
				}, k)), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "submit",
					children: "Kreiraj rolu"
				})]
			})] })
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
			open: Boolean(permissionRole),
			onOpenChange: (o) => !o && setPermissionRole(void 0),
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Dodaj permission" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, { children: "Odaberite permission iz centralnog kataloga." })] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
					className: "h-11 rounded-sm border border-border-subtle bg-surface-default px-3",
					value: permissionId,
					onChange: (e) => setPermissionId(e.target.value),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: "",
						children: "Odaberite…"
					}), permissions.data?.map((p, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: String(pick(p, "id", "Id")),
						children: String(pick(p, "displayName", "DisplayName", "name", "Name", "code", "Code"))
					}, i))]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					disabled: !permissionId,
					onClick: () => permissionRole && action.mutate({
						method: "post",
						url: `/api/admin/roles/${Number(pick(permissionRole, "id", "Id"))}/permissions`,
						body: { permissionDefinitionId: Number(permissionId) }
					}),
					children: "Dodaj permission"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "divide-y divide-border-subtle rounded-sm border border-border-subtle",
					children: assignedPermissions(roleDetail.data).map((permission, index) => {
						const permissionIdValue = Number(pick(permission, "id", "Id", "permissionDefinitionId"));
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between gap-3 p-3 text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: String(pick(permission, "displayName", "DisplayName", "name", "Name", "code", "Code") ?? permissionIdValue) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "icon",
								variant: "ghost",
								title: "Ukloni permission",
								onClick: () => action.mutate({
									method: "delete",
									url: `/api/admin/roles/${Number(pick(permissionRole ?? {}, "id", "Id"))}/permissions/${permissionIdValue}`
								}),
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-4" })
							})]
						}, permissionIdValue || index);
					})
				})
			] })
		})
	] });
}
function assignedPermissions(detail) {
	if (!detail) return [];
	const root = detail["data"] ?? detail;
	const value = root["permissions"] ?? root["Permissions"];
	return Array.isArray(value) ? value : [];
}
function exportRoles(roles) {
	const csv = [[
		"Naziv",
		"Prikazni naziv",
		"Opis",
		"Tip",
		"Status",
		"Broj permissiona"
	], ...roles.map((role) => [
		pick(role, "name", "Name"),
		pick(role, "displayName", "DisplayName"),
		pick(role, "description", "Description"),
		pick(role, "isSystem", "IsSystem") ? "Sistemska" : "Custom",
		pick(role, "isActive", "IsActive") !== false ? "Aktivna" : "Neaktivna",
		pick(role, "permissionCount", "PermissionCount") ?? 0
	])].map((row) => row.map((value) => `"${String(value ?? "").replaceAll("\"", "\"\"")}"`).join(",")).join("\r\n");
	const url = URL.createObjectURL(new Blob(["﻿", csv], { type: "text/csv;charset=utf-8" }));
	const anchor = document.createElement("a");
	anchor.href = url;
	anchor.download = "role.csv";
	anchor.click();
	URL.revokeObjectURL(url);
}
var SplitComponent = RolesPage;
//#endregion
export { SplitComponent as component };
