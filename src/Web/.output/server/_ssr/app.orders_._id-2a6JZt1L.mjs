import { a as __toESM } from "./rolldown-runtime-D7D4PA-g.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { t as Route } from "./router-4YZAYmU6.mjs";
import { r as apiClient } from "./http-client-CjYYYiH6.mjs";
import { B as Check, D as FileUp, M as Download, O as FileText, _ as Pencil, c as Trash2, f as Send, h as Power, k as FilePlusCorner, m as RefreshCw, q as ArrowLeft } from "../_libs/lucide-react.mjs";
import { t as Button } from "./button-2bc_dve7.mjs";
import { n as useProfile, t as profileList } from "./use-profile-DGTdcA9L.mjs";
import { n as Text, t as Heading } from "./typography-48X1uu2Z.mjs";
import { a as DialogTitle, i as DialogHeader, n as DialogContent, r as DialogDescription, t as Dialog } from "./dialog-DZAL9gfI.mjs";
import { t as Input } from "./input-CMFRGsxE.mjs";
import { t as downloadAuthenticatedFile } from "./file-client-CZFc4nmz.mjs";
import { a as getOrder, c as reactivateDocument, f as updateOrder, i as deleteDocument, l as replaceOrderDocument, o as getOrderCollection, p as uploadOrderDocuments, r as deactivateDocument, u as runOrderAction } from "./orders-api-BqpKvL3G.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/app.orders_._id-2a6JZt1L.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var pick$1 = (r, ...keys) => keys.map((k) => r[k]).find((v) => v != null);
function OrderDocumentsPanel({ orderId, canGenerate = false }) {
	const cache = useQueryClient();
	const [typeId, setTypeId] = (0, import_react.useState)(1);
	const query = useQuery({
		queryKey: [
			"orders",
			orderId,
			"documents"
		],
		queryFn: () => getOrderCollection(orderId, "documents")
	});
	const documentTypes = useQuery({
		queryKey: [
			"codebook",
			"tipovi_dokumenata",
			"active"
		],
		queryFn: async () => {
			const raw = await apiClient.getLegacy("/api/codebooks/tipovi_dokumenata/values/active");
			const root = raw?.["data"] ?? raw;
			return Array.isArray(root) ? root : [];
		}
	});
	const refresh = () => cache.invalidateQueries({ queryKey: [
		"orders",
		orderId,
		"documents"
	] });
	const upload = useMutation({
		mutationFn: (files) => uploadOrderDocuments(orderId, typeId, files),
		onSuccess: refresh
	});
	const action = useMutation({
		mutationFn: ({ kind, id }) => kind === "delete" ? deleteDocument(id) : kind === "activate" ? reactivateDocument(id) : deactivateDocument(id, prompt("Razlog deaktivacije:") ?? ""),
		onSuccess: refresh
	});
	const replace = useMutation({
		mutationFn: ({ id, file }) => replaceOrderDocument(id, file),
		onSuccess: refresh
	});
	const generate = useMutation({
		mutationFn: () => apiClient.postLegacy(`/api/orders/${orderId}/documents/generate`, { body: {
			iznos: null,
			zkOznaka: null
		} }),
		onSuccess: refresh
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-sm border border-border-subtle bg-surface-default p-5 xl:col-span-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-bold",
				children: "Dokumenti narudžbe"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 flex flex-wrap items-end gap-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "grid gap-1 text-xs font-bold",
						children: ["Tip dokumenta", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
							className: "h-10 min-w-56 rounded-sm border border-border-subtle bg-surface-default px-3 text-sm",
							value: typeId,
							onChange: (event) => setTypeId(Number(event.target.value)),
							children: documentTypes.data?.map((type, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: Number(pick$1(type, "id", "Id")),
								children: String(pick$1(type, "label", "Label", "code", "Code"))
							}, index))
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "inline-flex h-10 cursor-pointer items-center gap-2 rounded-sm bg-surface-brand px-4 text-sm font-bold text-text-on-brand",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileUp, { className: "size-4" }),
							"Dodaj PDF",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								className: "sr-only",
								type: "file",
								accept: "application/pdf",
								multiple: true,
								onChange: (e) => e.target.files?.length && upload.mutate(e.target.files)
							})
						]
					}),
					canGenerate && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "secondary",
						disabled: generate.isPending,
						onClick: () => generate.mutate(),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FilePlusCorner, { className: "size-4" }), "Generiši dokumente"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "ghost",
						onClick: () => query.refetch(),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "size-4" }), "Osvježi"]
					})
				]
			}),
			upload.error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-feedback-danger",
				children: upload.error.message
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-5 overflow-x-auto",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
					className: "w-full text-left text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: [
						"Naziv",
						"Tip",
						"Verzija",
						"Aktivan",
						"Akcije"
					].map((x) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
						className: "border-b border-border-subtle p-3",
						children: x
					}, x)) }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: query.data?.map((d, i) => {
						const id = Number(pick$1(d, "id", "Id"));
						const active = Boolean(pick$1(d, "isActive", "IsActive"));
						const name = String(pick$1(d, "fileName", "FileName", "name", "Name") ?? `dokument-${id}`);
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "p-3 font-semibold",
								children: name
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "p-3",
								children: String(pick$1(d, "documentTypeLabel", "DocumentTypeLabel", "documentType", "DocumentType") ?? "—")
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "p-3",
								children: String(pick$1(d, "version", "Version") ?? "—")
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "p-3",
								children: active ? "Da" : "Ne"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "p-3",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex gap-1",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											size: "icon",
											variant: "ghost",
											title: "Preuzmi",
											onClick: () => downloadAuthenticatedFile(`/api/documents/${id}/download`, name),
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "size-4" })
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
											className: "inline-flex size-10 cursor-pointer items-center justify-center rounded-sm hover:bg-surface-subtle",
											title: "Nova verzija",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileUp, { className: "size-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												className: "sr-only",
												type: "file",
												accept: "application/pdf",
												onChange: (event) => {
													const file = event.target.files?.[0];
													if (file) replace.mutate({
														id,
														file
													});
												}
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											size: "icon",
											variant: "ghost",
											title: active ? "Deaktiviraj" : "Aktiviraj",
											onClick: () => action.mutate({
												kind: active ? "deactivate" : "activate",
												id
											}),
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Power, { className: "size-4" })
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											size: "icon",
											variant: "ghost",
											title: "Obriši",
											onClick: () => confirm("Obrisati dokument?") && action.mutate({
												kind: "delete",
												id
											}),
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-4" })
										})
									]
								})
							})
						] }, id || i);
					}) })]
				})
			})
		]
	});
}
var keys = [
	["clientName", "Naziv klijenta"],
	["clientType", "Tip klijenta"],
	["clientIdentifier", "JMBG/ID"],
	["collateralTypeId", "Tip kolaterala ID"],
	["combinedCollateralTypeId", "Kombinovani tip ID"],
	["city", "Grad"],
	["propertyAddress", "Adresa nekretnine"],
	["branch", "Poslovnica"],
	["branchAddress", "Adresa poslovnice"],
	["contactName", "Kontakt osoba"],
	["contactPhone", "Telefon"],
	["contactEmail", "E-mail"],
	["deliveryContactName", "Osoba za dostavu"],
	["amRecipientName", "Account manager"],
	["internalNote", "Interna napomena"]
];
var source = (r, k) => r[k] ?? r[k[0].toUpperCase() + k.slice(1)];
function initial(r) {
	return {
		clientName: String(source(r, "clientName") ?? ""),
		clientType: String(source(r, "clientType") ?? "FL"),
		clientIdentifier: String(source(r, "clientIdentifier") ?? ""),
		collateralTypeId: Number(source(r, "collateralTypeId") ?? 1),
		combinedCollateralTypeId: source(r, "combinedCollateralTypeId") == null ? null : Number(source(r, "combinedCollateralTypeId")),
		city: String(source(r, "city") ?? ""),
		propertyAddress: String(source(r, "propertyAddress") ?? ""),
		branch: String(source(r, "branch") ?? ""),
		branchAddress: String(source(r, "branchAddress") ?? ""),
		contactName: String(source(r, "contactName") ?? ""),
		contactPhone: String(source(r, "contactPhone") ?? ""),
		contactEmail: String(source(r, "contactEmail") ?? ""),
		internalNote: String(source(r, "internalNote") ?? ""),
		deliveryContactName: String(source(r, "deliveryContactName") ?? ""),
		amRecipientName: String(source(r, "amRecipientName") ?? "")
	};
}
function OrderEditDialog({ id, order, open, onOpenChange }) {
	const cache = useQueryClient();
	const seed = (0, import_react.useMemo)(() => initial(order), [order]);
	const [form, setForm] = (0, import_react.useState)(seed);
	const [dirty, setDirty] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		setForm(seed);
		setDirty(false);
	}, [seed]);
	const save = useMutation({
		mutationFn: () => updateOrder(id, form),
		onSuccess: async () => {
			setDirty(false);
			await cache.invalidateQueries({ queryKey: ["orders", id] });
		}
	});
	const saveRef = (0, import_react.useRef)(save.mutate);
	saveRef.current = save.mutate;
	(0, import_react.useEffect)(() => {
		if (!open || !dirty) return;
		const timer = setTimeout(() => saveRef.current(), 1500);
		return () => clearTimeout(timer);
	}, [
		form,
		dirty,
		open
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open,
		onOpenChange,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
			className: "max-h-[90vh] max-w-3xl overflow-y-auto",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Uredi nacrt narudžbe" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, { children: "Promjene se automatski čuvaju nakon kratke pauze. Backend dozvoljava izmjene samo dok je narudžba nacrt." })] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid gap-4 sm:grid-cols-2",
					children: keys.map(([k, l]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "grid gap-1 text-sm font-bold",
						children: [l, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							type: k.toLowerCase().includes("id") ? "number" : "text",
							value: String(form[k] ?? ""),
							onChange: (e) => {
								const numeric = k.toLowerCase().includes("id");
								setForm({
									...form,
									[k]: numeric ? e.target.value ? Number(e.target.value) : null : e.target.value
								});
								setDirty(true);
							}
						})]
					}, k))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-sm text-text-secondary",
						children: save.isPending ? "Čuvanje…" : save.isSuccess && !dirty ? "Sve promjene su sačuvane" : dirty ? "Nesačuvane promjene" : ""
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "secondary",
							onClick: () => onOpenChange(false),
							children: "Zatvori"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							onClick: () => save.mutate(),
							disabled: save.isPending || !dirty,
							children: "Sačuvaj sada"
						})]
					})]
				}),
				save.error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-feedback-danger",
					children: save.error.message
				})
			]
		})
	});
}
function OpinionUpload({ orderId, permissions }) {
	const cache = useQueryClient();
	const allowedTypes = [permissions.includes("opinions.submit-co") && {
		value: "CO",
		label: "Kolateral oficir"
	}, permissions.includes("opinions.submit-legal") && {
		value: "Pravna",
		label: "Pravna služba"
	}].filter(Boolean);
	const [type, setType] = (0, import_react.useState)(allowedTypes[0]?.value ?? "CO");
	const [comment, setComment] = (0, import_react.useState)("");
	const upload = useMutation({
		mutationFn: (file) => {
			const body = new FormData();
			body.append("file", file);
			body.append("comment", comment);
			return apiClient.postLegacy(`/api/orders/${orderId}/opinions/${type}`, { body });
		},
		onSuccess: () => cache.invalidateQueries({ queryKey: [
			"orders",
			orderId,
			"opinions"
		] })
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-sm border border-border-subtle bg-surface-default p-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-bold",
				children: "Dodaj mišljenje"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
				className: "mt-4 h-10 w-full rounded-sm border border-border-subtle bg-surface-default px-3",
				value: type,
				onChange: (e) => setType(e.target.value),
				children: allowedTypes.map((option) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
					value: option.value,
					children: option.label
				}, option.value))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
				className: "mt-3",
				placeholder: "Komentar (opcionalno)",
				value: comment,
				onChange: (e) => setComment(e.target.value)
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "mt-3 inline-flex h-10 cursor-pointer items-center gap-2 rounded-sm bg-surface-brand px-4 text-sm font-bold text-text-on-brand",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileUp, { className: "size-4" }),
					"Odaberi PDF",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						className: "sr-only",
						type: "file",
						accept: "application/pdf",
						onChange: (e) => {
							const f = e.target.files?.[0];
							if (f) upload.mutate(f);
						}
					})
				]
			}),
			upload.error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm text-feedback-danger",
				children: upload.error.message
			})
		]
	});
}
var pick = (row, ...keys) => keys.map((key) => row[key]).find((value) => value != null);
function OrderQuotesPanel({ orderId }) {
	const cache = useQueryClient();
	const [respondingId, setRespondingId] = (0, import_react.useState)();
	const [offeredPrice, setOfferedPrice] = (0, import_react.useState)("");
	const [offeredDays, setOfferedDays] = (0, import_react.useState)("");
	const query = useQuery({
		queryKey: [
			"orders",
			orderId,
			"quotes"
		],
		queryFn: () => getOrderCollection(orderId, "quote-requests")
	});
	const refresh = () => cache.invalidateQueries({ queryKey: [
		"orders",
		orderId,
		"quotes"
	] });
	const respond = useMutation({
		mutationFn: (quoteId) => apiClient.postLegacy(`/api/orders/${orderId}/quote-requests/${quoteId}/respond`, { body: {
			offeredPrice: Number(offeredPrice),
			offeredDays: Number(offeredDays)
		} }),
		onSuccess: async () => {
			setRespondingId(void 0);
			setOfferedPrice("");
			setOfferedDays("");
			await refresh();
		}
	});
	const accept = useMutation({
		mutationFn: (quoteId) => apiClient.postLegacy(`/api/orders/${orderId}/quote-requests/${quoteId}/accept`),
		onSuccess: refresh
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-sm border border-border-subtle bg-surface-default p-5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
			className: "font-bold",
			children: "Ponude vještaka"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-4 divide-y divide-border-subtle",
			children: [query.data?.map((quote, index) => {
				const id = Number(pick(quote, "id", "Id"));
				const status = String(pick(quote, "status", "Status") ?? "—");
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "py-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-center justify-between gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-semibold",
							children: String(pick(quote, "appraiserName", "AppraiserName") ?? `Ponuda #${id}`)
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-xs text-text-secondary",
							children: [
								status,
								" · ",
								String(pick(quote, "offeredPrice", "OfferedPrice") ?? "—"),
								" KM ·",
								" ",
								String(pick(quote, "offeredDays", "OfferedDays") ?? "—"),
								" dana"
							]
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex gap-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								size: "sm",
								variant: "secondary",
								onClick: () => setRespondingId(id),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Send, { className: "size-4" }), "Odgovori"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								size: "sm",
								disabled: status.toLowerCase() !== "responded" || accept.isPending,
								onClick: () => accept.mutate(id),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "size-4" }), "Prihvati"]
							})]
						})]
					}), respondingId === id && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						className: "mt-3 grid gap-2 sm:grid-cols-[1fr_1fr_auto]",
						onSubmit: (event) => {
							event.preventDefault();
							respond.mutate(id);
						},
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								required: true,
								min: "0",
								step: "0.01",
								type: "number",
								placeholder: "Cijena (KM)",
								value: offeredPrice,
								onChange: (event) => setOfferedPrice(event.target.value)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								required: true,
								min: "1",
								type: "number",
								placeholder: "Broj dana",
								value: offeredDays,
								onChange: (event) => setOfferedDays(event.target.value)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "submit",
								disabled: respond.isPending,
								children: "Pošalji"
							})
						]
					})]
				}, id || index);
			}), !query.isLoading && !query.data?.length && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "py-4 text-sm text-text-secondary",
				children: "Nema zahtjeva za ponudu."
			})]
		})]
	});
}
var actions = [
	{
		suffix: "submit",
		label: "Pošalji CA-u",
		capability: "canSubmit"
	},
	{
		suffix: "select-appraiser/auto",
		label: "Automatski odaberi vještaka",
		capability: "canSelectAppraiser"
	},
	{
		suffix: "select-appraiser/manual",
		label: "Ručno odaberi vještaka",
		capability: "canSelectAppraiser",
		fields: [{
			key: "appraiserId",
			label: "ID vještaka",
			type: "number",
			required: true
		}]
	},
	{
		suffix: "send-to-appraiser",
		label: "Pošalji vještaku",
		capability: "canSendToAppraiser"
	},
	{
		suffix: "accept-by-appraiser",
		label: "Prihvati kao vještak",
		roleStatus: "appraiser-accept"
	},
	{
		suffix: "reject-by-appraiser",
		label: "Odbij kao vještak",
		danger: true,
		roleStatus: "appraiser-accept",
		fields: [{
			key: "reason",
			label: "Šifra razloga odbijanja",
			type: "number",
			required: true
		}, {
			key: "comment",
			label: "Komentar"
		}]
	},
	{
		suffix: "request-additional-payment",
		label: "Traži dodatnu uplatu",
		capability: "canRequestAdditionalPayment",
		fields: void 0
	},
	{
		suffix: "confirm-additional-payment",
		label: "Potvrdi dodatnu uplatu",
		capability: "canCompleteAdditionalPayment"
	},
	{
		suffix: "submit-appraisal",
		label: "Predaj procjenu",
		roleStatus: "appraiser-work",
		fields: [{
			key: "visitDate",
			label: "Datum posjete",
			type: "datetime-local"
		}]
	},
	{
		suffix: "request-correction",
		label: "Traži korekciju",
		capability: "canRequestCorrection",
		fields: [{
			key: "reasonCodeId",
			label: "Šifra razloga",
			type: "number",
			required: true
		}, {
			key: "comment",
			label: "Komentar"
		}]
	},
	{
		suffix: "submit-correction",
		label: "Predaj korekciju",
		capability: "canSubmitCorrection",
		fields: [{
			key: "comment",
			label: "Komentar"
		}]
	},
	{
		suffix: "complete-review",
		label: "Završi pregled dokumentacije",
		capability: "canCompleteReview"
	},
	{
		suffix: "access-check/approve",
		label: "Potvrdi uredan pristup",
		capability: "canAccessCheck",
		fields: [{
			key: "comment",
			label: "Komentar"
		}]
	},
	{
		suffix: "access-check/reject",
		label: "Traži dopunu pristupa",
		danger: true,
		capability: "canAccessCheck",
		fields: [{
			key: "comment",
			label: "Obrazloženje",
			required: true
		}]
	},
	{
		suffix: "approve-final",
		label: "Odobri finalnu procjenu",
		capability: "canApproveFinal",
		fields: [{
			key: "appraiserRating",
			label: "Ocjena vještaka (1–5)",
			type: "number"
		}]
	},
	{
		suffix: "return-for-rework",
		label: "Vrati na doradu",
		danger: true,
		capability: "canReturnForRework",
		fields: [{
			key: "category",
			label: "Kategorija",
			required: true
		}, {
			key: "comment",
			label: "Komentar",
			required: true
		}]
	},
	{
		suffix: "sign-consent",
		label: "Potpiši saglasnost",
		capability: "canSignConsent"
	},
	{
		suffix: "confirm-original",
		label: "Potvrdi original",
		capability: "canConfirmOriginal"
	},
	{
		suffix: "deliver-original",
		label: "Evidentiraj dostavu originala",
		roleStatus: "appraiser-original"
	},
	{
		suffix: "complete-signed-docs",
		label: "Završi potpisanu dokumentaciju",
		roleStatus: "appraiser-work"
	},
	{
		suffix: "remind-appraiser",
		label: "Pošalji podsjetnik vještaku",
		capability: "canRemindAppraiser"
	},
	{
		suffix: "quote-requests",
		label: "Pošalji zahtjeve za ponudu",
		capability: "canSendQuoteRequests",
		fields: [{
			key: "appraiserIds",
			label: "ID-evi vještaka (odvojeni zarezom)",
			type: "number-list",
			required: true
		}, {
			key: "deadline",
			label: "Rok za ponudu",
			type: "datetime-local",
			required: true
		}]
	},
	{
		suffix: "quote-requests/thank-you",
		label: "Pošalji zahvalnice",
		capability: "canSendThankYou"
	},
	{
		suffix: "invoice/upload",
		label: "Poveži fakturu",
		capability: "canUploadInvoice",
		fields: [{
			key: "documentId",
			label: "ID uploadovanog dokumenta",
			type: "number",
			required: true
		}]
	},
	{
		suffix: "invoice/send-for-payment",
		label: "Pošalji fakturu na plaćanje",
		capability: "canSendInvoiceForPayment"
	},
	{
		suffix: "invoice/confirm-paid",
		label: "Potvrdi plaćanje fakture",
		capability: "canConfirmInvoicePaid"
	},
	{
		suffix: "opinions/request",
		label: "Zatraži mišljenja CO i Pravne",
		permission: "opinions.request"
	},
	{
		suffix: "reject-order",
		label: "Odbij narudžbu",
		danger: true,
		fields: [{
			key: "reason",
			label: "Razlog",
			required: true
		}, {
			key: "comment",
			label: "Komentar"
		}]
	}
];
function OrderDetailPage({ id }) {
	const cache = useQueryClient();
	const [chosen, setChosen] = (0, import_react.useState)();
	const [payload, setPayload] = (0, import_react.useState)({});
	const [editOpen, setEditOpen] = (0, import_react.useState)(false);
	const profile = useProfile();
	const detail = useQuery({
		queryKey: ["orders", id],
		queryFn: () => getOrder(id)
	});
	const opinions = useQuery({
		queryKey: [
			"orders",
			id,
			"opinions"
		],
		queryFn: () => getOrderCollection(id, "opinions")
	});
	const candidates = useQuery({
		queryKey: [
			"orders",
			id,
			"appraiser-candidates"
		],
		queryFn: () => getOrderCollection(id, "appraiser-candidates"),
		enabled: capabilityRecord(detail.data)["canSelectAppraiser"] === true
	});
	const appraisalStatus = useQuery({
		queryKey: [
			"orders",
			id,
			"appraisal-status"
		],
		queryFn: () => apiClient.getLegacy(`/api/orders/${id}/appraisal-status`)
	});
	const invoiceStatus = useQuery({
		queryKey: [
			"orders",
			id,
			"invoice-status"
		],
		queryFn: () => apiClient.getLegacy(`/api/orders/${id}/invoice/status`),
		enabled: permissionsForProfile(profile.data).includes("invoice.view")
	});
	const appraiserPackage = useQuery({
		queryKey: [
			"orders",
			id,
			"appraiser-package"
		],
		queryFn: () => apiClient.getLegacy(`/api/orders/${id}/appraiser-package`),
		enabled: false
	});
	const mutation = useMutation({
		mutationFn: ({ suffix, body }) => runOrderAction(id, suffix, body),
		onSuccess: async () => {
			setChosen(void 0);
			setPayload({});
			await cache.invalidateQueries({ queryKey: ["orders"] });
		}
	});
	const execute = (action) => action.fields?.length ? setChosen(action) : confirm(`Izvršiti akciju „${action.label}”?`) && mutation.mutate({ suffix: action.suffix });
	const capabilities = capabilityRecord(detail.data);
	const roles = profileList(profile.data, "roles").map((role) => role.toLocaleLowerCase("bs"));
	const permissions = profileList(profile.data, "permissions");
	const status = label(detail.data, "status", "Status");
	const visibleActions = actions.filter((action) => isActionVisible(action, capabilities, roles, permissions, status) && (action.suffix !== "opinions/request" || opinions.data?.length === 0));
	const downloadFinal = async () => {
		const raw = await apiClient.getLegacy(`/api/orders/${id}/final-appraisal`);
		const item = raw["data"] ?? raw;
		await downloadAuthenticatedFile(String(item["downloadUrl"] ?? item["DownloadUrl"]), String(item["originalFileName"] ?? item["OriginalFileName"] ?? `procjena-${id}.pdf`));
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
			href: "/app/orders",
			className: "inline-flex items-center gap-2 text-sm font-semibold text-text-secondary",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "size-4" }), "Nazad na narudžbe"]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-5 flex flex-wrap items-start justify-between gap-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-eyebrow text-text-tertiary",
					children: ["Narudžba #", id]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heading, {
					level: 1,
					size: 4,
					className: "mt-2",
					children: label(detail.data, "title", "Title", "orderNumber", "OrderNumber")
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Text, {
					tone: "secondary",
					className: "mt-2",
					children: [
						label(detail.data, "clientName", "ClientName"),
						" ·",
						" ",
						label(detail.data, "statusLabel", "StatusLabel", "status", "Status")
					]
				})
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex gap-2",
				children: [
					capabilities["canEdit"] === true && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "secondary",
						onClick: () => setEditOpen(true),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, { className: "size-4" }), "Uredi nacrt"]
					}),
					capabilities["canDownloadFinal"] === true && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "secondary",
						onClick: downloadFinal,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "size-4" }), "Finalna procjena"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "secondary",
						onClick: () => detail.refetch(),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "size-4" }), "Osvježi"]
					})
				]
			})]
		}),
		detail.isError && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-6 p-4 text-feedback-danger",
			children: detail.error.message
		}),
		detail.data && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-7 grid gap-3 sm:grid-cols-2 xl:grid-cols-4",
			children: primitive(detail.data).map(([k, v]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-sm border border-border-subtle bg-surface-default p-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs font-bold uppercase text-text-tertiary",
					children: humanize(k)
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 break-words text-sm font-semibold",
					children: String(v ?? "—")
				})]
			}, k))
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-8",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heading, {
					level: 2,
					size: 2,
					children: "Workflow akcije"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-4 flex flex-wrap gap-2",
					children: visibleActions.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: a.danger ? "destructive" : "secondary",
						onClick: () => execute(a),
						disabled: mutation.isPending,
						children: a.label
					}, a.suffix))
				}),
				mutation.error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 text-feedback-danger",
					children: mutation.error.message
				})
			]
		})] }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-8 grid gap-5 xl:grid-cols-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusPanel, {
					title: "Status izrade procjene",
					data: appraisalStatus.data
				}),
				invoiceStatus.isSuccess && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusPanel, {
					title: "Status fakture",
					data: invoiceStatus.data
				}),
				hasAppraiser(detail.data) && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppraiserPackagePanel, {
					data: appraiserPackage.data,
					loading: appraiserPackage.isFetching,
					onLoad: () => appraiserPackage.refetch()
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(OrderDocumentsPanel, {
					orderId: id,
					canGenerate: capabilities["canGenerateDocuments"] === true
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(OrderQuotesPanel, { orderId: id }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Related, {
					title: "Mišljenja",
					rows: opinions.data
				}),
				Boolean(opinions.data?.length) && permissions.some((permission) => permission === "opinions.submit-co" || permission === "opinions.submit-legal") && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(OpinionUpload, {
					orderId: id,
					permissions
				})
			]
		}),
		detail.data && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(OrderEditDialog, {
			id,
			order: detail.data,
			open: editOpen,
			onOpenChange: setEditOpen
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
			open: Boolean(chosen),
			onOpenChange: (open) => !open && setChosen(void 0),
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: chosen?.label }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, { children: "Unesite podatke potrebne za nastavak workflowa." })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				className: "grid gap-4",
				onSubmit: (e) => {
					e.preventDefault();
					if (chosen) mutation.mutate({
						suffix: chosen.suffix,
						body: payload
					});
				},
				children: [chosen?.fields?.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "grid gap-1 text-sm font-semibold",
					children: [f.label, f.key === "appraiserId" || f.key === "appraiserIds" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
						className: "h-10 w-full rounded-sm border border-border-subtle bg-surface-default px-3",
						required: f.required,
						multiple: f.key === "appraiserIds",
						onChange: (event) => {
							const selected = Array.from(event.target.selectedOptions).map((option) => Number(option.value));
							setPayload({
								...payload,
								[f.key]: f.key === "appraiserIds" ? selected : selected[0]
							});
						},
						children: [f.key === "appraiserId" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "",
							children: "Odaberite vještaka"
						}), candidates.data?.map((candidate, index) => {
							const candidateId = label(candidate, "id", "Id", "appraiserId", "AppraiserId");
							const candidateName = label(candidate, "name", "Name", "appraiserName", "AppraiserName");
							const city = label(candidate, "city", "City");
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
								value: candidateId,
								children: [
									candidateName,
									" · ",
									city
								]
							}, `${candidateId}-${index}`);
						})]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						required: f.required,
						type: f.type ?? "text",
						onChange: (e) => setPayload({
							...payload,
							[f.key]: f.type === "number" ? Number(e.target.value) : f.type === "number-list" ? e.target.value.split(",").map(Number).filter(Number.isFinite) : e.target.value
						})
					})]
				}, f.key)), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "submit",
					children: "Potvrdi akciju"
				})]
			})] })
		})
	] });
}
function Related({ title, rows }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-sm border border-border-subtle bg-surface-default p-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "size-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-bold",
					children: title
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-4 text-sm text-text-secondary",
				children: rows ? `${rows.length} zapisa` : "Učitavanje…"
			}),
			rows?.slice(0, 5).map((r, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-3 border-t border-border-subtle pt-3 text-xs",
				children: primitive(r).slice(0, 3).map(([k, v]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("b", { children: [humanize(k), ":"] }),
					" ",
					String(v ?? "—")
				] }, k))
			}, i))
		]
	});
}
function StatusPanel({ title, data }) {
	const root = data?.["data"] ?? data;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-sm border border-border-subtle bg-surface-default p-5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
			className: "font-bold",
			children: title
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-3 grid gap-2 text-xs",
			children: root ? primitive(root).map(([key, value]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("b", { children: [humanize(key), ":"] }),
				" ",
				String(value ?? "—")
			] }, key)) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-text-secondary",
				children: "Učitavanje…"
			})
		})]
	});
}
function AppraiserPackagePanel({ data, loading, onLoad }) {
	const root = data?.["data"] ?? data;
	const documents = root?.["documents"] ?? root?.["Documents"];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-sm border border-border-subtle bg-surface-default p-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-bold",
					children: "Paket za vještaka"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					size: "sm",
					variant: "secondary",
					onClick: onLoad,
					disabled: loading,
					children: data ? "Ažuriraj" : "Prikaži"
				})]
			}),
			documents?.map((document, index) => {
				const url = label(document, "downloadUrl", "DownloadUrl");
				const name = label(document, "displayName", "DisplayName", "originalFileName", "OriginalFileName");
				return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "mt-3 block text-left text-sm font-semibold text-text-link hover:underline",
					onClick: () => downloadAuthenticatedFile(url, name),
					children: name
				}, index);
			}),
			data && !documents?.length && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 text-sm text-text-secondary",
				children: "Nema dokumenata."
			})
		]
	});
}
var primitive = (r) => Object.entries(r).filter(([, v]) => v == null || [
	"string",
	"number",
	"boolean"
].includes(typeof v));
var humanize = (v) => v.replace(/([a-z])([A-Z])/g, "$1 $2").replaceAll("_", " ").replace(/^./, (x) => x.toUpperCase());
var label = (r, ...keys) => String(keys.map((k) => r?.[k]).find((v) => v != null) ?? "—");
function capabilityRecord(order) {
	if (!order) return {};
	const value = order["capabilities"] ?? order["Capabilities"];
	return typeof value === "object" && value !== null ? value : {};
}
var permissionsForProfile = (profile) => profileList(profile, "permissions");
var hasAppraiser = (order) => Boolean(order?.["appraiserId"] ?? order?.["AppraiserId"]);
function isActionVisible(action, capabilities, roles, permissions, status) {
	if (action.suffix === "reject-order") return capabilities["canRejectOrder"] === true || capabilities["canAdminRejectOrder"] === true;
	if (action.capability) return capabilities[action.capability] === true;
	if (action.permission) return permissions.includes(action.permission);
	if (!action.roleStatus) return true;
	if (!roles.some((role) => role.includes("vjestak") || role.includes("vještak"))) return false;
	if (action.roleStatus === "appraiser-accept") return status === "OrderSentToAppraiser";
	if (action.roleStatus === "appraiser-original") return status === "ReadyForProcedure" || status === "COApproved";
	return [
		"OrderSentToAppraiser",
		"AppraisalInProgress",
		"AdditionalPaymentCompleted",
		"AppraisalReturnedForRework"
	].includes(status);
}
function OrderRoute() {
	const { id } = Route.useParams();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(OrderDetailPage, { id: Number(id) });
}
//#endregion
export { OrderRoute as component };
