import { r as apiClient } from "./http-client-CjYYYiH6.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/orders-api-BqpKvL3G.js
function record(value) {
	return typeof value === "object" && value !== null && !Array.isArray(value) ? value : void 0;
}
function unwrap(value) {
	return record(value)?.["data"] ?? value;
}
async function listOrders(search = "") {
	const payload = unwrap(await apiClient.getLegacy("/api/orders", { query: {
		Search: search || void 0,
		PageSize: 100
	} }));
	if (Array.isArray(payload)) return payload.filter((item) => Boolean(record(item)));
	const body = record(payload);
	const items = body?.["items"] ?? body?.["Items"];
	return Array.isArray(items) ? items.filter((item) => Boolean(record(item))) : [];
}
async function getOrder(id) {
	const result = record(unwrap(await apiClient.getLegacy(`/api/orders/${id}/detail`)));
	if (!result) throw new Error("API nije vratio detalje narudžbe.");
	return result;
}
var createOrder = (body) => apiClient.postLegacy("/api/orders", { body });
var updateOrder = (id, body) => apiClient.putLegacy(`/api/orders/${id}`, { body });
var submitOrder = (id) => apiClient.postLegacy(`/api/orders/${id}/submit`);
var cancelOrder = (id) => apiClient.deleteLegacy(`/api/orders/${id}`);
async function getOrderCollection(id, suffix) {
	const payload = unwrap(await apiClient.getLegacy(`/api/orders/${id}/${suffix}`));
	if (Array.isArray(payload)) return payload.filter((item) => Boolean(record(item)));
	const body = record(payload);
	const items = body?.["items"] ?? body?.["Items"] ?? body?.["documents"] ?? body?.["Documents"];
	return Array.isArray(items) ? items.filter((item) => Boolean(record(item))) : [];
}
var runOrderAction = (id, suffix, body) => apiClient.postLegacy(`/api/orders/${id}/${suffix}`, body === void 0 ? {} : { body });
function uploadOrderDocuments(orderId, documentTypeId, files) {
	const body = new FormData();
	Array.from(files).forEach((file) => body.append("files", file));
	return apiClient.postLegacy(`/api/orders/${orderId}/documents`, {
		query: { documentTypeId },
		body
	});
}
function replaceOrderDocument(documentId, file) {
	const body = new FormData();
	body.append("file", file);
	return apiClient.postLegacy(`/api/documents/${documentId}/versions`, { body });
}
var deactivateDocument = (id, reason) => apiClient.postLegacy(`/api/documents/${id}/deactivate`, { body: { reason } });
var reactivateDocument = (id) => apiClient.postLegacy(`/api/documents/${id}/reactivate`);
var deleteDocument = (id) => apiClient.deleteLegacy(`/api/documents/${id}`);
//#endregion
export { getOrder as a, reactivateDocument as c, submitOrder as d, updateOrder as f, deleteDocument as i, replaceOrderDocument as l, createOrder as n, getOrderCollection as o, uploadOrderDocuments as p, deactivateDocument as r, listOrders as s, cancelOrder as t, runOrderAction as u };
