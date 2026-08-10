import { i as getAccessToken } from "./router-4YZAYmU6.mjs";
import { n as clsx } from "../_libs/class-variance-authority+clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/http-client-CjYYYiH6.js
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
var STORAGE_KEY = "rbi.active-role";
function getActiveRole() {
	if (typeof window === "undefined") return void 0;
	return window.sessionStorage.getItem(STORAGE_KEY) || void 0;
}
function setActiveRole(role) {
	if (typeof window !== "undefined") window.sessionStorage.setItem(STORAGE_KEY, role);
}
function clearActiveRole() {
	if (typeof window !== "undefined") window.sessionStorage.removeItem(STORAGE_KEY);
}
var ApiError = class extends Error {
	status;
	code;
	traceId;
	details;
	constructor(status, failure, traceId) {
		super(failure.message);
		this.name = "ApiError";
		this.status = status;
		this.code = failure.code;
		this.traceId = traceId;
		this.details = failure.details;
	}
};
var apiBaseUrl = {
	"BASE_URL": "/",
	"DEV": false,
	"MODE": "production",
	"PROD": true,
	"SSR": true,
	"TSS_DEV_SERVER": "false",
	"TSS_DEV_SSR_STYLES_BASEPATH": "/",
	"TSS_DEV_SSR_STYLES_ENABLED": "true",
	"TSS_DISABLE_CSRF_MIDDLEWARE_WARNING": "false",
	"TSS_INLINE_CSS_ENABLED": "false",
	"TSS_ROUTER_BASEPATH": "",
	"TSS_SERVER_FN_BASE": "/_serverFn/"
}["VITE_API_BASE_URL"]?.replace(/\/$/, "") ?? "";
var REQUEST_TIMEOUT_MS = 15e3;
function buildUrl(path, query) {
	const params = new URLSearchParams();
	for (const [key, value] of Object.entries(query ?? {})) {
		if (value === void 0 || value === null || value === "") continue;
		params.set(key, String(value));
	}
	const search = params.toString();
	return `${apiBaseUrl}${path}${search ? `?${search}` : ""}`;
}
function isEnvelope(body) {
	if (!body || typeof body !== "object") return false;
	const value = body;
	return typeof value.success === "boolean" && typeof value.traceId === "string";
}
function createApiClient() {
	async function request(method, path, options = {}, envelopeRequired = true) {
		const controller = new AbortController();
		const abort = () => controller.abort(options.signal?.reason);
		const timeout = setTimeout(() => controller.abort(/* @__PURE__ */ new Error("Request timed out")), options.timeoutMs ?? REQUEST_TIMEOUT_MS);
		options.signal?.addEventListener("abort", abort, { once: true });
		const isFormData = options.body instanceof FormData;
		const headers = {
			accept: "application/json",
			...options.headers
		};
		headers["authorization"] = `Bearer ${await getAccessToken()}`;
		const activeRole = getActiveRole();
		if (activeRole) headers["X-Active-Role"] = activeRole;
		if (options.body !== void 0 && !isFormData) headers["content-type"] = "application/json";
		try {
			const requestBody = options.body === void 0 ? void 0 : isFormData ? options.body : JSON.stringify(options.body);
			const init = {
				method,
				credentials: "include",
				headers,
				signal: controller.signal
			};
			if (requestBody !== void 0) init.body = requestBody;
			const response = await fetch(buildUrl(path, options.query), init);
			const body = response.status === 204 ? null : await response.json().catch(() => null);
			if (!envelopeRequired) {
				if (!response.ok) throw new ApiError(response.status, {
					code: "legacy_request_failed",
					message: "The legacy service request failed."
				}, response.headers.get("x-correlation-id") ?? "unknown");
				return body;
			}
			if (!isEnvelope(body)) throw new ApiError(response.status, {
				code: "invalid_response",
				message: "The server returned an invalid response."
			}, response.headers.get("x-correlation-id") ?? "unknown");
			if (!response.ok || !body.success || body.data === null) throw new ApiError(response.status, body.error ?? {
				code: "request_failed",
				message: "The request could not be completed."
			}, body.traceId);
			return body.data;
		} finally {
			clearTimeout(timeout);
			options.signal?.removeEventListener("abort", abort);
		}
	}
	return {
		get: (path, options) => request("GET", path, options),
		getLegacy: (path, options) => request("GET", path, options, false),
		postLegacy: (path, options) => request("POST", path, options, false),
		putLegacy: (path, options) => request("PUT", path, options, false),
		deleteLegacy: (path, options) => request("DELETE", path, options, false),
		post: (path, options) => request("POST", path, options),
		put: (path, options) => request("PUT", path, options),
		patch: (path, options) => request("PATCH", path, options),
		delete: (path, options) => request("DELETE", path, options)
	};
}
var apiClient = createApiClient();
//#endregion
export { cn as a, clearActiveRole as i, apiBaseUrl as n, getActiveRole as o, apiClient as r, setActiveRole as s, ApiError as t };
