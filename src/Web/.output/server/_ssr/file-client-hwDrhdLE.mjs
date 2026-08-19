import { i as getAccessToken } from "./router-Co5KCLsv.mjs";
import { n as apiBaseUrl } from "./http-client-DEtq0LLv.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/file-client-hwDrhdLE.js
async function downloadAuthenticatedFile(path, fallbackName) {
	const accessToken = await getAccessToken();
	const response = await fetch(`${apiBaseUrl}${path}`, { headers: accessToken ? { authorization: `Bearer ${accessToken}` } : void 0 });
	if (!response.ok) throw new Error(`Preuzimanje nije uspjelo (${response.status}).`);
	const disposition = response.headers.get("content-disposition") ?? "";
	const match = /filename\*?=(?:UTF-8''|")?([^";]+)/i.exec(disposition);
	const name = match ? decodeURIComponent(match[1].replaceAll("\"", "")) : fallbackName;
	const url = URL.createObjectURL(await response.blob());
	const anchor = document.createElement("a");
	anchor.href = url;
	anchor.download = name;
	anchor.click();
	URL.revokeObjectURL(url);
}
//#endregion
export { downloadAuthenticatedFile as t };
