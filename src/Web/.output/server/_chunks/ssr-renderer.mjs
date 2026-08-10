import { n as HTTPError, o as toRequest } from "../_libs/h3+rou3+srvx.mjs";
//#region node_modules/.pnpm/nitro@3.0.260603-beta_chokidar@5.0.0_jiti@2.7.0_lru-cache@11.5.2_vite@8.2.1_@types+node@22.20_gns6xzsy42jaik3fhspvgswu7e/node_modules/nitro/dist/runtime/vite.mjs
function fetchViteEnv(viteEnvName, input, init) {
	const viteEnv = (globalThis.__nitro_vite_envs__ || {})[viteEnvName];
	if (!viteEnv) throw HTTPError.status(404);
	return Promise.resolve(viteEnv.fetch(toRequest(input, init)));
}
//#endregion
//#region node_modules/.pnpm/nitro@3.0.260603-beta_chokidar@5.0.0_jiti@2.7.0_lru-cache@11.5.2_vite@8.2.1_@types+node@22.20_gns6xzsy42jaik3fhspvgswu7e/node_modules/nitro/dist/runtime/internal/vite/ssr-renderer.mjs
/** @param {{ req: Request }} HTTPEvent */
function ssrRenderer({ req }) {
	return fetchViteEnv("ssr", req);
}
//#endregion
export { ssrRenderer as default };
