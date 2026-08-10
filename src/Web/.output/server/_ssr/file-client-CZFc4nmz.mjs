import { i as getAccessToken } from "./router-4YZAYmU6.mjs";
import { n as apiBaseUrl } from "./http-client-CjYYYiH6.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/file-client-CZFc4nmz.js
async function downloadAuthenticatedFile(path, fallbackName) {
	const response = await fetch(`${apiBaseUrl}${path}`, { headers: { authorization: `Bearer ${await getAccessToken()}` } });
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
