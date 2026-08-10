import { n as useTranslation } from "../_libs/react-i18next.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/use-business-text-CuxR3Fdh.js
/**
* Small typed helper for feature copy that is still co-located with a screen.
* Shared shell copy remains in versioned localization bundles; feature copy can
* use this helper without duplicating API/domain terminology in global files.
*/
function useBusinessText() {
	const { i18n } = useTranslation();
	const isBosnian = i18n.resolvedLanguage?.toLowerCase().startsWith("bs") ?? true;
	return (bosnian, english) => isBosnian ? bosnian : english;
}
//#endregion
export { useBusinessText as t };
