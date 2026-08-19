import { a as __toESM } from "./rolldown-runtime-D7D4PA-g.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { p as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { r as apiClient } from "./http-client-DEtq0LLv.mjs";
import { N as Copy, c as Trash2, f as Send, g as Plus, m as RefreshCw, p as Search } from "../_libs/lucide-react.mjs";
import { t as Button } from "./button-BLuTS1CJ.mjs";
import { n as useProfile, t as profileList } from "./use-profile-DMp4VCaS.mjs";
import { t as useBusinessText } from "./use-business-text-CuxR3Fdh.mjs";
import { n as Text, t as Heading } from "./typography-DerBRbfa.mjs";
import { a as DialogTitle, i as DialogHeader, n as DialogContent, r as DialogDescription, t as Dialog } from "./dialog-BUF0JyRU.mjs";
import { t as Input } from "./input-TqSExkUa.mjs";
import { d as submitOrder, n as createOrder, s as listOrders, t as cancelOrder } from "./orders-api-DV1MIucB.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/app.orders-BBNQa_Yi.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var emptyOrder = {
	clientName: "",
	clientType: "FL",
	clientIdentifier: "",
	collateralTypeId: 1,
	combinedCollateralTypeId: null,
	city: "",
	propertyAddress: "",
	branch: "",
	branchAddress: "",
	contactName: "",
	contactPhone: "",
	contactEmail: "",
	internalNote: "",
	deliveryContactName: "",
	amRecipientName: ""
};
function OrdersPage() {
	const bt = useBusinessText();
	const navigate = useNavigate();
	const profile = useProfile();
	const permissions = profileList(profile.data, "permissions");
	const canCreate = permissions.includes("orders.create");
	const canSubmit = permissions.includes("orders.submit");
	const canCancel = permissions.includes("orders.cancel");
	const client = useQueryClient();
	const [search, setSearch] = (0, import_react.useState)("");
	const [statusFilter, setStatusFilter] = (0, import_react.useState)("");
	const [createOpen, setCreateOpen] = (0, import_react.useState)(false);
	const [detail, setDetail] = (0, import_react.useState)();
	const [form, setForm] = (0, import_react.useState)(emptyOrder);
	const orders = useQuery({
		queryKey: ["orders", search],
		queryFn: () => listOrders(search)
	});
	const collateralTypes = useQuery({
		queryKey: ["collateral-types"],
		queryFn: () => loadOptions("/api/codebooks/collateral-types")
	});
	const combinedTypes = useQuery({
		queryKey: ["combined-collateral-types"],
		queryFn: () => loadOptions("/api/codebooks/combined-collateral-types")
	});
	const cities = useQuery({
		queryKey: ["cities"],
		queryFn: () => loadOptions("/api/branches/cities", "name")
	});
	const branches = useQuery({
		queryKey: ["branches"],
		queryFn: () => loadOptions("/api/branches/", "code")
	});
	const selectedCityId = cities.data?.find((city) => city.value === form.city)?.id;
	const availableBranches = selectedCityId ? branches.data?.filter((branch) => branch.cityId === selectedCityId) : branches.data;
	const refresh = () => client.invalidateQueries({ queryKey: ["orders"] });
	const create = useMutation({
		mutationFn: createOrder,
		onSuccess: async () => {
			setCreateOpen(false);
			setForm(emptyOrder);
			await refresh();
			toast.success(bt("Nacrt narudžbe je kreiran.", "Order draft created."));
		},
		onError: (error) => toast.error(error.message)
	});
	const submit = useMutation({
		mutationFn: submitOrder,
		onSuccess: async () => {
			toast.success(bt("Narudžba je poslana.", "Order submitted."));
			await refresh();
		},
		onError: (error) => toast.error(error.message)
	});
	const cancel = useMutation({
		mutationFn: cancelOrder,
		onSuccess: async () => {
			toast.success(bt("Narudžba je otkazana.", "Order cancelled."));
			await refresh();
		},
		onError: (error) => toast.error(error.message)
	});
	const value = (row, ...keys) => keys.map((key) => row[key]).find((item) => item != null);
	const idOf = (row) => Number(value(row, "id", "Id"));
	const visibleOrders = orders.data?.filter((row) => !statusFilter || String(value(row, "status", "Status")) === statusFilter);
	const cloneOrder = (row) => {
		setForm({
			...emptyOrder,
			...Object.fromEntries(Object.keys(emptyOrder).map((key) => [key, value(row, key, key[0].toUpperCase() + key.slice(1)) ?? emptyOrder[key]])),
			clientType: String(value(row, "clientType", "ClientType") ?? "FL")
		});
		setCreateOpen(true);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "min-w-0",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-start justify-between gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-eyebrow text-text-tertiary",
						children: bt("Radni proces", "Workflow")
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heading, {
						level: 1,
						size: 4,
						className: "mt-2",
						children: bt("Narudžbe procjene", "Appraisal orders")
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, {
						tone: "secondary",
						className: "mt-2",
						children: bt("Kreiranje, pregled, slanje i upravljanje narudžbama procjene.", "Create, review, submit, and manage appraisal orders.")
					})
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "secondary",
						onClick: () => orders.refetch(),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "size-4" }), bt("Osvježi", "Refresh")]
					}), canCreate && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						onClick: () => setCreateOpen(true),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-4" }), bt("Nova narudžba", "New order")]
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6 flex max-w-3xl flex-wrap items-center gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "size-4 text-text-tertiary" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: search,
						onChange: (e) => setSearch(e.target.value),
						placeholder: bt("Broj, klijent, naslov ili grad…", "Number, client, title, or city…")
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
						className: "h-10 min-w-44 rounded-sm border border-border-subtle bg-surface-default px-3",
						value: statusFilter,
						onChange: (event) => setStatusFilter(event.target.value),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "",
							children: bt("Svi statusi", "All statuses")
						}), [...new Set(orders.data?.map((row) => String(value(row, "status", "Status"))) ?? [])].filter(Boolean).map((status) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: status }, status))]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6 overflow-x-auto rounded-sm border border-border-subtle bg-surface-default",
				children: [
					orders.isLoading && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "p-8 text-text-secondary",
						children: "Učitavanje narudžbi…"
					}),
					orders.isError && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "p-8 text-feedback-danger",
						children: orders.error.message
					}),
					orders.data && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
						className: "min-w-full text-left text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
							className: "bg-surface-subtle text-text-secondary",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: [
								bt("Broj", "Number"),
								bt("Klijent", "Client"),
								bt("Grad", "City"),
								bt("Status", "Status"),
								bt("Kreirano", "Created"),
								bt("Akcije", "Actions")
							].map((x) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-4 py-3",
								children: x
							}, x)) })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", {
							className: "divide-y divide-border-subtle",
							children: visibleOrders?.map((row, index) => {
								const status = String(value(row, "status", "Status") ?? "");
								const isDraft = status === "Draft" || status === "0";
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
									className: "hover:bg-surface-subtle",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "px-4 py-3 font-bold",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												onClick: () => setDetail(row),
												children: String(value(row, "orderNumber", "OrderNumber") ?? "—")
											})
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "px-4 py-3",
											children: String(value(row, "clientName", "ClientName") ?? "—")
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "px-4 py-3",
											children: String(value(row, "city", "City") ?? "—")
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "px-4 py-3",
											children: String(value(row, "simpleStatusLabel", "status", "Status") ?? "—")
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "px-4 py-3",
											children: formatDate(value(row, "createdAt", "CreatedAt"))
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "px-4 py-3",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center justify-end gap-1",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
														size: "sm",
														variant: "secondary",
														onClick: () => navigate({
															to: "/app/orders/$id",
															params: { id: String(idOf(row)) }
														}),
														children: bt("Detalji", "Details")
													}),
													canCreate && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
														size: "icon",
														variant: "ghost",
														title: bt("Kloniraj", "Clone"),
														"aria-label": bt("Kloniraj narudžbu", "Clone order"),
														onClick: () => cloneOrder(row),
														children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "size-4" })
													}),
													isDraft && canSubmit && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
														size: "icon",
														variant: "ghost",
														title: bt("Pošalji", "Submit"),
														"aria-label": bt("Pošalji narudžbu", "Submit order"),
														onClick: () => submit.mutate(idOf(row)),
														children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Send, { className: "size-4" })
													}),
													isDraft && canCancel && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
														size: "icon",
														variant: "ghost",
														title: bt("Otkaži", "Cancel"),
														"aria-label": bt("Otkaži narudžbu", "Cancel order"),
														onClick: () => confirm(bt("Otkazati narudžbu?", "Cancel this order?")) && cancel.mutate(idOf(row)),
														children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-4" })
													})
												]
											})
										})
									]
								}, idOf(row) || index);
							})
						})]
					}),
					!orders.isLoading && !orders.isError && visibleOrders?.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "p-8 text-center text-text-secondary",
						children: bt("Nema narudžbi za odabrane filtere.", "No orders match the selected filters.")
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: createOpen,
				onOpenChange: setCreateOpen,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
					className: "max-h-[90vh] max-w-3xl overflow-y-auto",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Nova narudžba" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, { children: "Unesite obavezne podatke. Narudžba se kreira kao nacrt." })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						className: "grid gap-4 sm:grid-cols-2",
						onSubmit: (e) => {
							e.preventDefault();
							create.mutate(form);
						},
						children: [
							fields.map(([key, label, type]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "grid gap-1 text-sm font-semibold",
								children: [label, key === "clientType" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
									className: "h-10 rounded-sm border border-border-subtle bg-surface-default px-3",
									value: String(form.clientType ?? "FL"),
									onChange: (event) => setForm({
										...form,
										clientType: event.target.value
									}),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "FL",
										children: "Fizičko lice"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "PL",
										children: "Pravno lice"
									})]
								}) : key === "collateralTypeId" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(OptionSelect, {
									required: true,
									options: collateralTypes.data,
									value: form.collateralTypeId,
									onChange: (value) => setForm({
										...form,
										collateralTypeId: Number(value)
									})
								}) : key === "combinedCollateralTypeId" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(OptionSelect, {
									options: combinedTypes.data,
									value: form.combinedCollateralTypeId ?? "",
									onChange: (value) => setForm({
										...form,
										combinedCollateralTypeId: value ? Number(value) : null
									})
								}) : key === "city" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(OptionSelect, {
									required: true,
									options: cities.data,
									value: form.city,
									onChange: (value) => setForm({
										...form,
										city: value,
										branch: "",
										branchAddress: ""
									})
								}) : key === "branch" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(OptionSelect, {
									required: true,
									options: availableBranches,
									value: form.branch,
									onChange: (value) => {
										const selected = branches.data?.find((branch) => branch.value === value);
										setForm({
											...form,
											branch: value,
											branchAddress: selected?.address ?? ""
										});
									}
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									required: required.has(key),
									type,
									value: String(form[key] ?? ""),
									onChange: (e) => setForm({
										...form,
										[key]: type === "number" ? Number(e.target.value) : e.target.value
									})
								})]
							}, key)),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "sm:col-span-2 flex justify-end gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									type: "button",
									variant: "secondary",
									onClick: () => setCreateOpen(false),
									children: "Odustani"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									type: "submit",
									disabled: create.isPending,
									children: "Kreiraj nacrt"
								})]
							}),
							create.error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "sm:col-span-2 text-feedback-danger",
								children: create.error.message
							})
						]
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: Boolean(detail),
				onOpenChange: (open) => !open && setDetail(void 0),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
					className: "max-h-[85vh] max-w-2xl overflow-y-auto",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Detalji narudžbe" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, { children: "Kompletan odgovor postojećeg API-ja." })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dl", {
						className: "grid gap-3 sm:grid-cols-2",
						children: detail && Object.entries(detail).filter(([, v]) => v == null || [
							"string",
							"number",
							"boolean"
						].includes(typeof v)).map(([k, v]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "border-b border-border-subtle pb-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
								className: "text-xs font-bold uppercase text-text-tertiary",
								children: humanize(k)
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
								className: "mt-1 break-words text-sm",
								children: String(v ?? "—")
							})]
						}, k))
					})]
				})
			})
		]
	});
}
var fields = [
	[
		"clientName",
		"Naziv klijenta",
		"text"
	],
	[
		"clientType",
		"Tip klijenta (FL/PL)",
		"text"
	],
	[
		"clientIdentifier",
		"JMBG/ID broj",
		"text"
	],
	[
		"collateralTypeId",
		"Tip kolaterala ID",
		"number"
	],
	[
		"combinedCollateralTypeId",
		"Kombinovani tip kolaterala",
		"number"
	],
	[
		"city",
		"Grad",
		"text"
	],
	[
		"propertyAddress",
		"Adresa nekretnine",
		"text"
	],
	[
		"branch",
		"Poslovnica",
		"text"
	],
	[
		"branchAddress",
		"Adresa poslovnice",
		"text"
	],
	[
		"contactName",
		"Kontakt osoba",
		"text"
	],
	[
		"contactPhone",
		"Telefon",
		"tel"
	],
	[
		"contactEmail",
		"E-mail",
		"email"
	],
	[
		"deliveryContactName",
		"Osoba za dostavu",
		"text"
	],
	[
		"amRecipientName",
		"Account manager",
		"text"
	],
	[
		"internalNote",
		"Interna napomena",
		"text"
	]
];
var required = /* @__PURE__ */ new Set([
	"clientName",
	"collateralTypeId",
	"city",
	"branch",
	"contactName",
	"contactPhone",
	"deliveryContactName",
	"amRecipientName"
]);
var humanize = (v) => v.replace(/([a-z])([A-Z])/g, "$1 $2").replace(/^./, (x) => x.toUpperCase());
var formatDate = (v) => v ? new Intl.DateTimeFormat("bs-BA").format(new Date(String(v))) : "—";
async function loadOptions(path, valueField) {
	const raw = await apiClient.getLegacy(path);
	const root = raw["data"] ?? raw;
	const source = Array.isArray(root) ? root : root?.["items"] ?? root?.["Items"];
	if (!Array.isArray(source)) return [];
	return source.map((item) => {
		const row = item;
		const id = (valueField === "name" ? row["name"] ?? row["Name"] : valueField === "code" ? row["code"] ?? row["Code"] : void 0) ?? row["id"] ?? row["Id"] ?? row["code"] ?? row["Code"] ?? row["name"] ?? row["Name"];
		const labelValue = row["label"] ?? row["Label"] ?? row["name"] ?? row["Name"] ?? row["city"] ?? row["City"] ?? id;
		return {
			value: String(id ?? ""),
			label: String(labelValue ?? ""),
			id: Number(row["id"] ?? row["Id"]) || void 0,
			cityId: Number(row["cityId"] ?? row["CityId"]) || void 0,
			address: String(row["address"] ?? row["Address"] ?? "") || void 0
		};
	});
}
function OptionSelect({ options, value, onChange, required = false }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
		required,
		className: "h-10 rounded-sm border border-border-subtle bg-surface-default px-3",
		value: String(value),
		onChange: (event) => onChange(event.target.value),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
			value: "",
			children: "Odaberite…"
		}), options?.map((option) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
			value: option.value,
			children: option.label
		}, option.value))]
	});
}
var SplitComponent = OrdersPage;
//#endregion
export { SplitComponent as component };
