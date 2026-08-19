import { n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { r as apiClient } from "./http-client-DEtq0LLv.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/use-profile-DMp4VCaS.js
function useProfile() {
	return useQuery({
		queryKey: ["me"],
		queryFn: async () => {
			const raw = await apiClient.getLegacy("/api/me");
			return raw?.["data"] ?? raw;
		},
		staleTime: 6e4
	});
}
function profileList(profile, key) {
	const value = profile?.[key] ?? profile?.[key[0].toUpperCase() + key.slice(1)];
	return Array.isArray(value) ? value.map(String) : [];
}
//#endregion
export { useProfile as n, profileList as t };
