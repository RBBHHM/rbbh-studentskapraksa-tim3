import { a as __toESM } from "./rolldown-runtime-D7D4PA-g.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { r as apiClient } from "./http-client-DEtq0LLv.mjs";
import { K as ArrowRightLeft, M as Download, a as UserCheck, g as Plus, m as RefreshCw, r as UserX, u as ShieldMinus } from "../_libs/lucide-react.mjs";
import { t as Button } from "./button-BLuTS1CJ.mjs";
import { t as useBusinessText } from "./use-business-text-CuxR3Fdh.mjs";
import { n as Text, t as Heading } from "./typography-DerBRbfa.mjs";
import { a as DialogTitle, i as DialogHeader, n as DialogContent, r as DialogDescription, t as Dialog } from "./dialog-BUF0JyRU.mjs";
import { t as Input } from "./input-TqSExkUa.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/app.users-B729LPgC.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var pick = (u, ...k) => k.map((x) => u[x]).find((v) => v != null);
async function load(search) {
	const raw = await apiClient.getLegacy("/api/users", { query: {
		Search: search || void 0,
		Page: 1,
		PageSize: 100
	} });
	const root = raw?.["data"] ?? raw;
	const items = Array.isArray(root) ? root : root?.["items"] ?? root?.["Items"];
	return Array.isArray(items) ? items : [];
}
function UsersPage() {
	const bt = useBusinessText();
	const cache = useQueryClient();
	const [search, setSearch] = (0, import_react.useState)("");
	const [roleUser, setRoleUser] = (0, import_react.useState)();
	const [role, setRole] = (0, import_react.useState)("");
	const [transferSource, setTransferSource] = (0, import_react.useState)();
	const [transferTargetId, setTransferTargetId] = (0, import_react.useState)("");
	const [transferReason, setTransferReason] = (0, import_react.useState)("");
	const query = useQuery({
		queryKey: ["users", search],
		queryFn: () => load(search)
	});
	const roleDefinitions = useQuery({
		queryKey: ["role-definitions", "active"],
		queryFn: async () => {
			const raw = await apiClient.getLegacy("/api/admin/roles/", { query: {
				IsActive: true,
				PageSize: 100
			} });
			const root = raw?.["data"] ?? raw;
			const items = Array.isArray(root) ? root : root?.["items"];
			return Array.isArray(items) ? items : [];
		}
	});
	const refresh = () => cache.invalidateQueries({ queryKey: ["users"] });
	const status = useMutation({
		mutationFn: ({ id, suspend }) => apiClient.postLegacy(`/api/users/${id}/${suspend ? "suspend" : "reactivate"}`, suspend ? { body: { reason: prompt("Razlog suspenzije:") ?? "" } } : {}),
		onSuccess: async () => {
			toast.success(bt("Status korisnika je ažuriran.", "User status updated."));
			await refresh();
		},
		onError: (error) => toast.error(error.message)
	});
	const roleMutation = useMutation({
		mutationFn: ({ id, remove }) => apiClient.postLegacy(`/api/roles/${remove ? "remove" : "assign"}`, { body: {
			userId: id,
			roleName: role
		} }),
		onSuccess: async () => {
			setRoleUser(void 0);
			setRole("");
			await refresh();
			toast.success(bt("Uloga je ažurirana.", "Role assignment updated."));
		},
		onError: (error) => toast.error(error.message)
	});
	const transfer = useMutation({
		mutationFn: () => apiClient.postLegacy("/api/roles/transfer-admin", { body: {
			sourceUserId: String(pick(transferSource ?? {}, "id", "Id", "userId", "UserId")),
			targetUserId: transferTargetId,
			reason: transferReason
		} }),
		onSuccess: async () => {
			setTransferSource(void 0);
			setTransferTargetId("");
			setTransferReason("");
			await refresh();
			toast.success(bt("Administratorska uloga je prenesena.", "Administrator role transferred."));
		},
		onError: (error) => toast.error(error.message)
	});
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
							children: bt("Administracija", "Administration")
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heading, {
							level: 1,
							size: 4,
							className: "mt-2",
							children: bt("Korisnici i pristupi", "Users and access")
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, {
							tone: "secondary",
							className: "mt-2",
							children: bt("Keycloak korisnici, status naloga i poslovne uloge.", "Keycloak users, account status, and business roles.")
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "secondary",
						onClick: () => exportUsers(query.data ?? []),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "size-4" }), bt("Izvezi CSV", "Export CSV")]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "secondary",
						onClick: () => query.refetch(),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "size-4" }), bt("Osvježi", "Refresh")]
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
				className: "mt-6 max-w-md",
				value: search,
				onChange: (e) => setSearch(e.target.value),
				placeholder: bt("Korisničko ime, ime ili e-mail…", "Username, name, or email…")
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6 max-w-full overflow-x-auto rounded-sm border border-border-subtle bg-surface-default",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
						className: "min-w-full text-left text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
							className: "bg-surface-subtle",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: [
								bt("Korisnik", "User"),
								bt("E-mail", "Email"),
								bt("Uloge", "Roles"),
								bt("Status", "Status"),
								bt("Akcije", "Actions")
							].map((x) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-4 py-3",
								children: x
							}, x)) })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", {
							className: "divide-y divide-border-subtle",
							children: query.data?.map((u, i) => {
								const id = String(pick(u, "id", "Id", "userId", "UserId"));
								const active = pick(u, "isActive", "IsActive", "enabled", "Enabled") !== false;
								const roles = pick(u, "roles", "Roles");
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
										className: "px-4 py-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: String(pick(u, "displayName", "DisplayName", "username", "Username") ?? "—") }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-xs text-text-tertiary",
											children: String(pick(u, "username", "Username") ?? "")
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-4 py-3",
										children: String(pick(u, "email", "Email") ?? "—")
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-4 py-3",
										children: Array.isArray(roles) ? roles.join(", ") : String(roles ?? "—")
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-4 py-3",
										children: active ? "Aktivan" : "Suspendovan"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-4 py-3",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center justify-end gap-1",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
													size: "icon",
													variant: "ghost",
													title: active ? "Suspenduj" : "Reaktiviraj",
													onClick: () => status.mutate({
														id,
														suspend: active
													}),
													children: active ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserX, { className: "size-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserCheck, { className: "size-4" })
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
													size: "icon",
													variant: "ghost",
													title: "Dodijeli rolu",
													onClick: () => setRoleUser(u),
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-4" })
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
													size: "icon",
													variant: "ghost",
													title: "Ukloni rolu",
													onClick: () => {
														setRoleUser(u);
														setRole(Array.isArray(roles) ? String(roles[0] ?? "") : "");
													},
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldMinus, { className: "size-4" })
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
													size: "icon",
													variant: "ghost",
													title: "Prenesi administratorsku ulogu",
													onClick: () => setTransferSource(u),
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRightLeft, { className: "size-4" })
												})
											]
										})
									})
								] }, id || i);
							})
						})]
					}),
					query.isLoading && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "p-8 text-center text-text-secondary",
						children: bt("Učitavanje korisnika…", "Loading users…")
					}),
					query.isError && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "p-8 text-center text-feedback-danger",
						children: query.error.message
					}),
					!query.isLoading && !query.isError && !query.data?.length && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "p-8 text-center text-text-secondary",
						children: bt("Nema korisnika za prikaz.", "No users to display.")
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: Boolean(roleUser),
				onOpenChange: (o) => !o && setRoleUser(void 0),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: bt("Upravljanje ulogom", "Manage role") }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, { children: "Dodjela i uklanjanje se provjeravaju na backendu i evidentiraju u auditu." })] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "grid gap-1 text-sm font-bold",
						children: [
							"Naziv role",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								list: "role-definitions",
								value: role,
								onChange: (e) => setRole(e.target.value),
								placeholder: "npr. KolateralAdministrator"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("datalist", {
								id: "role-definitions",
								children: roleDefinitions.data?.map((item, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { value: String(pick(item, "name", "Name") ?? "") }, index))
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex justify-end gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "destructive",
							disabled: !role,
							onClick: () => roleUser && roleMutation.mutate({
								id: String(pick(roleUser, "id", "Id", "userId", "UserId")),
								remove: true
							}),
							children: "Ukloni"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							disabled: !role,
							onClick: () => roleUser && roleMutation.mutate({
								id: String(pick(roleUser, "id", "Id", "userId", "UserId")),
								remove: false
							}),
							children: "Dodijeli"
						})]
					})
				] })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: Boolean(transferSource),
				onOpenChange: (next) => !next && setTransferSource(void 0),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Prijenos administratorske uloge" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, { children: "Backend prvo dodjeljuje administratorsku ulogu ciljnom korisniku, a tek zatim je uklanja izvornom korisniku." })] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "grid gap-1 text-sm font-bold",
						children: ["Ciljni korisnik", /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
							className: "h-11 rounded-sm border border-border-subtle bg-surface-default px-3",
							value: transferTargetId,
							onChange: (event) => setTransferTargetId(event.target.value),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "",
								children: "Odaberite korisnika…"
							}), query.data?.filter((item) => String(pick(item, "id", "Id", "userId", "UserId")) !== String(pick(transferSource ?? {}, "id", "Id", "userId", "UserId"))).map((item, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: String(pick(item, "id", "Id", "userId", "UserId")),
								children: String(pick(item, "displayName", "DisplayName", "username", "Username"))
							}, index))]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "grid gap-1 text-sm font-bold",
						children: ["Razlog", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: transferReason,
							onChange: (event) => setTransferReason(event.target.value)
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						disabled: !transferTargetId || !transferReason || transfer.isPending,
						onClick: () => transfer.mutate(),
						children: "Potvrdi prijenos"
					})
				] })
			})
		]
	});
}
function exportUsers(users) {
	downloadCsv("korisnici.csv", [[
		"Korisničko ime",
		"Prikazno ime",
		"E-mail",
		"Role",
		"Status"
	], ...users.map((user) => {
		const roles = pick(user, "roles", "Roles");
		return [
			pick(user, "username", "Username"),
			pick(user, "displayName", "DisplayName"),
			pick(user, "email", "Email"),
			Array.isArray(roles) ? roles.join("; ") : roles,
			pick(user, "isActive", "IsActive", "enabled", "Enabled") !== false ? "Aktivan" : "Suspendovan"
		];
	})]);
}
function downloadCsv(name, rows) {
	const csv = rows.map((row) => row.map((value) => `"${String(value ?? "").replaceAll("\"", "\"\"")}"`).join(",")).join("\r\n");
	const url = URL.createObjectURL(new Blob(["﻿", csv], { type: "text/csv;charset=utf-8" }));
	const anchor = document.createElement("a");
	anchor.href = url;
	anchor.download = name;
	anchor.click();
	URL.revokeObjectURL(url);
}
var SplitComponent = UsersPage;
//#endregion
export { SplitComponent as component };
