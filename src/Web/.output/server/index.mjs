globalThis.__nitro_main__ = import.meta.url;
import { n as serve, t as NodeResponse } from "./_libs/srvx.mjs";
import { a as toEventHandler, i as defineLazyEventHandler, n as HTTPError, r as defineHandler, t as H3Core } from "./_libs/h3+rou3+srvx.mjs";
import { i as withoutTrailingSlash, n as joinURL, r as withLeadingSlash, t as decodePath } from "./_libs/ufo.mjs";
import { promises } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
//#region #nitro-vite-setup
function lazyService(loader) {
	let promise, mod;
	return { fetch(req) {
		if (mod) return mod.fetch(req);
		if (!promise) promise = loader().then((_mod) => mod = _mod.default || _mod);
		return promise.then((mod) => mod.fetch(req));
	} };
}
var services = { ["ssr"]: lazyService(() => import("./_ssr/ssr.mjs")) };
globalThis.__nitro_vite_envs__ = services;
//#endregion
//#region node_modules/.pnpm/nitro@3.0.260603-beta_chokidar@5.0.0_jiti@2.7.0_lru-cache@11.5.2_vite@8.2.1_@types+node@22.20_gns6xzsy42jaik3fhspvgswu7e/node_modules/nitro/dist/runtime/internal/route-rules.mjs
var headers = ((m) => function headersRouteRule(event) {
	for (const [key, value] of Object.entries(m.options || {})) event.res.headers.set(key, value);
});
//#endregion
//#region #nitro/virtual/public-assets-data
var public_assets_data_default = {
	"/favicon.png": {
		"type": "image/png",
		"etag": "\"73d-oPfccjjLDzITmTY5xV4vXEp+tUs\"",
		"mtime": "2026-08-08T12:48:20.082Z",
		"size": 1853,
		"path": "../public/favicon.png"
	},
	"/assets/app-DBN3GeyF.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2ee7-gFupwGBNKGYYIWSvFMTv0k7rUtw\"",
		"mtime": "2026-08-10T11:27:21.867Z",
		"size": 12007,
		"path": "../public/assets/app-DBN3GeyF.js"
	},
	"/assets/app.appraisers-BPUR0DaQ.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"24ad-apv/agDjYYM53YDvm/bz8CpxvSI\"",
		"mtime": "2026-08-10T11:27:21.875Z",
		"size": 9389,
		"path": "../public/assets/app.appraisers-BPUR0DaQ.js"
	},
	"/assets/app.audit-D7yLvPL_.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1a30-4+F5UvLGW+nhwfAeiHWL1uAoj74\"",
		"mtime": "2026-08-10T11:27:21.875Z",
		"size": 6704,
		"path": "../public/assets/app.audit-D7yLvPL_.js"
	},
	"/robots.txt": {
		"type": "text/plain; charset=utf-8",
		"etag": "\"ae-hLVBrSrDdpIw3Xl0dJPRkupPepQ\"",
		"mtime": "2026-08-08T12:48:20.324Z",
		"size": 174,
		"path": "../public/robots.txt"
	},
	"/assets/app.branches-B2H9pFvF.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"d47-oFFHCDrArdNni+tS8MruOL2tOzE\"",
		"mtime": "2026-08-10T11:27:21.875Z",
		"size": 3399,
		"path": "../public/assets/app.branches-B2H9pFvF.js"
	},
	"/assets/app.code-lists-ByGxQEor.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"24ca-JTtfBg/4ACpro4HXCACAp1yKj00\"",
		"mtime": "2026-08-10T11:27:21.881Z",
		"size": 9418,
		"path": "../public/assets/app.code-lists-ByGxQEor.js"
	},
	"/assets/app.documents-B2_1nsVm.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"c1f-xaNYfXCWjSF0Ly3USCUU9WuFzwM\"",
		"mtime": "2026-08-10T11:27:21.897Z",
		"size": 3103,
		"path": "../public/assets/app.documents-B2_1nsVm.js"
	},
	"/assets/app.health-Camq5NEu.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"7eb-szncyn1GfE8tiY5G8JaHBRLfecA\"",
		"mtime": "2026-08-10T11:27:21.901Z",
		"size": 2027,
		"path": "../public/assets/app.health-Camq5NEu.js"
	},
	"/assets/app.index-YT_bAZ3t.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"b3b-ZD1fzH7cVNzqjPVER09gs7+IBM4\"",
		"mtime": "2026-08-10T11:27:21.903Z",
		"size": 2875,
		"path": "../public/assets/app.index-YT_bAZ3t.js"
	},
	"/assets/app.notifications-BKwqTZnt.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"cb7-Ewj9ZIiuS1lr/VxRiadpTGwS1WM\"",
		"mtime": "2026-08-10T11:27:21.904Z",
		"size": 3255,
		"path": "../public/assets/app.notifications-BKwqTZnt.js"
	},
	"/assets/app.orders-EhHKk9ST.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2c06-dcc7bZEKZaBYP+yyQnxQ/2D/jgo\"",
		"mtime": "2026-08-10T11:27:21.904Z",
		"size": 11270,
		"path": "../public/assets/app.orders-EhHKk9ST.js"
	},
	"/assets/app.orders_._id-Brbf6IpL.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"5ed5-4FsLI8x89dpKr194LvdF/KZvbc4\"",
		"mtime": "2026-08-10T11:27:21.904Z",
		"size": 24277,
		"path": "../public/assets/app.orders_._id-Brbf6IpL.js"
	},
	"/assets/app.protocol-CwIb2_Sp.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"10d7-lry4OoV519vA5jr2TclSvFzG/JM\"",
		"mtime": "2026-08-10T11:27:21.904Z",
		"size": 4311,
		"path": "../public/assets/app.protocol-CwIb2_Sp.js"
	},
	"/assets/app.reports-6cjDgy-1.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"18fa-Ud+/9JFNVOR7REf/BEL27zBrDs8\"",
		"mtime": "2026-08-10T11:27:21.913Z",
		"size": 6394,
		"path": "../public/assets/app.reports-6cjDgy-1.js"
	},
	"/assets/app.roles-B-nojFtR.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"20c0-JX/MaO+zqwQDotSqU8ay64qq4K0\"",
		"mtime": "2026-08-10T11:27:21.915Z",
		"size": 8384,
		"path": "../public/assets/app.roles-B-nojFtR.js"
	},
	"/assets/app.tasks-Do9JCOYj.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"d8d-pL6ItNXCCgM1SeM7AFxrkztUpdI\"",
		"mtime": "2026-08-10T11:27:21.920Z",
		"size": 3469,
		"path": "../public/assets/app.tasks-Do9JCOYj.js"
	},
	"/assets/app.users-c9svJcoA.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"23fc-ICjjpZHyLF+wUK30lR3RMiDUUN4\"",
		"mtime": "2026-08-10T11:27:21.942Z",
		"size": 9212,
		"path": "../public/assets/app.users-c9svJcoA.js"
	},
	"/assets/app._resource-D-oWXPbK.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"11ef-Mpf9UUUHisB0if29ZmxE+fDQhjo\"",
		"mtime": "2026-08-10T11:27:21.874Z",
		"size": 4591,
		"path": "../public/assets/app._resource-D-oWXPbK.js"
	},
	"/assets/bell-BoEjdX6c.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"11d-b+dezjnK8SaqQBcNgPiqP1ZmskI\"",
		"mtime": "2026-08-10T11:27:21.942Z",
		"size": 285,
		"path": "../public/assets/bell-BoEjdX6c.js"
	},
	"/assets/briefcase-business-BOg_qR13.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"140-XrZPuiETcci7FEGV8+bW5CdVDeo\"",
		"mtime": "2026-08-10T11:27:21.942Z",
		"size": 320,
		"path": "../public/assets/briefcase-business-BOg_qR13.js"
	},
	"/assets/button-BTDjOEn2.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1676-9qXQ232SNoWhO4EI9uWBTGgu/LM\"",
		"mtime": "2026-08-10T11:27:21.951Z",
		"size": 5750,
		"path": "../public/assets/button-BTDjOEn2.js"
	},
	"/assets/check-XK36C3Py.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"77-V2rv81BiQMQtBKVZ8ttQpvdMy5U\"",
		"mtime": "2026-08-10T11:27:21.951Z",
		"size": 119,
		"path": "../public/assets/check-XK36C3Py.js"
	},
	"/assets/circle-check-DP-LHyYE.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"ad-Q5Aj9DYQ107UkdiHJc6OT9ITg1s\"",
		"mtime": "2026-08-10T11:27:21.951Z",
		"size": 173,
		"path": "../public/assets/circle-check-DP-LHyYE.js"
	},
	"/assets/context-DiGVaQr6.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"12d-ZRI6T7hsDtu0ZZpbkM29ZChluEA\"",
		"mtime": "2026-08-10T11:27:21.951Z",
		"size": 301,
		"path": "../public/assets/context-DiGVaQr6.js"
	},
	"/assets/download-BBiKiyX4.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"e3-9Fud8I0qvidoDF5zmcewukd3Vf8\"",
		"mtime": "2026-08-10T11:27:21.951Z",
		"size": 227,
		"path": "../public/assets/download-BBiKiyX4.js"
	},
	"/assets/file-client-BFTJL74X.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"218-7Bi4Fzinax+COeSTV8h43evxRvc\"",
		"mtime": "2026-08-10T11:27:21.966Z",
		"size": 536,
		"path": "../public/assets/file-client-BFTJL74X.js"
	},
	"/assets/dialog-D9f_kYiL.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"8e0b-XHCE7UUySX+fXCMf/yb5I6oAWmg\"",
		"mtime": "2026-08-10T11:27:21.951Z",
		"size": 36363,
		"path": "../public/assets/dialog-D9f_kYiL.js"
	},
	"/assets/file-up-_ctUGp0p.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"15c-BvDNrUIVqKykJsowP8umgATJuEI\"",
		"mtime": "2026-08-10T11:27:21.968Z",
		"size": 348,
		"path": "../public/assets/file-up-_ctUGp0p.js"
	},
	"/assets/file-text-BPXP3LRS.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"17c-IxW1pVlqSNk41GUwwIcLv4/yDDs\"",
		"mtime": "2026-08-10T11:27:21.968Z",
		"size": 380,
		"path": "../public/assets/file-text-BPXP3LRS.js"
	},
	"/assets/eye-R18LoHwS.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"fb-WWL5ob/M2Aqm2k9NasZz21GB3f8\"",
		"mtime": "2026-08-10T11:27:21.964Z",
		"size": 251,
		"path": "../public/assets/eye-R18LoHwS.js"
	},
	"/assets/input-CC_5dtAc.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"271-vEJSluvzaWxkwHSA7cdr5o5lbxU\"",
		"mtime": "2026-08-10T11:27:21.972Z",
		"size": 625,
		"path": "../public/assets/input-CC_5dtAc.js"
	},
	"/assets/keycloak-3f02GxH8.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"c643-4FAamNV/4KSfGUs4CsMJQNzpEa8\"",
		"mtime": "2026-08-10T11:27:21.973Z",
		"size": 50755,
		"path": "../public/assets/keycloak-3f02GxH8.js"
	},
	"/assets/link-Cdm7beDt.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"5217-dnWNGiG/WfNWdtbl7D1NeGM8jwA\"",
		"mtime": "2026-08-10T11:27:21.975Z",
		"size": 21015,
		"path": "../public/assets/link-Cdm7beDt.js"
	},
	"/assets/http-client-Dp22mMjj.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"9e1a-xXae+2uy1D/65tVTyOqPioh2Lgg\"",
		"mtime": "2026-08-10T11:27:21.970Z",
		"size": 40474,
		"path": "../public/assets/http-client-Dp22mMjj.js"
	},
	"/assets/orders-api-L0nCkr8u.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"617-cc4jPmKbQmcdHG4G3446XtC1lhE\"",
		"mtime": "2026-08-10T11:27:21.988Z",
		"size": 1559,
		"path": "../public/assets/orders-api-L0nCkr8u.js"
	},
	"/assets/not-found-i5RsCZif.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"76-Trmr7GZIBZuvfg4uM18tBiRtOXg\"",
		"mtime": "2026-08-10T11:27:21.977Z",
		"size": 118,
		"path": "../public/assets/not-found-i5RsCZif.js"
	},
	"/assets/pencil-C4Ho_Tbb.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"10f-ElT00Abrwmub5ygEawNgikdU9p0\"",
		"mtime": "2026-08-10T11:27:21.990Z",
		"size": 271,
		"path": "../public/assets/pencil-C4Ho_Tbb.js"
	},
	"/assets/power-Dx64RjhI.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"a8-1Fg61tdjdA7lPsTJ1O8dacE7XbQ\"",
		"mtime": "2026-08-10T11:27:21.993Z",
		"size": 168,
		"path": "../public/assets/power-Dx64RjhI.js"
	},
	"/assets/plus-BaHQVsJF.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"94-OEKhm15IlmBa89TIE5UZi/x333o\"",
		"mtime": "2026-08-10T11:27:21.992Z",
		"size": 148,
		"path": "../public/assets/plus-BaHQVsJF.js"
	},
	"/assets/preload-helper-BrvY4r-i.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"15bc-T1h4Dzyqon46HgzNEuKlg4GkoNQ\"",
		"mtime": "2026-08-10T11:27:21.993Z",
		"size": 5564,
		"path": "../public/assets/preload-helper-BrvY4r-i.js"
	},
	"/assets/react-dom-Cl37ZfyE.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"ddb-QcfFMsGlbjAtnp8P9N285wdjmtE\"",
		"mtime": "2026-08-10T11:27:21.997Z",
		"size": 3547,
		"path": "../public/assets/react-dom-Cl37ZfyE.js"
	},
	"/assets/refresh-cw-3UDnvsMn.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"13c-96pBQgddAAzfkBQbA6Z91f8F/X8\"",
		"mtime": "2026-08-10T11:27:21.998Z",
		"size": 316,
		"path": "../public/assets/refresh-cw-3UDnvsMn.js"
	},
	"/assets/resources-B-rPbpLT.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"cc4-SQVxSfXo5WphYXkitUgSb4meNHs\"",
		"mtime": "2026-08-10T11:27:21.999Z",
		"size": 3268,
		"path": "../public/assets/resources-B-rPbpLT.js"
	},
	"/assets/search-BnTUACor.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"a9-9PPXO2yEPdsJAaD46YuTlN862V4\"",
		"mtime": "2026-08-10T11:27:22.002Z",
		"size": 169,
		"path": "../public/assets/search-BnTUACor.js"
	},
	"/assets/potpis-hana.png": {
		"type": "image/png",
		"etag": "\"2619-twlOaby3jaYrZe/PC7GEwo+YkYw\"",
		"mtime": "2026-08-08T12:55:18.829Z",
		"size": 9753,
		"path": "../public/assets/potpis-hana.png"
	},
	"/assets/send-CC72UJSx.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"11d-e/iY2A4v+8V0IjwM8jRvLbJfKo4\"",
		"mtime": "2026-08-10T11:27:22.004Z",
		"size": 285,
		"path": "../public/assets/send-CC72UJSx.js"
	},
	"/assets/shim-fcDmV_kZ.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"337-2KaWqJMbltOGkHAEMdzSsRKko94\"",
		"mtime": "2026-08-10T11:27:22.005Z",
		"size": 823,
		"path": "../public/assets/shim-fcDmV_kZ.js"
	},
	"/assets/index-DOrWvka_.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"7707f-dSQ//J3bpElwTyt622nAJv9Vvqg\"",
		"mtime": "2026-08-10T11:27:21.867Z",
		"size": 487551,
		"path": "../public/assets/index-DOrWvka_.js"
	},
	"/assets/styles-CBfQ9dk5.css": {
		"type": "text/css; charset=utf-8",
		"etag": "\"1ce9c-TL80zGG0C17f7r4a30N7/TKX4oA\"",
		"mtime": "2026-08-10T11:27:22.062Z",
		"size": 118428,
		"path": "../public/assets/styles-CBfQ9dk5.css"
	},
	"/assets/trash-2-uG9Y7Usv.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"143-EJVSi5KlirZoEUAwq8/qjqwHBBE\"",
		"mtime": "2026-08-10T11:27:22.006Z",
		"size": 323,
		"path": "../public/assets/trash-2-uG9Y7Usv.js"
	},
	"/assets/typography-DnEBp4Wi.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"5a5-DT5eC56ZFhOYX2pLZxsPwFNMKs0\"",
		"mtime": "2026-08-10T11:27:22.006Z",
		"size": 1445,
		"path": "../public/assets/typography-DnEBp4Wi.js"
	},
	"/assets/upload-CM6RG0Ps.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"e1-2N8pYHoqEiu1gdtiqsHG4ltgjkg\"",
		"mtime": "2026-08-10T11:27:22.006Z",
		"size": 225,
		"path": "../public/assets/upload-CM6RG0Ps.js"
	},
	"/assets/use-business-text-DAOIIKKi.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"a4-jrOMGzoZQnXAXab67JHkGrKf+C8\"",
		"mtime": "2026-08-10T11:27:22.016Z",
		"size": 164,
		"path": "../public/assets/use-business-text-DAOIIKKi.js"
	},
	"/assets/use-profile-XvS-qOdU.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"12f-KHt/DLc0vU4IGwnUHvzSy2ESesA\"",
		"mtime": "2026-08-10T11:27:22.017Z",
		"size": 303,
		"path": "../public/assets/use-profile-XvS-qOdU.js"
	},
	"/assets/useMatch-BY7OsBEt.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"254-WNUtn+d1vICMCc1GqPtn8Zchcfc\"",
		"mtime": "2026-08-10T11:27:22.017Z",
		"size": 596,
		"path": "../public/assets/useMatch-BY7OsBEt.js"
	},
	"/assets/useMutation-CXvs_jGV.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"8c7-i9JCeNbvNQEHY7RDXzxXSz1LmKQ\"",
		"mtime": "2026-08-10T11:27:22.037Z",
		"size": 2247,
		"path": "../public/assets/useMutation-CXvs_jGV.js"
	},
	"/assets/useNavigate-DnWpapKt.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"e1-dMdNpA6EV4LPieYQgy3v/4xS26g\"",
		"mtime": "2026-08-10T11:27:22.040Z",
		"size": 225,
		"path": "../public/assets/useNavigate-DnWpapKt.js"
	},
	"/assets/user-round-search-Co4f2D5g.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"370-jpzY17NFE3qEwrlvKyvzDapOIio\"",
		"mtime": "2026-08-10T11:27:22.062Z",
		"size": 880,
		"path": "../public/assets/user-round-search-Co4f2D5g.js"
	},
	"/assets/useRouter-P2oSn8kN.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"94-Y22ObRWv8lF66kWlKHzuee+7c/I\"",
		"mtime": "2026-08-10T11:27:22.051Z",
		"size": 148,
		"path": "../public/assets/useRouter-P2oSn8kN.js"
	},
	"/assets/useTranslation-Dj5Vy73B.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"126e-lNYhsTQQmkLV7DT/RPcnFlfICW0\"",
		"mtime": "2026-08-10T11:27:22.053Z",
		"size": 4718,
		"path": "../public/assets/useTranslation-Dj5Vy73B.js"
	},
	"/assets/x-P4ygaZV1.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"95-VuArguxqiYyCdXO2TIwJ5wsOx6g\"",
		"mtime": "2026-08-10T11:27:22.062Z",
		"size": 149,
		"path": "../public/assets/x-P4ygaZV1.js"
	},
	"/assets/fonts/Amalia-Black.woff2": {
		"type": "font/woff2",
		"etag": "\"eca0-J8Cmk5P07sabZioVdUj0eI+ZhpM\"",
		"mtime": "2026-08-08T12:55:15.775Z",
		"size": 60576,
		"path": "../public/assets/fonts/Amalia-Black.woff2"
	},
	"/assets/fonts/Amalia-Bold.woff2": {
		"type": "font/woff2",
		"etag": "\"ebf8-b76GSTJStn0q8Caxa9Uw0Yu1xts\"",
		"mtime": "2026-08-08T12:55:16.171Z",
		"size": 60408,
		"path": "../public/assets/fonts/Amalia-Bold.woff2"
	},
	"/assets/fonts/Amalia-Italic.woff2": {
		"type": "font/woff2",
		"etag": "\"f204-boU785eAdRCQTtmgT59BM7LBMUs\"",
		"mtime": "2026-08-08T12:55:16.583Z",
		"size": 61956,
		"path": "../public/assets/fonts/Amalia-Italic.woff2"
	},
	"/assets/fonts/Amalia-Light.woff2": {
		"type": "font/woff2",
		"etag": "\"ec9c-u54WLGaC/MbmxPbUJKqEfw0yzZc\"",
		"mtime": "2026-08-08T12:55:16.933Z",
		"size": 60572,
		"path": "../public/assets/fonts/Amalia-Light.woff2"
	},
	"/assets/fonts/Amalia-Medium.woff2": {
		"type": "font/woff2",
		"etag": "\"ec68-q0j0+q+OwXtArdZJfaCHKcsVjvI\"",
		"mtime": "2026-08-08T12:55:17.516Z",
		"size": 60520,
		"path": "../public/assets/fonts/Amalia-Medium.woff2"
	},
	"/assets/fonts/Amalia-Regular.woff2": {
		"type": "font/woff2",
		"etag": "\"ecc0-3ukVjB0WxwILF2YFKxstwS3rKAE\"",
		"mtime": "2026-08-08T12:55:17.948Z",
		"size": 60608,
		"path": "../public/assets/fonts/Amalia-Regular.woff2"
	},
	"/assets/fonts/Amalia-Thin.woff2": {
		"type": "font/woff2",
		"etag": "\"ed18-yIWo2mECrhqpYgIH2WXJt3bCYCw\"",
		"mtime": "2026-08-08T12:55:18.518Z",
		"size": 60696,
		"path": "../public/assets/fonts/Amalia-Thin.woff2"
	},
	"/assets/logos/rbi-bank-mono-pos.png": {
		"type": "image/png",
		"etag": "\"e3ee-HBQSUXqcEXxQ83PnQnlYiW5XmYs\"",
		"mtime": "2026-08-08T12:55:10.866Z",
		"size": 58350,
		"path": "../public/assets/logos/rbi-bank-mono-pos.png"
	},
	"/assets/logos/rbi-bank-squared-col.png": {
		"type": "image/png",
		"etag": "\"9a09-z9w/dmNXdBPUk7Mq8bHmpltCSTY\"",
		"mtime": "2026-08-08T12:55:11.523Z",
		"size": 39433,
		"path": "../public/assets/logos/rbi-bank-squared-col.png"
	},
	"/assets/logos/rbi-bank-yellow-neg.png": {
		"type": "image/png",
		"etag": "\"116b9-IS7XIFa/d+H1HxpdktmQ2csvTuI\"",
		"mtime": "2026-08-08T12:55:12.283Z",
		"size": 71353,
		"path": "../public/assets/logos/rbi-bank-yellow-neg.png"
	},
	"/assets/logos/rbi-logo-col-neg.png": {
		"type": "image/png",
		"etag": "\"12ee4-Q4RAaNB1hxx2gKvsK76ZNtSI1s8\"",
		"mtime": "2026-08-08T12:55:13.136Z",
		"size": 77540,
		"path": "../public/assets/logos/rbi-logo-col-neg.png"
	},
	"/assets/logos/rbi-logo-mono-neg.png": {
		"type": "image/png",
		"etag": "\"11d6d-s2YTODR6nmE9/zWygv22OQUuXqc\"",
		"mtime": "2026-08-08T12:55:14.163Z",
		"size": 73069,
		"path": "../public/assets/logos/rbi-logo-mono-neg.png"
	},
	"/assets/logos/rbi-logo-col-pos.png": {
		"type": "image/png",
		"etag": "\"1ab3e-t1peip1WerDl1sZ9Ok8R4bQ9d1s\"",
		"mtime": "2026-08-08T12:55:13.681Z",
		"size": 109374,
		"path": "../public/assets/logos/rbi-logo-col-pos.png"
	},
	"/assets/logos/rbi-logo-mono-pos.png": {
		"type": "image/png",
		"etag": "\"19222-c2YYbNeKeWCKs4aqgkNQs9FsiXk\"",
		"mtime": "2026-08-08T12:55:14.923Z",
		"size": 102946,
		"path": "../public/assets/logos/rbi-logo-mono-pos.png"
	},
	"/assets/logos/rbi-logo-yellow-neg.png": {
		"type": "image/png",
		"etag": "\"1a8b1-CL6C228n6ErcE2k4FuOF6/RrMIs\"",
		"mtime": "2026-08-08T12:55:15.325Z",
		"size": 108721,
		"path": "../public/assets/logos/rbi-logo-yellow-neg.png"
	},
	"/localization/manifests/development.json": {
		"type": "application/json",
		"etag": "\"33d-5PqoDhuAjlCNK+fGqUuefTC16uo\"",
		"mtime": "2026-08-09T20:47:50.580Z",
		"size": 829,
		"path": "../public/localization/manifests/development.json"
	},
	"/localization/releases/2026.08.06-001/bs/accessibility.json": {
		"type": "application/json",
		"etag": "\"200-Bx/CkyqFQzZqB8vbZP+T+MoO8zk\"",
		"mtime": "2026-08-08T12:48:20.085Z",
		"size": 512,
		"path": "../public/localization/releases/2026.08.06-001/bs/accessibility.json"
	},
	"/localization/releases/2026.08.06-001/bs/admin.json": {
		"type": "application/json",
		"etag": "\"2d3c-9ckVKq70mfeqLERGfT6eggbkKKY\"",
		"mtime": "2026-08-08T12:48:20.086Z",
		"size": 11580,
		"path": "../public/localization/releases/2026.08.06-001/bs/admin.json"
	},
	"/localization/releases/2026.08.06-001/bs/api-demo.json": {
		"type": "application/json",
		"etag": "\"31d-AQIEjLmZzwtutiPJC/OKRUdBLxg\"",
		"mtime": "2026-08-08T12:48:20.087Z",
		"size": 797,
		"path": "../public/localization/releases/2026.08.06-001/bs/api-demo.json"
	},
	"/localization/releases/2026.08.06-001/bs/common.json": {
		"type": "application/json",
		"etag": "\"87c-QQ6qedrCGWx5XHqeFlBmnxHXmPI\"",
		"mtime": "2026-08-08T12:48:20.088Z",
		"size": 2172,
		"path": "../public/localization/releases/2026.08.06-001/bs/common.json"
	},
	"/localization/releases/2026.08.06-001/bs/architecture.json": {
		"type": "application/json",
		"etag": "\"4814-cDxWXtXo2UlR8blimLBs2mwR4EQ\"",
		"mtime": "2026-08-09T19:13:30.407Z",
		"size": 18452,
		"path": "../public/localization/releases/2026.08.06-001/bs/architecture.json"
	},
	"/localization/releases/2026.08.06-001/bs/docs.json": {
		"type": "application/json",
		"etag": "\"4-PJV1NTRWRdznGQuF6xCznalrJRg\"",
		"mtime": "2026-08-08T12:48:20.088Z",
		"size": 4,
		"path": "../public/localization/releases/2026.08.06-001/bs/docs.json"
	},
	"/localization/releases/2026.08.06-001/bs/components.json": {
		"type": "application/json",
		"etag": "\"4aae-ED5Sr4fTdquAxXVNLZwrscLd7Eo\"",
		"mtime": "2026-08-08T12:48:20.088Z",
		"size": 19118,
		"path": "../public/localization/releases/2026.08.06-001/bs/components.json"
	},
	"/localization/releases/2026.08.06-001/bs/date-time.json": {
		"type": "application/json",
		"etag": "\"204-YYqYPFElz6l2E6k2pzOsuSkrtK8\"",
		"mtime": "2026-08-08T12:48:20.088Z",
		"size": 516,
		"path": "../public/localization/releases/2026.08.06-001/bs/date-time.json"
	},
	"/localization/releases/2026.08.06-001/bs/errors.json": {
		"type": "application/json",
		"etag": "\"27f-18EZx4t/vreaz56/oC5tWoPEQqw\"",
		"mtime": "2026-08-08T12:48:20.088Z",
		"size": 639,
		"path": "../public/localization/releases/2026.08.06-001/bs/errors.json"
	},
	"/localization/releases/2026.08.06-001/bs/forms.json": {
		"type": "application/json",
		"etag": "\"1d4-RBWOflJUz9VA5uQGA1hbeMtgBNk\"",
		"mtime": "2026-08-08T12:48:20.088Z",
		"size": 468,
		"path": "../public/localization/releases/2026.08.06-001/bs/forms.json"
	},
	"/localization/releases/2026.08.06-001/bs/navigation.json": {
		"type": "application/json",
		"etag": "\"1ec-36X5U5bfhEz3IUFp0xipyHiJ8QM\"",
		"mtime": "2026-08-08T12:48:20.088Z",
		"size": 492,
		"path": "../public/localization/releases/2026.08.06-001/bs/navigation.json"
	},
	"/localization/releases/2026.08.06-001/bs/foundations.json": {
		"type": "application/json",
		"etag": "\"1ca7-DUf38VjIYphJcNR65oO9mpKAuLs\"",
		"mtime": "2026-08-08T12:48:20.088Z",
		"size": 7335,
		"path": "../public/localization/releases/2026.08.06-001/bs/foundations.json"
	},
	"/localization/releases/2026.08.06-001/bs/overview.json": {
		"type": "application/json",
		"etag": "\"ade-6bUtmHynxMC67wkY8OWE32eL1G0\"",
		"mtime": "2026-08-08T12:48:20.088Z",
		"size": 2782,
		"path": "../public/localization/releases/2026.08.06-001/bs/overview.json"
	},
	"/localization/releases/2026.08.06-001/bs/patterns.json": {
		"type": "application/json",
		"etag": "\"2774-Hb5s6rmW7NV79c2RPg0AwMCIGm0\"",
		"mtime": "2026-08-08T12:48:20.088Z",
		"size": 10100,
		"path": "../public/localization/releases/2026.08.06-001/bs/patterns.json"
	},
	"/localization/releases/2026.08.06-001/bs/ui-library.json": {
		"type": "application/json",
		"etag": "\"4f0-HITgrhbHPDiOzBlmydMhkbSSFeA\"",
		"mtime": "2026-08-08T12:48:20.088Z",
		"size": 1264,
		"path": "../public/localization/releases/2026.08.06-001/bs/ui-library.json"
	},
	"/localization/releases/2026.08.07-001/de/accessibility.json": {
		"type": "application/json",
		"etag": "\"205-Qs3u9WJJ34TcDEGc8zLh4xCyHSQ\"",
		"mtime": "2026-08-08T12:48:20.157Z",
		"size": 517,
		"path": "../public/localization/releases/2026.08.07-001/de/accessibility.json"
	},
	"/localization/releases/2026.08.06-001/bs/validation.json": {
		"type": "application/json",
		"etag": "\"1a6-6Zcrh6WSVizM9wLueKIC42nu5Eo\"",
		"mtime": "2026-08-08T12:48:20.088Z",
		"size": 422,
		"path": "../public/localization/releases/2026.08.06-001/bs/validation.json"
	},
	"/localization/releases/2026.08.07-001/de/admin.json": {
		"type": "application/json",
		"etag": "\"2ff3-OQ3AQXooT0rrpi9t8rDC43GpoM8\"",
		"mtime": "2026-08-08T12:48:20.157Z",
		"size": 12275,
		"path": "../public/localization/releases/2026.08.07-001/de/admin.json"
	},
	"/localization/releases/2026.08.07-001/de/api-demo.json": {
		"type": "application/json",
		"etag": "\"300-ohK0vABk3v3G2hy79PxDx9KmZwU\"",
		"mtime": "2026-08-08T12:48:20.157Z",
		"size": 768,
		"path": "../public/localization/releases/2026.08.07-001/de/api-demo.json"
	},
	"/localization/releases/2026.08.07-001/de/common.json": {
		"type": "application/json",
		"etag": "\"8fa-CniZ2gra52ThoUNkAtm0m8hTzfA\"",
		"mtime": "2026-08-08T12:48:20.161Z",
		"size": 2298,
		"path": "../public/localization/releases/2026.08.07-001/de/common.json"
	},
	"/localization/releases/2026.08.07-001/de/architecture.json": {
		"type": "application/json",
		"etag": "\"4cc8-K29t/WnS4UFYW+QYWMG8YWf+lbs\"",
		"mtime": "2026-08-09T19:13:31.560Z",
		"size": 19656,
		"path": "../public/localization/releases/2026.08.07-001/de/architecture.json"
	},
	"/localization/releases/2026.08.07-001/de/components.json": {
		"type": "application/json",
		"etag": "\"50da-ESOcr9LuDITDo2k/ymZADQuSHKg\"",
		"mtime": "2026-08-08T12:48:20.161Z",
		"size": 20698,
		"path": "../public/localization/releases/2026.08.07-001/de/components.json"
	},
	"/localization/releases/2026.08.07-001/de/date-time.json": {
		"type": "application/json",
		"etag": "\"1c5-ljVE+B4cw9qNU1uvWfj11T7za8U\"",
		"mtime": "2026-08-08T12:48:20.161Z",
		"size": 453,
		"path": "../public/localization/releases/2026.08.07-001/de/date-time.json"
	},
	"/localization/releases/2026.08.07-001/de/docs.json": {
		"type": "application/json",
		"etag": "\"223a-9V4xyQuTYF1CCMNKYdm20MYuS/E\"",
		"mtime": "2026-08-08T12:48:20.164Z",
		"size": 8762,
		"path": "../public/localization/releases/2026.08.07-001/de/docs.json"
	},
	"/localization/releases/2026.08.07-001/de/errors.json": {
		"type": "application/json",
		"etag": "\"2d5-SKb2Eb6wOCSmNVUzruEGSMwRYoE\"",
		"mtime": "2026-08-08T12:48:20.164Z",
		"size": 725,
		"path": "../public/localization/releases/2026.08.07-001/de/errors.json"
	},
	"/localization/releases/2026.08.07-001/de/forms.json": {
		"type": "application/json",
		"etag": "\"1d3-0IRk3pjLCk7B27GEWn1VXs2n4CU\"",
		"mtime": "2026-08-08T12:48:20.164Z",
		"size": 467,
		"path": "../public/localization/releases/2026.08.07-001/de/forms.json"
	},
	"/localization/releases/2026.08.07-001/de/overview.json": {
		"type": "application/json",
		"etag": "\"b52-i7YThjIau8nec6ClrZ9iasdZegw\"",
		"mtime": "2026-08-08T12:48:20.164Z",
		"size": 2898,
		"path": "../public/localization/releases/2026.08.07-001/de/overview.json"
	},
	"/localization/releases/2026.08.07-001/de/foundations.json": {
		"type": "application/json",
		"etag": "\"1e11-8ja/ahLc0LIGSvoqcTZvZwjBVcE\"",
		"mtime": "2026-08-08T12:48:20.164Z",
		"size": 7697,
		"path": "../public/localization/releases/2026.08.07-001/de/foundations.json"
	},
	"/localization/releases/2026.08.07-001/de/navigation.json": {
		"type": "application/json",
		"etag": "\"201-ov0KeVr6TqqebI55MPJ1xzBfm8Y\"",
		"mtime": "2026-08-08T12:48:20.164Z",
		"size": 513,
		"path": "../public/localization/releases/2026.08.07-001/de/navigation.json"
	},
	"/localization/releases/2026.08.07-001/de/ui-library.json": {
		"type": "application/json",
		"etag": "\"530-AxXXLAOaQWPoOR+OwRumrLyZl7g\"",
		"mtime": "2026-08-08T12:48:20.164Z",
		"size": 1328,
		"path": "../public/localization/releases/2026.08.07-001/de/ui-library.json"
	},
	"/localization/releases/2026.08.07-001/de/patterns.json": {
		"type": "application/json",
		"etag": "\"28df-mCwilo8WoN3OdXyS5pOXgAqK6vU\"",
		"mtime": "2026-08-08T12:48:20.164Z",
		"size": 10463,
		"path": "../public/localization/releases/2026.08.07-001/de/patterns.json"
	},
	"/localization/releases/2026.08.07-001/de/validation.json": {
		"type": "application/json",
		"etag": "\"1bf-/2OFNq4bZY2xwmi6/IHIixfi4Vc\"",
		"mtime": "2026-08-08T12:48:20.164Z",
		"size": 447,
		"path": "../public/localization/releases/2026.08.07-001/de/validation.json"
	},
	"/localization/releases/2026.08.07-001/en/accessibility.json": {
		"type": "application/json",
		"etag": "\"1e3-hUhZYgI3xW3i/zTvUS17XUC9Kj0\"",
		"mtime": "2026-08-08T12:48:20.172Z",
		"size": 483,
		"path": "../public/localization/releases/2026.08.07-001/en/accessibility.json"
	},
	"/localization/releases/2026.08.07-001/en/api-demo.json": {
		"type": "application/json",
		"etag": "\"2fe-dDLAgN4/Ii8WIJBT8qtNtpiC5Vs\"",
		"mtime": "2026-08-08T12:48:20.172Z",
		"size": 766,
		"path": "../public/localization/releases/2026.08.07-001/en/api-demo.json"
	},
	"/localization/releases/2026.08.07-001/en/admin.json": {
		"type": "application/json",
		"etag": "\"2bfc-Eba76dGy1PUFBo3CK6ue44n2xPw\"",
		"mtime": "2026-08-08T12:48:20.172Z",
		"size": 11260,
		"path": "../public/localization/releases/2026.08.07-001/en/admin.json"
	},
	"/localization/releases/2026.08.07-001/en/common.json": {
		"type": "application/json",
		"etag": "\"844-OuoJeELj3h3mQ8MRm3TO8dsPs+c\"",
		"mtime": "2026-08-08T12:48:20.172Z",
		"size": 2116,
		"path": "../public/localization/releases/2026.08.07-001/en/common.json"
	},
	"/localization/releases/2026.08.07-001/en/architecture.json": {
		"type": "application/json",
		"etag": "\"4505-Seeg5l9xsBTwCMhunBgJKoFg3aM\"",
		"mtime": "2026-08-09T19:13:31.802Z",
		"size": 17669,
		"path": "../public/localization/releases/2026.08.07-001/en/architecture.json"
	},
	"/localization/releases/2026.08.07-001/en/components.json": {
		"type": "application/json",
		"etag": "\"4814-k6BrvANWavK9eOm5jRbYeC5SJeU\"",
		"mtime": "2026-08-08T12:48:20.178Z",
		"size": 18452,
		"path": "../public/localization/releases/2026.08.07-001/en/components.json"
	},
	"/localization/releases/2026.08.07-001/en/date-time.json": {
		"type": "application/json",
		"etag": "\"1bd-PgkIsYDNYmoa0J6K6SkyEvQkLYM\"",
		"mtime": "2026-08-08T12:48:20.178Z",
		"size": 445,
		"path": "../public/localization/releases/2026.08.07-001/en/date-time.json"
	},
	"/localization/releases/2026.08.07-001/en/docs.json": {
		"type": "application/json",
		"etag": "\"1da7-KnFvwU6kr1T2UksFpGE2nJjA0G4\"",
		"mtime": "2026-08-08T12:48:20.178Z",
		"size": 7591,
		"path": "../public/localization/releases/2026.08.07-001/en/docs.json"
	},
	"/localization/releases/2026.08.07-001/en/forms.json": {
		"type": "application/json",
		"etag": "\"1ce-NcJF29EVVzOd6ocuNAU4JMWNsjk\"",
		"mtime": "2026-08-08T12:48:20.180Z",
		"size": 462,
		"path": "../public/localization/releases/2026.08.07-001/en/forms.json"
	},
	"/localization/releases/2026.08.07-001/en/errors.json": {
		"type": "application/json",
		"etag": "\"298-RUO5zkotdWPSLfV6XLItPHHUZrM\"",
		"mtime": "2026-08-08T12:48:20.180Z",
		"size": 664,
		"path": "../public/localization/releases/2026.08.07-001/en/errors.json"
	},
	"/localization/releases/2026.08.07-001/en/foundations.json": {
		"type": "application/json",
		"etag": "\"1bf6-2hnaA2bQ4nKqp/JUCQtFRdeU4jo\"",
		"mtime": "2026-08-08T12:48:20.180Z",
		"size": 7158,
		"path": "../public/localization/releases/2026.08.07-001/en/foundations.json"
	},
	"/localization/releases/2026.08.07-001/en/overview.json": {
		"type": "application/json",
		"etag": "\"a54-7Dp1SU6GdYKS/QMI9rrPAoxIvwI\"",
		"mtime": "2026-08-08T12:48:20.180Z",
		"size": 2644,
		"path": "../public/localization/releases/2026.08.07-001/en/overview.json"
	},
	"/localization/releases/2026.08.07-001/en/navigation.json": {
		"type": "application/json",
		"etag": "\"1eb-kH7XoxSLFZjZdnZWkEhOj09JW/M\"",
		"mtime": "2026-08-08T12:48:20.180Z",
		"size": 491,
		"path": "../public/localization/releases/2026.08.07-001/en/navigation.json"
	},
	"/localization/releases/2026.08.07-001/en/patterns.json": {
		"type": "application/json",
		"etag": "\"2519-vA6dfYpxSt2UhF5ehlCXZh4f+Hw\"",
		"mtime": "2026-08-08T12:48:20.184Z",
		"size": 9497,
		"path": "../public/localization/releases/2026.08.07-001/en/patterns.json"
	},
	"/localization/releases/2026.08.07-001/en/validation.json": {
		"type": "application/json",
		"etag": "\"18e-/fU3CEYp2pOxYJoVWHn4pw4jZ9M\"",
		"mtime": "2026-08-08T12:48:20.184Z",
		"size": 398,
		"path": "../public/localization/releases/2026.08.07-001/en/validation.json"
	},
	"/localization/releases/2026.08.07-001/en/ui-library.json": {
		"type": "application/json",
		"etag": "\"4d2-6ed4jXePT5Vwn9314/ifbZznLqo\"",
		"mtime": "2026-08-08T12:48:20.184Z",
		"size": 1234,
		"path": "../public/localization/releases/2026.08.07-001/en/ui-library.json"
	},
	"/localization/releases/2026.08.07-001/bs/accessibility.json": {
		"type": "application/json",
		"etag": "\"200-Bx/CkyqFQzZqB8vbZP+T+MoO8zk\"",
		"mtime": "2026-08-08T12:48:20.132Z",
		"size": 512,
		"path": "../public/localization/releases/2026.08.07-001/bs/accessibility.json"
	},
	"/localization/releases/2026.08.07-001/bs/admin.json": {
		"type": "application/json",
		"etag": "\"2d3c-9ckVKq70mfeqLERGfT6eggbkKKY\"",
		"mtime": "2026-08-08T12:48:20.139Z",
		"size": 11580,
		"path": "../public/localization/releases/2026.08.07-001/bs/admin.json"
	},
	"/localization/releases/2026.08.07-001/bs/api-demo.json": {
		"type": "application/json",
		"etag": "\"31d-AQIEjLmZzwtutiPJC/OKRUdBLxg\"",
		"mtime": "2026-08-08T12:48:20.140Z",
		"size": 797,
		"path": "../public/localization/releases/2026.08.07-001/bs/api-demo.json"
	},
	"/localization/releases/2026.08.07-001/bs/common.json": {
		"type": "application/json",
		"etag": "\"87c-QQ6qedrCGWx5XHqeFlBmnxHXmPI\"",
		"mtime": "2026-08-08T12:48:20.140Z",
		"size": 2172,
		"path": "../public/localization/releases/2026.08.07-001/bs/common.json"
	},
	"/localization/releases/2026.08.07-001/bs/components.json": {
		"type": "application/json",
		"etag": "\"4aae-ED5Sr4fTdquAxXVNLZwrscLd7Eo\"",
		"mtime": "2026-08-08T12:48:20.140Z",
		"size": 19118,
		"path": "../public/localization/releases/2026.08.07-001/bs/components.json"
	},
	"/localization/releases/2026.08.07-001/bs/architecture.json": {
		"type": "application/json",
		"etag": "\"4814-cDxWXtXo2UlR8blimLBs2mwR4EQ\"",
		"mtime": "2026-08-09T19:13:31.294Z",
		"size": 18452,
		"path": "../public/localization/releases/2026.08.07-001/bs/architecture.json"
	},
	"/localization/releases/2026.08.07-001/bs/forms.json": {
		"type": "application/json",
		"etag": "\"1d4-RBWOflJUz9VA5uQGA1hbeMtgBNk\"",
		"mtime": "2026-08-08T12:48:20.148Z",
		"size": 468,
		"path": "../public/localization/releases/2026.08.07-001/bs/forms.json"
	},
	"/localization/releases/2026.08.07-001/bs/docs.json": {
		"type": "application/json",
		"etag": "\"1ed0-Sy+8CL0TnU7VT7Xlsj5fgWvhkQg\"",
		"mtime": "2026-08-08T12:48:20.140Z",
		"size": 7888,
		"path": "../public/localization/releases/2026.08.07-001/bs/docs.json"
	},
	"/localization/releases/2026.08.07-001/bs/errors.json": {
		"type": "application/json",
		"etag": "\"27f-18EZx4t/vreaz56/oC5tWoPEQqw\"",
		"mtime": "2026-08-08T12:48:20.140Z",
		"size": 639,
		"path": "../public/localization/releases/2026.08.07-001/bs/errors.json"
	},
	"/localization/releases/2026.08.07-001/bs/date-time.json": {
		"type": "application/json",
		"etag": "\"204-YYqYPFElz6l2E6k2pzOsuSkrtK8\"",
		"mtime": "2026-08-08T12:48:20.140Z",
		"size": 516,
		"path": "../public/localization/releases/2026.08.07-001/bs/date-time.json"
	},
	"/localization/releases/2026.08.07-001/bs/foundations.json": {
		"type": "application/json",
		"etag": "\"1ca7-DUf38VjIYphJcNR65oO9mpKAuLs\"",
		"mtime": "2026-08-08T12:48:20.149Z",
		"size": 7335,
		"path": "../public/localization/releases/2026.08.07-001/bs/foundations.json"
	},
	"/localization/releases/2026.08.07-001/bs/overview.json": {
		"type": "application/json",
		"etag": "\"ade-6bUtmHynxMC67wkY8OWE32eL1G0\"",
		"mtime": "2026-08-08T12:48:20.152Z",
		"size": 2782,
		"path": "../public/localization/releases/2026.08.07-001/bs/overview.json"
	},
	"/localization/releases/2026.08.07-001/bs/navigation.json": {
		"type": "application/json",
		"etag": "\"1ec-36X5U5bfhEz3IUFp0xipyHiJ8QM\"",
		"mtime": "2026-08-08T12:48:20.151Z",
		"size": 492,
		"path": "../public/localization/releases/2026.08.07-001/bs/navigation.json"
	},
	"/localization/releases/2026.08.07-001/bs/patterns.json": {
		"type": "application/json",
		"etag": "\"2774-Hb5s6rmW7NV79c2RPg0AwMCIGm0\"",
		"mtime": "2026-08-08T12:48:20.154Z",
		"size": 10100,
		"path": "../public/localization/releases/2026.08.07-001/bs/patterns.json"
	},
	"/localization/releases/2026.08.07-001/bs/validation.json": {
		"type": "application/json",
		"etag": "\"1a6-6Zcrh6WSVizM9wLueKIC42nu5Eo\"",
		"mtime": "2026-08-08T12:48:20.155Z",
		"size": 422,
		"path": "../public/localization/releases/2026.08.07-001/bs/validation.json"
	},
	"/localization/releases/2026.08.07-001/bs/ui-library.json": {
		"type": "application/json",
		"etag": "\"4f0-HITgrhbHPDiOzBlmydMhkbSSFeA\"",
		"mtime": "2026-08-08T12:48:20.155Z",
		"size": 1264,
		"path": "../public/localization/releases/2026.08.07-001/bs/ui-library.json"
	},
	"/localization/releases/2026.08.08-003/bs/admin.json": {
		"type": "application/json",
		"etag": "\"2d76-uCsMyI1vawu9pG6YM3tFAATCCdw\"",
		"mtime": "2026-08-08T12:48:20.275Z",
		"size": 11638,
		"path": "../public/localization/releases/2026.08.08-003/bs/admin.json"
	},
	"/localization/releases/2026.08.08-003/bs/accessibility.json": {
		"type": "application/json",
		"etag": "\"200-Bx/CkyqFQzZqB8vbZP+T+MoO8zk\"",
		"mtime": "2026-08-08T12:48:20.275Z",
		"size": 512,
		"path": "../public/localization/releases/2026.08.08-003/bs/accessibility.json"
	},
	"/localization/releases/2026.08.08-003/bs/api-demo.json": {
		"type": "application/json",
		"etag": "\"31d-AQIEjLmZzwtutiPJC/OKRUdBLxg\"",
		"mtime": "2026-08-08T12:48:20.275Z",
		"size": 797,
		"path": "../public/localization/releases/2026.08.08-003/bs/api-demo.json"
	},
	"/localization/releases/2026.08.08-003/bs/common.json": {
		"type": "application/json",
		"etag": "\"87c-QQ6qedrCGWx5XHqeFlBmnxHXmPI\"",
		"mtime": "2026-08-08T12:48:20.275Z",
		"size": 2172,
		"path": "../public/localization/releases/2026.08.08-003/bs/common.json"
	},
	"/localization/releases/2026.08.08-003/bs/architecture.json": {
		"type": "application/json",
		"etag": "\"47b2-dgvklUDvYAoD410ABHBWAKg8L14\"",
		"mtime": "2026-08-09T19:13:33.410Z",
		"size": 18354,
		"path": "../public/localization/releases/2026.08.08-003/bs/architecture.json"
	},
	"/localization/releases/2026.08.08-003/bs/components.json": {
		"type": "application/json",
		"etag": "\"49d3-HgcTZOBH/GA+z0p7iDHt8inpxdo\"",
		"mtime": "2026-08-08T12:48:20.275Z",
		"size": 18899,
		"path": "../public/localization/releases/2026.08.08-003/bs/components.json"
	},
	"/localization/releases/2026.08.08-003/bs/date-time.json": {
		"type": "application/json",
		"etag": "\"204-YYqYPFElz6l2E6k2pzOsuSkrtK8\"",
		"mtime": "2026-08-08T12:48:20.275Z",
		"size": 516,
		"path": "../public/localization/releases/2026.08.08-003/bs/date-time.json"
	},
	"/localization/releases/2026.08.08-003/bs/forms.json": {
		"type": "application/json",
		"etag": "\"1d4-RBWOflJUz9VA5uQGA1hbeMtgBNk\"",
		"mtime": "2026-08-08T12:48:20.275Z",
		"size": 468,
		"path": "../public/localization/releases/2026.08.08-003/bs/forms.json"
	},
	"/localization/releases/2026.08.08-003/bs/errors.json": {
		"type": "application/json",
		"etag": "\"27f-18EZx4t/vreaz56/oC5tWoPEQqw\"",
		"mtime": "2026-08-08T12:48:20.275Z",
		"size": 639,
		"path": "../public/localization/releases/2026.08.08-003/bs/errors.json"
	},
	"/localization/releases/2026.08.08-003/bs/navigation.json": {
		"type": "application/json",
		"etag": "\"1ce-kiZ12VgTCeX/gaL/eC05wxvF/3A\"",
		"mtime": "2026-08-08T12:48:20.275Z",
		"size": 462,
		"path": "../public/localization/releases/2026.08.08-003/bs/navigation.json"
	},
	"/localization/releases/2026.08.08-003/bs/foundations.json": {
		"type": "application/json",
		"etag": "\"1c9b-D46F3jFwXLHDdX1FEpayNfKMYIA\"",
		"mtime": "2026-08-08T12:48:20.275Z",
		"size": 7323,
		"path": "../public/localization/releases/2026.08.08-003/bs/foundations.json"
	},
	"/localization/releases/2026.08.08-003/bs/overview.json": {
		"type": "application/json",
		"etag": "\"480-OWXLbLg6jQ3osooiNhxxbUPJN0c\"",
		"mtime": "2026-08-08T12:48:20.275Z",
		"size": 1152,
		"path": "../public/localization/releases/2026.08.08-003/bs/overview.json"
	},
	"/localization/releases/2026.08.08-003/bs/ui-library.json": {
		"type": "application/json",
		"etag": "\"4f0-HITgrhbHPDiOzBlmydMhkbSSFeA\"",
		"mtime": "2026-08-08T12:48:20.292Z",
		"size": 1264,
		"path": "../public/localization/releases/2026.08.08-003/bs/ui-library.json"
	},
	"/localization/releases/2026.08.08-003/bs/patterns.json": {
		"type": "application/json",
		"etag": "\"2774-Hb5s6rmW7NV79c2RPg0AwMCIGm0\"",
		"mtime": "2026-08-08T12:48:20.291Z",
		"size": 10100,
		"path": "../public/localization/releases/2026.08.08-003/bs/patterns.json"
	},
	"/localization/releases/2026.08.08-003/bs/validation.json": {
		"type": "application/json",
		"etag": "\"1a6-6Zcrh6WSVizM9wLueKIC42nu5Eo\"",
		"mtime": "2026-08-08T12:48:20.292Z",
		"size": 422,
		"path": "../public/localization/releases/2026.08.08-003/bs/validation.json"
	},
	"/localization/releases/2026.08.08-003/en/accessibility.json": {
		"type": "application/json",
		"etag": "\"1e3-hUhZYgI3xW3i/zTvUS17XUC9Kj0\"",
		"mtime": "2026-08-08T12:48:20.308Z",
		"size": 483,
		"path": "../public/localization/releases/2026.08.08-003/en/accessibility.json"
	},
	"/localization/releases/2026.08.08-003/en/admin.json": {
		"type": "application/json",
		"etag": "\"2c34-7r5OyTIZL4nFqYoELYuwgUzLSlQ\"",
		"mtime": "2026-08-08T12:48:20.308Z",
		"size": 11316,
		"path": "../public/localization/releases/2026.08.08-003/en/admin.json"
	},
	"/localization/releases/2026.08.08-003/en/api-demo.json": {
		"type": "application/json",
		"etag": "\"2fe-dDLAgN4/Ii8WIJBT8qtNtpiC5Vs\"",
		"mtime": "2026-08-08T12:48:20.308Z",
		"size": 766,
		"path": "../public/localization/releases/2026.08.08-003/en/api-demo.json"
	},
	"/localization/releases/2026.08.08-003/en/common.json": {
		"type": "application/json",
		"etag": "\"844-OuoJeELj3h3mQ8MRm3TO8dsPs+c\"",
		"mtime": "2026-08-08T12:48:20.314Z",
		"size": 2116,
		"path": "../public/localization/releases/2026.08.08-003/en/common.json"
	},
	"/localization/releases/2026.08.08-003/en/architecture.json": {
		"type": "application/json",
		"etag": "\"4643-oW+O13mlZW4JgFRg7+7VBawJksc\"",
		"mtime": "2026-08-09T19:13:33.821Z",
		"size": 17987,
		"path": "../public/localization/releases/2026.08.08-003/en/architecture.json"
	},
	"/localization/releases/2026.08.08-003/en/date-time.json": {
		"type": "application/json",
		"etag": "\"1bd-PgkIsYDNYmoa0J6K6SkyEvQkLYM\"",
		"mtime": "2026-08-08T12:48:20.314Z",
		"size": 445,
		"path": "../public/localization/releases/2026.08.08-003/en/date-time.json"
	},
	"/localization/releases/2026.08.08-003/en/components.json": {
		"type": "application/json",
		"etag": "\"4755-8CKWdxa7tI2pWXVE9ROPe3dVlMg\"",
		"mtime": "2026-08-08T12:48:20.314Z",
		"size": 18261,
		"path": "../public/localization/releases/2026.08.08-003/en/components.json"
	},
	"/localization/releases/2026.08.08-003/en/errors.json": {
		"type": "application/json",
		"etag": "\"298-RUO5zkotdWPSLfV6XLItPHHUZrM\"",
		"mtime": "2026-08-08T12:48:20.317Z",
		"size": 664,
		"path": "../public/localization/releases/2026.08.08-003/en/errors.json"
	},
	"/localization/releases/2026.08.08-003/en/foundations.json": {
		"type": "application/json",
		"etag": "\"1bea-j3fpT2nL21NYQGWPEIrT+LuzKVM\"",
		"mtime": "2026-08-08T12:48:20.317Z",
		"size": 7146,
		"path": "../public/localization/releases/2026.08.08-003/en/foundations.json"
	},
	"/localization/releases/2026.08.08-003/en/navigation.json": {
		"type": "application/json",
		"etag": "\"1cd-kw9E7U/SgozcqUOtevXLG5mLq68\"",
		"mtime": "2026-08-08T12:48:20.319Z",
		"size": 461,
		"path": "../public/localization/releases/2026.08.08-003/en/navigation.json"
	},
	"/localization/releases/2026.08.08-003/en/forms.json": {
		"type": "application/json",
		"etag": "\"1ce-NcJF29EVVzOd6ocuNAU4JMWNsjk\"",
		"mtime": "2026-08-08T12:48:20.317Z",
		"size": 462,
		"path": "../public/localization/releases/2026.08.08-003/en/forms.json"
	},
	"/localization/releases/2026.08.08-003/en/overview.json": {
		"type": "application/json",
		"etag": "\"480-Vo3AFqh7pJUCHEDWGHDW8Fq7P9w\"",
		"mtime": "2026-08-08T12:48:20.319Z",
		"size": 1152,
		"path": "../public/localization/releases/2026.08.08-003/en/overview.json"
	},
	"/localization/releases/2026.08.08-003/en/patterns.json": {
		"type": "application/json",
		"etag": "\"2519-vA6dfYpxSt2UhF5ehlCXZh4f+Hw\"",
		"mtime": "2026-08-08T12:48:20.322Z",
		"size": 9497,
		"path": "../public/localization/releases/2026.08.08-003/en/patterns.json"
	},
	"/localization/releases/2026.08.08-003/en/ui-library.json": {
		"type": "application/json",
		"etag": "\"4d2-6ed4jXePT5Vwn9314/ifbZznLqo\"",
		"mtime": "2026-08-08T12:48:20.323Z",
		"size": 1234,
		"path": "../public/localization/releases/2026.08.08-003/en/ui-library.json"
	},
	"/localization/releases/2026.08.08-003/en/validation.json": {
		"type": "application/json",
		"etag": "\"18e-/fU3CEYp2pOxYJoVWHn4pw4jZ9M\"",
		"mtime": "2026-08-08T12:48:20.324Z",
		"size": 398,
		"path": "../public/localization/releases/2026.08.08-003/en/validation.json"
	},
	"/localization/releases/2026.08.08-003/de/admin.json": {
		"type": "application/json",
		"etag": "\"302b-Y7Jea7UOXrjKqXWWN4wFZj9cY1w\"",
		"mtime": "2026-08-08T12:48:20.292Z",
		"size": 12331,
		"path": "../public/localization/releases/2026.08.08-003/de/admin.json"
	},
	"/localization/releases/2026.08.08-003/de/api-demo.json": {
		"type": "application/json",
		"etag": "\"300-ohK0vABk3v3G2hy79PxDx9KmZwU\"",
		"mtime": "2026-08-08T12:48:20.292Z",
		"size": 768,
		"path": "../public/localization/releases/2026.08.08-003/de/api-demo.json"
	},
	"/localization/releases/2026.08.08-003/de/accessibility.json": {
		"type": "application/json",
		"etag": "\"205-Qs3u9WJJ34TcDEGc8zLh4xCyHSQ\"",
		"mtime": "2026-08-08T12:48:20.292Z",
		"size": 517,
		"path": "../public/localization/releases/2026.08.08-003/de/accessibility.json"
	},
	"/localization/releases/2026.08.08-003/de/architecture.json": {
		"type": "application/json",
		"etag": "\"4b8f-ENyXWcwZmo+EoEz4/TjZstOkQTM\"",
		"mtime": "2026-08-09T19:13:33.618Z",
		"size": 19343,
		"path": "../public/localization/releases/2026.08.08-003/de/architecture.json"
	},
	"/localization/releases/2026.08.08-003/de/common.json": {
		"type": "application/json",
		"etag": "\"8fa-CniZ2gra52ThoUNkAtm0m8hTzfA\"",
		"mtime": "2026-08-08T12:48:20.292Z",
		"size": 2298,
		"path": "../public/localization/releases/2026.08.08-003/de/common.json"
	},
	"/localization/releases/2026.08.08-003/de/components.json": {
		"type": "application/json",
		"etag": "\"4fe3-JSGYQIy6y2UwS5Kbsb/bZlsftM4\"",
		"mtime": "2026-08-08T12:48:20.292Z",
		"size": 20451,
		"path": "../public/localization/releases/2026.08.08-003/de/components.json"
	},
	"/localization/releases/2026.08.08-003/de/date-time.json": {
		"type": "application/json",
		"etag": "\"1c5-ljVE+B4cw9qNU1uvWfj11T7za8U\"",
		"mtime": "2026-08-08T12:48:20.292Z",
		"size": 453,
		"path": "../public/localization/releases/2026.08.08-003/de/date-time.json"
	},
	"/localization/releases/2026.08.08-003/de/forms.json": {
		"type": "application/json",
		"etag": "\"1d3-0IRk3pjLCk7B27GEWn1VXs2n4CU\"",
		"mtime": "2026-08-08T12:48:20.292Z",
		"size": 467,
		"path": "../public/localization/releases/2026.08.08-003/de/forms.json"
	},
	"/localization/releases/2026.08.08-003/de/errors.json": {
		"type": "application/json",
		"etag": "\"2d5-SKb2Eb6wOCSmNVUzruEGSMwRYoE\"",
		"mtime": "2026-08-08T12:48:20.292Z",
		"size": 725,
		"path": "../public/localization/releases/2026.08.08-003/de/errors.json"
	},
	"/localization/releases/2026.08.08-003/de/foundations.json": {
		"type": "application/json",
		"etag": "\"1e05-EZqpZYEoseLwbVUSkcSC3I/Qs/Q\"",
		"mtime": "2026-08-08T12:48:20.292Z",
		"size": 7685,
		"path": "../public/localization/releases/2026.08.08-003/de/foundations.json"
	},
	"/localization/releases/2026.08.08-003/de/navigation.json": {
		"type": "application/json",
		"etag": "\"1e3-GPZ+ol9paFwBJ4w5xow7XVp1iRo\"",
		"mtime": "2026-08-08T12:48:20.292Z",
		"size": 483,
		"path": "../public/localization/releases/2026.08.08-003/de/navigation.json"
	},
	"/localization/releases/2026.08.08-003/de/overview.json": {
		"type": "application/json",
		"etag": "\"4a6-Z1YEN7vY7MZZ/Eh8YVx6VnvBZ8Q\"",
		"mtime": "2026-08-08T12:48:20.292Z",
		"size": 1190,
		"path": "../public/localization/releases/2026.08.08-003/de/overview.json"
	},
	"/localization/releases/2026.08.08-003/de/ui-library.json": {
		"type": "application/json",
		"etag": "\"530-AxXXLAOaQWPoOR+OwRumrLyZl7g\"",
		"mtime": "2026-08-08T12:48:20.308Z",
		"size": 1328,
		"path": "../public/localization/releases/2026.08.08-003/de/ui-library.json"
	},
	"/localization/releases/2026.08.08-003/de/patterns.json": {
		"type": "application/json",
		"etag": "\"28df-mCwilo8WoN3OdXyS5pOXgAqK6vU\"",
		"mtime": "2026-08-08T12:48:20.308Z",
		"size": 10463,
		"path": "../public/localization/releases/2026.08.08-003/de/patterns.json"
	},
	"/localization/releases/2026.08.08-003/de/validation.json": {
		"type": "application/json",
		"etag": "\"1bf-/2OFNq4bZY2xwmi6/IHIixfi4Vc\"",
		"mtime": "2026-08-08T12:48:20.308Z",
		"size": 447,
		"path": "../public/localization/releases/2026.08.08-003/de/validation.json"
	},
	"/localization/releases/2026.08.08-002/bs/accessibility.json": {
		"type": "application/json",
		"etag": "\"200-Bx/CkyqFQzZqB8vbZP+T+MoO8zk\"",
		"mtime": "2026-08-08T12:48:20.236Z",
		"size": 512,
		"path": "../public/localization/releases/2026.08.08-002/bs/accessibility.json"
	},
	"/localization/releases/2026.08.08-002/bs/admin.json": {
		"type": "application/json",
		"etag": "\"2d76-uCsMyI1vawu9pG6YM3tFAATCCdw\"",
		"mtime": "2026-08-08T12:48:20.237Z",
		"size": 11638,
		"path": "../public/localization/releases/2026.08.08-002/bs/admin.json"
	},
	"/localization/releases/2026.08.08-002/bs/api-demo.json": {
		"type": "application/json",
		"etag": "\"31d-AQIEjLmZzwtutiPJC/OKRUdBLxg\"",
		"mtime": "2026-08-08T12:48:20.238Z",
		"size": 797,
		"path": "../public/localization/releases/2026.08.08-002/bs/api-demo.json"
	},
	"/localization/releases/2026.08.08-002/bs/architecture.json": {
		"type": "application/json",
		"etag": "\"47b2-dgvklUDvYAoD410ABHBWAKg8L14\"",
		"mtime": "2026-08-09T19:13:32.735Z",
		"size": 18354,
		"path": "../public/localization/releases/2026.08.08-002/bs/architecture.json"
	},
	"/localization/releases/2026.08.08-002/bs/common.json": {
		"type": "application/json",
		"etag": "\"87c-QQ6qedrCGWx5XHqeFlBmnxHXmPI\"",
		"mtime": "2026-08-08T12:48:20.241Z",
		"size": 2172,
		"path": "../public/localization/releases/2026.08.08-002/bs/common.json"
	},
	"/localization/releases/2026.08.08-002/bs/components.json": {
		"type": "application/json",
		"etag": "\"49d5-saVfgRVQt3TFFr/FN30/w0mPcm4\"",
		"mtime": "2026-08-08T12:48:20.242Z",
		"size": 18901,
		"path": "../public/localization/releases/2026.08.08-002/bs/components.json"
	},
	"/localization/releases/2026.08.08-002/bs/date-time.json": {
		"type": "application/json",
		"etag": "\"204-YYqYPFElz6l2E6k2pzOsuSkrtK8\"",
		"mtime": "2026-08-08T12:48:20.242Z",
		"size": 516,
		"path": "../public/localization/releases/2026.08.08-002/bs/date-time.json"
	},
	"/localization/releases/2026.08.08-002/bs/errors.json": {
		"type": "application/json",
		"etag": "\"27f-18EZx4t/vreaz56/oC5tWoPEQqw\"",
		"mtime": "2026-08-08T12:48:20.242Z",
		"size": 639,
		"path": "../public/localization/releases/2026.08.08-002/bs/errors.json"
	},
	"/localization/releases/2026.08.08-002/bs/forms.json": {
		"type": "application/json",
		"etag": "\"1d4-RBWOflJUz9VA5uQGA1hbeMtgBNk\"",
		"mtime": "2026-08-08T12:48:20.242Z",
		"size": 468,
		"path": "../public/localization/releases/2026.08.08-002/bs/forms.json"
	},
	"/localization/releases/2026.08.08-002/bs/navigation.json": {
		"type": "application/json",
		"etag": "\"1ce-kiZ12VgTCeX/gaL/eC05wxvF/3A\"",
		"mtime": "2026-08-08T12:48:20.244Z",
		"size": 462,
		"path": "../public/localization/releases/2026.08.08-002/bs/navigation.json"
	},
	"/localization/releases/2026.08.08-002/bs/foundations.json": {
		"type": "application/json",
		"etag": "\"1c9b-D46F3jFwXLHDdX1FEpayNfKMYIA\"",
		"mtime": "2026-08-08T12:48:20.244Z",
		"size": 7323,
		"path": "../public/localization/releases/2026.08.08-002/bs/foundations.json"
	},
	"/localization/releases/2026.08.08-002/bs/overview.json": {
		"type": "application/json",
		"etag": "\"480-OWXLbLg6jQ3osooiNhxxbUPJN0c\"",
		"mtime": "2026-08-08T12:48:20.244Z",
		"size": 1152,
		"path": "../public/localization/releases/2026.08.08-002/bs/overview.json"
	},
	"/localization/releases/2026.08.08-002/bs/ui-library.json": {
		"type": "application/json",
		"etag": "\"4f0-HITgrhbHPDiOzBlmydMhkbSSFeA\"",
		"mtime": "2026-08-08T12:48:20.248Z",
		"size": 1264,
		"path": "../public/localization/releases/2026.08.08-002/bs/ui-library.json"
	},
	"/localization/releases/2026.08.08-002/bs/patterns.json": {
		"type": "application/json",
		"etag": "\"2774-Hb5s6rmW7NV79c2RPg0AwMCIGm0\"",
		"mtime": "2026-08-08T12:48:20.244Z",
		"size": 10100,
		"path": "../public/localization/releases/2026.08.08-002/bs/patterns.json"
	},
	"/localization/releases/2026.08.08-002/bs/validation.json": {
		"type": "application/json",
		"etag": "\"1a6-6Zcrh6WSVizM9wLueKIC42nu5Eo\"",
		"mtime": "2026-08-08T12:48:20.249Z",
		"size": 422,
		"path": "../public/localization/releases/2026.08.08-002/bs/validation.json"
	},
	"/localization/releases/2026.08.08-002/en/accessibility.json": {
		"type": "application/json",
		"etag": "\"1e3-hUhZYgI3xW3i/zTvUS17XUC9Kj0\"",
		"mtime": "2026-08-08T12:48:20.260Z",
		"size": 483,
		"path": "../public/localization/releases/2026.08.08-002/en/accessibility.json"
	},
	"/localization/releases/2026.08.08-002/en/admin.json": {
		"type": "application/json",
		"etag": "\"2c34-7r5OyTIZL4nFqYoELYuwgUzLSlQ\"",
		"mtime": "2026-08-08T12:48:20.260Z",
		"size": 11316,
		"path": "../public/localization/releases/2026.08.08-002/en/admin.json"
	},
	"/localization/releases/2026.08.08-002/en/architecture.json": {
		"type": "application/json",
		"etag": "\"4643-oW+O13mlZW4JgFRg7+7VBawJksc\"",
		"mtime": "2026-08-09T19:13:33.177Z",
		"size": 17987,
		"path": "../public/localization/releases/2026.08.08-002/en/architecture.json"
	},
	"/localization/releases/2026.08.08-002/en/api-demo.json": {
		"type": "application/json",
		"etag": "\"2fe-dDLAgN4/Ii8WIJBT8qtNtpiC5Vs\"",
		"mtime": "2026-08-08T12:48:20.260Z",
		"size": 766,
		"path": "../public/localization/releases/2026.08.08-002/en/api-demo.json"
	},
	"/localization/releases/2026.08.08-002/en/common.json": {
		"type": "application/json",
		"etag": "\"844-OuoJeELj3h3mQ8MRm3TO8dsPs+c\"",
		"mtime": "2026-08-08T12:48:20.260Z",
		"size": 2116,
		"path": "../public/localization/releases/2026.08.08-002/en/common.json"
	},
	"/localization/releases/2026.08.08-002/en/components.json": {
		"type": "application/json",
		"etag": "\"4757-6Fgplb4+B5bGeFozoXtY/FLxT1A\"",
		"mtime": "2026-08-08T12:48:20.260Z",
		"size": 18263,
		"path": "../public/localization/releases/2026.08.08-002/en/components.json"
	},
	"/localization/releases/2026.08.08-002/en/date-time.json": {
		"type": "application/json",
		"etag": "\"1bd-PgkIsYDNYmoa0J6K6SkyEvQkLYM\"",
		"mtime": "2026-08-08T12:48:20.260Z",
		"size": 445,
		"path": "../public/localization/releases/2026.08.08-002/en/date-time.json"
	},
	"/localization/releases/2026.08.08-002/en/errors.json": {
		"type": "application/json",
		"etag": "\"298-RUO5zkotdWPSLfV6XLItPHHUZrM\"",
		"mtime": "2026-08-08T12:48:20.260Z",
		"size": 664,
		"path": "../public/localization/releases/2026.08.08-002/en/errors.json"
	},
	"/localization/releases/2026.08.08-002/en/forms.json": {
		"type": "application/json",
		"etag": "\"1ce-NcJF29EVVzOd6ocuNAU4JMWNsjk\"",
		"mtime": "2026-08-08T12:48:20.260Z",
		"size": 462,
		"path": "../public/localization/releases/2026.08.08-002/en/forms.json"
	},
	"/localization/releases/2026.08.08-002/en/foundations.json": {
		"type": "application/json",
		"etag": "\"1bea-j3fpT2nL21NYQGWPEIrT+LuzKVM\"",
		"mtime": "2026-08-08T12:48:20.260Z",
		"size": 7146,
		"path": "../public/localization/releases/2026.08.08-002/en/foundations.json"
	},
	"/localization/releases/2026.08.08-002/en/navigation.json": {
		"type": "application/json",
		"etag": "\"1cd-kw9E7U/SgozcqUOtevXLG5mLq68\"",
		"mtime": "2026-08-08T12:48:20.260Z",
		"size": 461,
		"path": "../public/localization/releases/2026.08.08-002/en/navigation.json"
	},
	"/localization/releases/2026.08.08-002/en/overview.json": {
		"type": "application/json",
		"etag": "\"480-Vo3AFqh7pJUCHEDWGHDW8Fq7P9w\"",
		"mtime": "2026-08-08T12:48:20.275Z",
		"size": 1152,
		"path": "../public/localization/releases/2026.08.08-002/en/overview.json"
	},
	"/localization/releases/2026.08.08-002/en/patterns.json": {
		"type": "application/json",
		"etag": "\"2519-vA6dfYpxSt2UhF5ehlCXZh4f+Hw\"",
		"mtime": "2026-08-08T12:48:20.275Z",
		"size": 9497,
		"path": "../public/localization/releases/2026.08.08-002/en/patterns.json"
	},
	"/localization/releases/2026.08.08-002/en/ui-library.json": {
		"type": "application/json",
		"etag": "\"4d2-6ed4jXePT5Vwn9314/ifbZznLqo\"",
		"mtime": "2026-08-08T12:48:20.275Z",
		"size": 1234,
		"path": "../public/localization/releases/2026.08.08-002/en/ui-library.json"
	},
	"/localization/releases/2026.08.08-002/en/validation.json": {
		"type": "application/json",
		"etag": "\"18e-/fU3CEYp2pOxYJoVWHn4pw4jZ9M\"",
		"mtime": "2026-08-08T12:48:20.275Z",
		"size": 398,
		"path": "../public/localization/releases/2026.08.08-002/en/validation.json"
	},
	"/localization/releases/2026.08.06-001/en/accessibility.json": {
		"type": "application/json",
		"etag": "\"1e3-hUhZYgI3xW3i/zTvUS17XUC9Kj0\"",
		"mtime": "2026-08-08T12:48:20.117Z",
		"size": 483,
		"path": "../public/localization/releases/2026.08.06-001/en/accessibility.json"
	},
	"/localization/releases/2026.08.06-001/en/admin.json": {
		"type": "application/json",
		"etag": "\"2bfc-Eba76dGy1PUFBo3CK6ue44n2xPw\"",
		"mtime": "2026-08-08T12:48:20.117Z",
		"size": 11260,
		"path": "../public/localization/releases/2026.08.06-001/en/admin.json"
	},
	"/localization/releases/2026.08.06-001/en/api-demo.json": {
		"type": "application/json",
		"etag": "\"2fe-dDLAgN4/Ii8WIJBT8qtNtpiC5Vs\"",
		"mtime": "2026-08-08T12:48:20.117Z",
		"size": 766,
		"path": "../public/localization/releases/2026.08.06-001/en/api-demo.json"
	},
	"/localization/releases/2026.08.06-001/en/architecture.json": {
		"type": "application/json",
		"etag": "\"4505-Seeg5l9xsBTwCMhunBgJKoFg3aM\"",
		"mtime": "2026-08-09T19:13:30.970Z",
		"size": 17669,
		"path": "../public/localization/releases/2026.08.06-001/en/architecture.json"
	},
	"/localization/releases/2026.08.06-001/en/common.json": {
		"type": "application/json",
		"etag": "\"844-OuoJeELj3h3mQ8MRm3TO8dsPs+c\"",
		"mtime": "2026-08-08T12:48:20.117Z",
		"size": 2116,
		"path": "../public/localization/releases/2026.08.06-001/en/common.json"
	},
	"/localization/releases/2026.08.06-001/en/components.json": {
		"type": "application/json",
		"etag": "\"4814-k6BrvANWavK9eOm5jRbYeC5SJeU\"",
		"mtime": "2026-08-08T12:48:20.117Z",
		"size": 18452,
		"path": "../public/localization/releases/2026.08.06-001/en/components.json"
	},
	"/localization/releases/2026.08.06-001/en/date-time.json": {
		"type": "application/json",
		"etag": "\"1bd-PgkIsYDNYmoa0J6K6SkyEvQkLYM\"",
		"mtime": "2026-08-08T12:48:20.117Z",
		"size": 445,
		"path": "../public/localization/releases/2026.08.06-001/en/date-time.json"
	},
	"/localization/releases/2026.08.06-001/en/errors.json": {
		"type": "application/json",
		"etag": "\"298-RUO5zkotdWPSLfV6XLItPHHUZrM\"",
		"mtime": "2026-08-08T12:48:20.117Z",
		"size": 664,
		"path": "../public/localization/releases/2026.08.06-001/en/errors.json"
	},
	"/localization/releases/2026.08.06-001/en/forms.json": {
		"type": "application/json",
		"etag": "\"1ce-NcJF29EVVzOd6ocuNAU4JMWNsjk\"",
		"mtime": "2026-08-08T12:48:20.117Z",
		"size": 462,
		"path": "../public/localization/releases/2026.08.06-001/en/forms.json"
	},
	"/localization/releases/2026.08.06-001/en/docs.json": {
		"type": "application/json",
		"etag": "\"1da7-KnFvwU6kr1T2UksFpGE2nJjA0G4\"",
		"mtime": "2026-08-08T12:48:20.117Z",
		"size": 7591,
		"path": "../public/localization/releases/2026.08.06-001/en/docs.json"
	},
	"/localization/releases/2026.08.06-001/en/foundations.json": {
		"type": "application/json",
		"etag": "\"1bf6-2hnaA2bQ4nKqp/JUCQtFRdeU4jo\"",
		"mtime": "2026-08-08T12:48:20.117Z",
		"size": 7158,
		"path": "../public/localization/releases/2026.08.06-001/en/foundations.json"
	},
	"/localization/releases/2026.08.06-001/en/overview.json": {
		"type": "application/json",
		"etag": "\"a54-7Dp1SU6GdYKS/QMI9rrPAoxIvwI\"",
		"mtime": "2026-08-08T12:48:20.117Z",
		"size": 2644,
		"path": "../public/localization/releases/2026.08.06-001/en/overview.json"
	},
	"/localization/releases/2026.08.06-001/en/navigation.json": {
		"type": "application/json",
		"etag": "\"1eb-kH7XoxSLFZjZdnZWkEhOj09JW/M\"",
		"mtime": "2026-08-08T12:48:20.117Z",
		"size": 491,
		"path": "../public/localization/releases/2026.08.06-001/en/navigation.json"
	},
	"/localization/releases/2026.08.06-001/en/patterns.json": {
		"type": "application/json",
		"etag": "\"2519-vA6dfYpxSt2UhF5ehlCXZh4f+Hw\"",
		"mtime": "2026-08-08T12:48:20.132Z",
		"size": 9497,
		"path": "../public/localization/releases/2026.08.06-001/en/patterns.json"
	},
	"/localization/releases/2026.08.06-001/en/ui-library.json": {
		"type": "application/json",
		"etag": "\"4d2-6ed4jXePT5Vwn9314/ifbZznLqo\"",
		"mtime": "2026-08-08T12:48:20.132Z",
		"size": 1234,
		"path": "../public/localization/releases/2026.08.06-001/en/ui-library.json"
	},
	"/localization/releases/2026.08.06-001/en/validation.json": {
		"type": "application/json",
		"etag": "\"18e-/fU3CEYp2pOxYJoVWHn4pw4jZ9M\"",
		"mtime": "2026-08-08T12:48:20.132Z",
		"size": 398,
		"path": "../public/localization/releases/2026.08.06-001/en/validation.json"
	},
	"/localization/releases/2026.08.08-001/bs/accessibility.json": {
		"type": "application/json",
		"etag": "\"200-Bx/CkyqFQzZqB8vbZP+T+MoO8zk\"",
		"mtime": "2026-08-08T12:48:20.184Z",
		"size": 512,
		"path": "../public/localization/releases/2026.08.08-001/bs/accessibility.json"
	},
	"/localization/releases/2026.08.08-001/bs/admin.json": {
		"type": "application/json",
		"etag": "\"2d76-uCsMyI1vawu9pG6YM3tFAATCCdw\"",
		"mtime": "2026-08-08T12:48:20.184Z",
		"size": 11638,
		"path": "../public/localization/releases/2026.08.08-001/bs/admin.json"
	},
	"/localization/releases/2026.08.08-001/bs/api-demo.json": {
		"type": "application/json",
		"etag": "\"31d-AQIEjLmZzwtutiPJC/OKRUdBLxg\"",
		"mtime": "2026-08-08T12:48:20.184Z",
		"size": 797,
		"path": "../public/localization/releases/2026.08.08-001/bs/api-demo.json"
	},
	"/localization/releases/2026.08.08-001/bs/architecture.json": {
		"type": "application/json",
		"etag": "\"47b2-dgvklUDvYAoD410ABHBWAKg8L14\"",
		"mtime": "2026-08-09T19:13:32.053Z",
		"size": 18354,
		"path": "../public/localization/releases/2026.08.08-001/bs/architecture.json"
	},
	"/localization/releases/2026.08.08-001/bs/common.json": {
		"type": "application/json",
		"etag": "\"915-0yEqUMbj5b5Rq7pvZJJzbsOOHfY\"",
		"mtime": "2026-08-08T12:58:55.040Z",
		"size": 2325,
		"path": "../public/localization/releases/2026.08.08-001/bs/common.json"
	},
	"/localization/releases/2026.08.08-001/bs/components.json": {
		"type": "application/json",
		"etag": "\"4b51-pV3PvdROS7EDEh1MuxYmb8aKhqg\"",
		"mtime": "2026-08-08T12:48:20.193Z",
		"size": 19281,
		"path": "../public/localization/releases/2026.08.08-001/bs/components.json"
	},
	"/localization/releases/2026.08.08-001/bs/date-time.json": {
		"type": "application/json",
		"etag": "\"204-YYqYPFElz6l2E6k2pzOsuSkrtK8\"",
		"mtime": "2026-08-08T12:48:20.195Z",
		"size": 516,
		"path": "../public/localization/releases/2026.08.08-001/bs/date-time.json"
	},
	"/localization/releases/2026.08.08-001/bs/errors.json": {
		"type": "application/json",
		"etag": "\"27f-18EZx4t/vreaz56/oC5tWoPEQqw\"",
		"mtime": "2026-08-08T12:48:20.196Z",
		"size": 639,
		"path": "../public/localization/releases/2026.08.08-001/bs/errors.json"
	},
	"/localization/releases/2026.08.08-001/bs/foundations.json": {
		"type": "application/json",
		"etag": "\"1c9b-D46F3jFwXLHDdX1FEpayNfKMYIA\"",
		"mtime": "2026-08-08T12:48:20.196Z",
		"size": 7323,
		"path": "../public/localization/releases/2026.08.08-001/bs/foundations.json"
	},
	"/localization/releases/2026.08.08-001/bs/forms.json": {
		"type": "application/json",
		"etag": "\"1d4-RBWOflJUz9VA5uQGA1hbeMtgBNk\"",
		"mtime": "2026-08-08T12:48:20.196Z",
		"size": 468,
		"path": "../public/localization/releases/2026.08.08-001/bs/forms.json"
	},
	"/localization/releases/2026.08.08-001/bs/navigation.json": {
		"type": "application/json",
		"etag": "\"1ce-kiZ12VgTCeX/gaL/eC05wxvF/3A\"",
		"mtime": "2026-08-08T12:48:20.196Z",
		"size": 462,
		"path": "../public/localization/releases/2026.08.08-001/bs/navigation.json"
	},
	"/localization/releases/2026.08.08-001/bs/overview.json": {
		"type": "application/json",
		"etag": "\"480-OWXLbLg6jQ3osooiNhxxbUPJN0c\"",
		"mtime": "2026-08-08T12:48:20.196Z",
		"size": 1152,
		"path": "../public/localization/releases/2026.08.08-001/bs/overview.json"
	},
	"/localization/releases/2026.08.08-001/bs/patterns.json": {
		"type": "application/json",
		"etag": "\"4274-Pf6buD3p++FO/H4LjJIL5KxirPM\"",
		"mtime": "2026-08-08T12:48:20.196Z",
		"size": 17012,
		"path": "../public/localization/releases/2026.08.08-001/bs/patterns.json"
	},
	"/localization/releases/2026.08.08-001/bs/ui-library.json": {
		"type": "application/json",
		"etag": "\"4f0-HITgrhbHPDiOzBlmydMhkbSSFeA\"",
		"mtime": "2026-08-08T12:48:20.196Z",
		"size": 1264,
		"path": "../public/localization/releases/2026.08.08-001/bs/ui-library.json"
	},
	"/localization/releases/2026.08.08-001/bs/validation.json": {
		"type": "application/json",
		"etag": "\"1a6-6Zcrh6WSVizM9wLueKIC42nu5Eo\"",
		"mtime": "2026-08-08T12:48:20.196Z",
		"size": 422,
		"path": "../public/localization/releases/2026.08.08-001/bs/validation.json"
	},
	"/localization/releases/2026.08.08-002/de/accessibility.json": {
		"type": "application/json",
		"etag": "\"205-Qs3u9WJJ34TcDEGc8zLh4xCyHSQ\"",
		"mtime": "2026-08-08T12:48:20.250Z",
		"size": 517,
		"path": "../public/localization/releases/2026.08.08-002/de/accessibility.json"
	},
	"/localization/releases/2026.08.08-002/de/api-demo.json": {
		"type": "application/json",
		"etag": "\"300-ohK0vABk3v3G2hy79PxDx9KmZwU\"",
		"mtime": "2026-08-08T12:48:20.251Z",
		"size": 768,
		"path": "../public/localization/releases/2026.08.08-002/de/api-demo.json"
	},
	"/localization/releases/2026.08.08-002/de/admin.json": {
		"type": "application/json",
		"etag": "\"302b-Y7Jea7UOXrjKqXWWN4wFZj9cY1w\"",
		"mtime": "2026-08-08T12:48:20.251Z",
		"size": 12331,
		"path": "../public/localization/releases/2026.08.08-002/de/admin.json"
	},
	"/localization/releases/2026.08.08-002/de/architecture.json": {
		"type": "application/json",
		"etag": "\"4b8f-ENyXWcwZmo+EoEz4/TjZstOkQTM\"",
		"mtime": "2026-08-09T19:13:32.968Z",
		"size": 19343,
		"path": "../public/localization/releases/2026.08.08-002/de/architecture.json"
	},
	"/localization/releases/2026.08.08-002/de/common.json": {
		"type": "application/json",
		"etag": "\"8fa-CniZ2gra52ThoUNkAtm0m8hTzfA\"",
		"mtime": "2026-08-08T12:48:20.255Z",
		"size": 2298,
		"path": "../public/localization/releases/2026.08.08-002/de/common.json"
	},
	"/localization/releases/2026.08.08-002/de/components.json": {
		"type": "application/json",
		"etag": "\"4fe5-5KpuUT0avQzHvtJNPJmT2h32lRs\"",
		"mtime": "2026-08-08T12:48:20.255Z",
		"size": 20453,
		"path": "../public/localization/releases/2026.08.08-002/de/components.json"
	},
	"/localization/releases/2026.08.08-002/de/date-time.json": {
		"type": "application/json",
		"etag": "\"1c5-ljVE+B4cw9qNU1uvWfj11T7za8U\"",
		"mtime": "2026-08-08T12:48:20.255Z",
		"size": 453,
		"path": "../public/localization/releases/2026.08.08-002/de/date-time.json"
	},
	"/localization/releases/2026.08.08-002/de/errors.json": {
		"type": "application/json",
		"etag": "\"2d5-SKb2Eb6wOCSmNVUzruEGSMwRYoE\"",
		"mtime": "2026-08-08T12:48:20.255Z",
		"size": 725,
		"path": "../public/localization/releases/2026.08.08-002/de/errors.json"
	},
	"/localization/releases/2026.08.08-002/de/forms.json": {
		"type": "application/json",
		"etag": "\"1d3-0IRk3pjLCk7B27GEWn1VXs2n4CU\"",
		"mtime": "2026-08-08T12:48:20.255Z",
		"size": 467,
		"path": "../public/localization/releases/2026.08.08-002/de/forms.json"
	},
	"/localization/releases/2026.08.08-002/de/foundations.json": {
		"type": "application/json",
		"etag": "\"1e05-EZqpZYEoseLwbVUSkcSC3I/Qs/Q\"",
		"mtime": "2026-08-08T12:48:20.255Z",
		"size": 7685,
		"path": "../public/localization/releases/2026.08.08-002/de/foundations.json"
	},
	"/localization/releases/2026.08.08-002/de/overview.json": {
		"type": "application/json",
		"etag": "\"4a6-Z1YEN7vY7MZZ/Eh8YVx6VnvBZ8Q\"",
		"mtime": "2026-08-08T12:48:20.260Z",
		"size": 1190,
		"path": "../public/localization/releases/2026.08.08-002/de/overview.json"
	},
	"/localization/releases/2026.08.08-002/de/navigation.json": {
		"type": "application/json",
		"etag": "\"1e3-GPZ+ol9paFwBJ4w5xow7XVp1iRo\"",
		"mtime": "2026-08-08T12:48:20.255Z",
		"size": 483,
		"path": "../public/localization/releases/2026.08.08-002/de/navigation.json"
	},
	"/localization/releases/2026.08.08-002/de/patterns.json": {
		"type": "application/json",
		"etag": "\"28df-mCwilo8WoN3OdXyS5pOXgAqK6vU\"",
		"mtime": "2026-08-08T12:48:20.260Z",
		"size": 10463,
		"path": "../public/localization/releases/2026.08.08-002/de/patterns.json"
	},
	"/localization/releases/2026.08.08-002/de/ui-library.json": {
		"type": "application/json",
		"etag": "\"530-AxXXLAOaQWPoOR+OwRumrLyZl7g\"",
		"mtime": "2026-08-08T12:48:20.260Z",
		"size": 1328,
		"path": "../public/localization/releases/2026.08.08-002/de/ui-library.json"
	},
	"/localization/releases/2026.08.08-002/de/validation.json": {
		"type": "application/json",
		"etag": "\"1bf-/2OFNq4bZY2xwmi6/IHIixfi4Vc\"",
		"mtime": "2026-08-08T12:48:20.260Z",
		"size": 447,
		"path": "../public/localization/releases/2026.08.08-002/de/validation.json"
	},
	"/localization/releases/2026.08.08-001/de/accessibility.json": {
		"type": "application/json",
		"etag": "\"205-Qs3u9WJJ34TcDEGc8zLh4xCyHSQ\"",
		"mtime": "2026-08-08T12:48:20.196Z",
		"size": 517,
		"path": "../public/localization/releases/2026.08.08-001/de/accessibility.json"
	},
	"/localization/releases/2026.08.08-001/de/api-demo.json": {
		"type": "application/json",
		"etag": "\"300-ohK0vABk3v3G2hy79PxDx9KmZwU\"",
		"mtime": "2026-08-08T12:48:20.196Z",
		"size": 768,
		"path": "../public/localization/releases/2026.08.08-001/de/api-demo.json"
	},
	"/localization/releases/2026.08.08-001/de/architecture.json": {
		"type": "application/json",
		"etag": "\"4b8f-ENyXWcwZmo+EoEz4/TjZstOkQTM\"",
		"mtime": "2026-08-09T19:13:32.264Z",
		"size": 19343,
		"path": "../public/localization/releases/2026.08.08-001/de/architecture.json"
	},
	"/localization/releases/2026.08.08-001/de/admin.json": {
		"type": "application/json",
		"etag": "\"302b-Y7Jea7UOXrjKqXWWN4wFZj9cY1w\"",
		"mtime": "2026-08-08T12:48:20.196Z",
		"size": 12331,
		"path": "../public/localization/releases/2026.08.08-001/de/admin.json"
	},
	"/localization/releases/2026.08.08-001/de/common.json": {
		"type": "application/json",
		"etag": "\"992-3AqIZGhKAHhRMEJyZmpfRjFk6D0\"",
		"mtime": "2026-08-08T12:58:55.045Z",
		"size": 2450,
		"path": "../public/localization/releases/2026.08.08-001/de/common.json"
	},
	"/localization/releases/2026.08.08-001/de/date-time.json": {
		"type": "application/json",
		"etag": "\"1c5-ljVE+B4cw9qNU1uvWfj11T7za8U\"",
		"mtime": "2026-08-08T12:48:20.210Z",
		"size": 453,
		"path": "../public/localization/releases/2026.08.08-001/de/date-time.json"
	},
	"/localization/releases/2026.08.08-001/de/components.json": {
		"type": "application/json",
		"etag": "\"5182-zZmvTThVx6uZstyCqoJ0aqVI1x4\"",
		"mtime": "2026-08-08T12:48:20.210Z",
		"size": 20866,
		"path": "../public/localization/releases/2026.08.08-001/de/components.json"
	},
	"/localization/releases/2026.08.08-001/de/errors.json": {
		"type": "application/json",
		"etag": "\"2d5-SKb2Eb6wOCSmNVUzruEGSMwRYoE\"",
		"mtime": "2026-08-08T12:48:20.212Z",
		"size": 725,
		"path": "../public/localization/releases/2026.08.08-001/de/errors.json"
	},
	"/localization/releases/2026.08.08-001/de/forms.json": {
		"type": "application/json",
		"etag": "\"1d3-0IRk3pjLCk7B27GEWn1VXs2n4CU\"",
		"mtime": "2026-08-08T12:48:20.212Z",
		"size": 467,
		"path": "../public/localization/releases/2026.08.08-001/de/forms.json"
	},
	"/localization/releases/2026.08.08-001/de/foundations.json": {
		"type": "application/json",
		"etag": "\"1e05-EZqpZYEoseLwbVUSkcSC3I/Qs/Q\"",
		"mtime": "2026-08-08T12:48:20.212Z",
		"size": 7685,
		"path": "../public/localization/releases/2026.08.08-001/de/foundations.json"
	},
	"/localization/releases/2026.08.08-001/de/navigation.json": {
		"type": "application/json",
		"etag": "\"1e3-GPZ+ol9paFwBJ4w5xow7XVp1iRo\"",
		"mtime": "2026-08-08T12:48:20.212Z",
		"size": 483,
		"path": "../public/localization/releases/2026.08.08-001/de/navigation.json"
	},
	"/localization/releases/2026.08.08-001/de/overview.json": {
		"type": "application/json",
		"etag": "\"4a6-Z1YEN7vY7MZZ/Eh8YVx6VnvBZ8Q\"",
		"mtime": "2026-08-08T12:48:20.212Z",
		"size": 1190,
		"path": "../public/localization/releases/2026.08.08-001/de/overview.json"
	},
	"/localization/releases/2026.08.08-001/de/patterns.json": {
		"type": "application/json",
		"etag": "\"447b-Yt2M4ltcZ0kAEdyuDtUCGXyfMXE\"",
		"mtime": "2026-08-08T12:48:20.212Z",
		"size": 17531,
		"path": "../public/localization/releases/2026.08.08-001/de/patterns.json"
	},
	"/localization/releases/2026.08.08-001/de/ui-library.json": {
		"type": "application/json",
		"etag": "\"530-AxXXLAOaQWPoOR+OwRumrLyZl7g\"",
		"mtime": "2026-08-08T12:48:20.212Z",
		"size": 1328,
		"path": "../public/localization/releases/2026.08.08-001/de/ui-library.json"
	},
	"/localization/releases/2026.08.08-001/de/validation.json": {
		"type": "application/json",
		"etag": "\"1bf-/2OFNq4bZY2xwmi6/IHIixfi4Vc\"",
		"mtime": "2026-08-08T12:48:20.219Z",
		"size": 447,
		"path": "../public/localization/releases/2026.08.08-001/de/validation.json"
	},
	"/localization/releases/2026.08.08-001/en/accessibility.json": {
		"type": "application/json",
		"etag": "\"1e3-hUhZYgI3xW3i/zTvUS17XUC9Kj0\"",
		"mtime": "2026-08-08T12:48:20.220Z",
		"size": 483,
		"path": "../public/localization/releases/2026.08.08-001/en/accessibility.json"
	},
	"/localization/releases/2026.08.08-001/en/admin.json": {
		"type": "application/json",
		"etag": "\"2c34-7r5OyTIZL4nFqYoELYuwgUzLSlQ\"",
		"mtime": "2026-08-08T12:48:20.221Z",
		"size": 11316,
		"path": "../public/localization/releases/2026.08.08-001/en/admin.json"
	},
	"/localization/releases/2026.08.08-001/en/api-demo.json": {
		"type": "application/json",
		"etag": "\"2fe-dDLAgN4/Ii8WIJBT8qtNtpiC5Vs\"",
		"mtime": "2026-08-08T12:48:20.221Z",
		"size": 766,
		"path": "../public/localization/releases/2026.08.08-001/en/api-demo.json"
	},
	"/localization/releases/2026.08.08-001/en/architecture.json": {
		"type": "application/json",
		"etag": "\"4643-oW+O13mlZW4JgFRg7+7VBawJksc\"",
		"mtime": "2026-08-09T19:13:32.491Z",
		"size": 17987,
		"path": "../public/localization/releases/2026.08.08-001/en/architecture.json"
	},
	"/localization/releases/2026.08.08-001/en/common.json": {
		"type": "application/json",
		"etag": "\"8d8-hXMFIc5Wzz8ql5hN6odHuUjIlAE\"",
		"mtime": "2026-08-08T12:58:55.040Z",
		"size": 2264,
		"path": "../public/localization/releases/2026.08.08-001/en/common.json"
	},
	"/localization/releases/2026.08.08-001/en/components.json": {
		"type": "application/json",
		"etag": "\"48d1-vgqqFhB6ereUca3vACauHqPW6YA\"",
		"mtime": "2026-08-08T12:48:20.221Z",
		"size": 18641,
		"path": "../public/localization/releases/2026.08.08-001/en/components.json"
	},
	"/localization/releases/2026.08.08-001/en/date-time.json": {
		"type": "application/json",
		"etag": "\"1bd-PgkIsYDNYmoa0J6K6SkyEvQkLYM\"",
		"mtime": "2026-08-08T12:48:20.228Z",
		"size": 445,
		"path": "../public/localization/releases/2026.08.08-001/en/date-time.json"
	},
	"/localization/releases/2026.08.08-001/en/errors.json": {
		"type": "application/json",
		"etag": "\"298-RUO5zkotdWPSLfV6XLItPHHUZrM\"",
		"mtime": "2026-08-08T12:48:20.228Z",
		"size": 664,
		"path": "../public/localization/releases/2026.08.08-001/en/errors.json"
	},
	"/localization/releases/2026.08.08-001/en/forms.json": {
		"type": "application/json",
		"etag": "\"1ce-NcJF29EVVzOd6ocuNAU4JMWNsjk\"",
		"mtime": "2026-08-08T12:48:20.228Z",
		"size": 462,
		"path": "../public/localization/releases/2026.08.08-001/en/forms.json"
	},
	"/localization/releases/2026.08.08-001/en/foundations.json": {
		"type": "application/json",
		"etag": "\"1bea-j3fpT2nL21NYQGWPEIrT+LuzKVM\"",
		"mtime": "2026-08-08T12:48:20.230Z",
		"size": 7146,
		"path": "../public/localization/releases/2026.08.08-001/en/foundations.json"
	},
	"/localization/releases/2026.08.08-001/en/navigation.json": {
		"type": "application/json",
		"etag": "\"1cd-kw9E7U/SgozcqUOtevXLG5mLq68\"",
		"mtime": "2026-08-08T12:48:20.230Z",
		"size": 461,
		"path": "../public/localization/releases/2026.08.08-001/en/navigation.json"
	},
	"/localization/releases/2026.08.08-001/en/overview.json": {
		"type": "application/json",
		"etag": "\"480-Vo3AFqh7pJUCHEDWGHDW8Fq7P9w\"",
		"mtime": "2026-08-08T12:48:20.230Z",
		"size": 1152,
		"path": "../public/localization/releases/2026.08.08-001/en/overview.json"
	},
	"/localization/releases/2026.08.08-001/en/patterns.json": {
		"type": "application/json",
		"etag": "\"3dfb-WzLyVUv1S67gu9pwM/yYl+nFKAA\"",
		"mtime": "2026-08-08T12:48:20.230Z",
		"size": 15867,
		"path": "../public/localization/releases/2026.08.08-001/en/patterns.json"
	},
	"/localization/releases/2026.08.08-001/en/ui-library.json": {
		"type": "application/json",
		"etag": "\"4d2-6ed4jXePT5Vwn9314/ifbZznLqo\"",
		"mtime": "2026-08-08T12:48:20.230Z",
		"size": 1234,
		"path": "../public/localization/releases/2026.08.08-001/en/ui-library.json"
	},
	"/localization/releases/2026.08.08-004/bs/accessibility.json": {
		"type": "application/json",
		"etag": "\"1ef-Wj59w6MkH4ykd5eCVBtLkYlLivc\"",
		"mtime": "2026-08-08T12:59:47.583Z",
		"size": 495,
		"path": "../public/localization/releases/2026.08.08-004/bs/accessibility.json"
	},
	"/localization/releases/2026.08.08-004/bs/admin.json": {
		"type": "application/json",
		"etag": "\"2c41-/U+PquL8equwssHfBPHV18axMt8\"",
		"mtime": "2026-08-08T12:59:47.583Z",
		"size": 11329,
		"path": "../public/localization/releases/2026.08.08-004/bs/admin.json"
	},
	"/localization/releases/2026.08.08-001/en/validation.json": {
		"type": "application/json",
		"etag": "\"18e-/fU3CEYp2pOxYJoVWHn4pw4jZ9M\"",
		"mtime": "2026-08-08T12:48:20.230Z",
		"size": 398,
		"path": "../public/localization/releases/2026.08.08-001/en/validation.json"
	},
	"/localization/releases/2026.08.08-004/bs/api-demo.json": {
		"type": "application/json",
		"etag": "\"301-IG1Zj4GVmrPpv3JosO69nHwYkiQ\"",
		"mtime": "2026-08-08T12:59:47.583Z",
		"size": 769,
		"path": "../public/localization/releases/2026.08.08-004/bs/api-demo.json"
	},
	"/localization/releases/2026.08.08-004/bs/components.json": {
		"type": "application/json",
		"etag": "\"49bc-L4PkAAkd2UoHHfhitmLkVLixt50\"",
		"mtime": "2026-08-08T12:59:47.623Z",
		"size": 18876,
		"path": "../public/localization/releases/2026.08.08-004/bs/components.json"
	},
	"/localization/releases/2026.08.08-004/bs/common.json": {
		"type": "application/json",
		"etag": "\"9fe-0PtGpDA18SvknaIE7PLDt145a1c\"",
		"mtime": "2026-08-08T12:59:47.623Z",
		"size": 2558,
		"path": "../public/localization/releases/2026.08.08-004/bs/common.json"
	},
	"/localization/releases/2026.08.08-004/bs/architecture.json": {
		"type": "application/json",
		"etag": "\"45ce-+kLYYzMzz9ZL1ISTj0iDbLqmhiM\"",
		"mtime": "2026-08-09T19:13:34.016Z",
		"size": 17870,
		"path": "../public/localization/releases/2026.08.08-004/bs/architecture.json"
	},
	"/localization/releases/2026.08.08-004/bs/date-time.json": {
		"type": "application/json",
		"etag": "\"1f7-VDEgdR/eeV/eEFYXBUZMDUNfDVA\"",
		"mtime": "2026-08-08T12:59:47.633Z",
		"size": 503,
		"path": "../public/localization/releases/2026.08.08-004/bs/date-time.json"
	},
	"/localization/releases/2026.08.08-004/bs/errors.json": {
		"type": "application/json",
		"etag": "\"273-fX1wyRD3zEzzwr8etE9/ZHMdM04\"",
		"mtime": "2026-08-08T12:59:47.639Z",
		"size": 627,
		"path": "../public/localization/releases/2026.08.08-004/bs/errors.json"
	},
	"/localization/releases/2026.08.08-004/bs/forms.json": {
		"type": "application/json",
		"etag": "\"1c0-KRfMj0hjIoYDSxg3sdSsLNKNpsg\"",
		"mtime": "2026-08-08T12:59:47.648Z",
		"size": 448,
		"path": "../public/localization/releases/2026.08.08-004/bs/forms.json"
	},
	"/localization/releases/2026.08.08-004/bs/foundations.json": {
		"type": "application/json",
		"etag": "\"1c01-U3V+/WMQ9tGMKhAH/4HzBfseI/8\"",
		"mtime": "2026-08-08T12:59:47.648Z",
		"size": 7169,
		"path": "../public/localization/releases/2026.08.08-004/bs/foundations.json"
	},
	"/localization/releases/2026.08.08-004/bs/navigation.json": {
		"type": "application/json",
		"etag": "\"1bd-CiPPnfO+dFrFS9ahHFXgJvCHJpU\"",
		"mtime": "2026-08-08T12:59:47.664Z",
		"size": 445,
		"path": "../public/localization/releases/2026.08.08-004/bs/navigation.json"
	},
	"/localization/releases/2026.08.08-004/bs/overview.json": {
		"type": "application/json",
		"etag": "\"45e-DT8mBwMPxCSiXL6ATccMzhL+ENQ\"",
		"mtime": "2026-08-08T12:59:47.667Z",
		"size": 1118,
		"path": "../public/localization/releases/2026.08.08-004/bs/overview.json"
	},
	"/localization/releases/2026.08.08-004/bs/patterns.json": {
		"type": "application/json",
		"etag": "\"40da-ixsVfwbnB/5j98ffWpVnAQkERmA\"",
		"mtime": "2026-08-08T12:59:47.670Z",
		"size": 16602,
		"path": "../public/localization/releases/2026.08.08-004/bs/patterns.json"
	},
	"/localization/releases/2026.08.08-004/bs/validation.json": {
		"type": "application/json",
		"etag": "\"19e-QU5r8YgEErVYnp0a/mRgL+oSyqI\"",
		"mtime": "2026-08-08T12:59:47.683Z",
		"size": 414,
		"path": "../public/localization/releases/2026.08.08-004/bs/validation.json"
	},
	"/localization/releases/2026.08.08-004/bs/ui-library.json": {
		"type": "application/json",
		"etag": "\"4d6-QxNEAEbqYlrehJmwd7134WOAO04\"",
		"mtime": "2026-08-08T12:59:47.680Z",
		"size": 1238,
		"path": "../public/localization/releases/2026.08.08-004/bs/ui-library.json"
	},
	"/localization/releases/2026.08.08-004/de/accessibility.json": {
		"type": "application/json",
		"etag": "\"1f4-gYs54N7kdwKWazynf1ICGLMWtOI\"",
		"mtime": "2026-08-08T12:59:47.712Z",
		"size": 500,
		"path": "../public/localization/releases/2026.08.08-004/de/accessibility.json"
	},
	"/localization/releases/2026.08.08-004/de/admin.json": {
		"type": "application/json",
		"etag": "\"2ef6-sf66/NFWah+wnr1+bjrX5IPuQHM\"",
		"mtime": "2026-08-08T12:59:47.716Z",
		"size": 12022,
		"path": "../public/localization/releases/2026.08.08-004/de/admin.json"
	},
	"/localization/releases/2026.08.08-004/de/api-demo.json": {
		"type": "application/json",
		"etag": "\"2e4-SFmLbf++K4309+hj2g3hD7+wHNQ\"",
		"mtime": "2026-08-08T12:59:47.716Z",
		"size": 740,
		"path": "../public/localization/releases/2026.08.08-004/de/api-demo.json"
	},
	"/localization/releases/2026.08.08-004/de/architecture.json": {
		"type": "application/json",
		"etag": "\"49a0-bLlaEteKJwGGmQcCY8zb8uvRNcA\"",
		"mtime": "2026-08-09T19:13:34.227Z",
		"size": 18848,
		"path": "../public/localization/releases/2026.08.08-004/de/architecture.json"
	},
	"/localization/releases/2026.08.08-004/de/common.json": {
		"type": "application/json",
		"etag": "\"a92-HH/Fpfyb7tRaWxf7+QukBYVvd6o\"",
		"mtime": "2026-08-08T12:59:47.721Z",
		"size": 2706,
		"path": "../public/localization/releases/2026.08.08-004/de/common.json"
	},
	"/localization/releases/2026.08.08-004/de/components.json": {
		"type": "application/json",
		"etag": "\"4fed-egexhvZtNP2HtOLOvt0rGEBYWYI\"",
		"mtime": "2026-08-08T12:59:47.721Z",
		"size": 20461,
		"path": "../public/localization/releases/2026.08.08-004/de/components.json"
	},
	"/localization/releases/2026.08.08-004/de/date-time.json": {
		"type": "application/json",
		"etag": "\"1b8-/EEAgraF5OB7D3pFEKJG8DfzSOo\"",
		"mtime": "2026-08-08T12:59:47.737Z",
		"size": 440,
		"path": "../public/localization/releases/2026.08.08-004/de/date-time.json"
	},
	"/localization/releases/2026.08.08-004/de/errors.json": {
		"type": "application/json",
		"etag": "\"2c9-mq7WGv+Moe6693TB+xf2lJtPb+U\"",
		"mtime": "2026-08-08T12:59:47.745Z",
		"size": 713,
		"path": "../public/localization/releases/2026.08.08-004/de/errors.json"
	},
	"/localization/releases/2026.08.08-004/de/forms.json": {
		"type": "application/json",
		"etag": "\"1bf-qpL3QIGOn+GR7NVUhYiIZsr7epE\"",
		"mtime": "2026-08-08T12:59:47.745Z",
		"size": 447,
		"path": "../public/localization/releases/2026.08.08-004/de/forms.json"
	},
	"/localization/releases/2026.08.08-004/de/foundations.json": {
		"type": "application/json",
		"etag": "\"1d6b-Y2PUxAcCdsrMsmn5EnUscP0Qsso\"",
		"mtime": "2026-08-08T12:59:47.749Z",
		"size": 7531,
		"path": "../public/localization/releases/2026.08.08-004/de/foundations.json"
	},
	"/localization/releases/2026.08.08-004/de/navigation.json": {
		"type": "application/json",
		"etag": "\"1d2-1uZDXi3/XiAhf4QJov5gZzFv0sY\"",
		"mtime": "2026-08-08T12:59:47.749Z",
		"size": 466,
		"path": "../public/localization/releases/2026.08.08-004/de/navigation.json"
	},
	"/localization/releases/2026.08.08-004/de/overview.json": {
		"type": "application/json",
		"etag": "\"484-V/z9I6f3mwRF+zEcA0s9W6qdDbs\"",
		"mtime": "2026-08-08T12:59:47.761Z",
		"size": 1156,
		"path": "../public/localization/releases/2026.08.08-004/de/overview.json"
	},
	"/localization/releases/2026.08.08-004/de/patterns.json": {
		"type": "application/json",
		"etag": "\"42e1-zjwspY82N0+bBVum9o3MUrq6FkY\"",
		"mtime": "2026-08-08T12:59:47.767Z",
		"size": 17121,
		"path": "../public/localization/releases/2026.08.08-004/de/patterns.json"
	},
	"/localization/releases/2026.08.08-004/de/ui-library.json": {
		"type": "application/json",
		"etag": "\"516-gWf07IeU7iXqkIQNx3UlmbNse/Q\"",
		"mtime": "2026-08-08T12:59:47.769Z",
		"size": 1302,
		"path": "../public/localization/releases/2026.08.08-004/de/ui-library.json"
	},
	"/localization/releases/2026.08.08-004/de/validation.json": {
		"type": "application/json",
		"etag": "\"1b7-5XOa3uDYEYMQnRxhd6ztLodAeRY\"",
		"mtime": "2026-08-08T12:59:47.769Z",
		"size": 439,
		"path": "../public/localization/releases/2026.08.08-004/de/validation.json"
	},
	"/localization/releases/2026.08.08-004/en/accessibility.json": {
		"type": "application/json",
		"etag": "\"1d2-LC1IxcO99/IHO/2PSEVdHKFmrn0\"",
		"mtime": "2026-08-08T12:59:47.785Z",
		"size": 466,
		"path": "../public/localization/releases/2026.08.08-004/en/accessibility.json"
	},
	"/localization/releases/2026.08.08-004/en/admin.json": {
		"type": "application/json",
		"etag": "\"2aff-aS5+rEK1m+/25Lu+5JZ4zGAIYSk\"",
		"mtime": "2026-08-08T12:59:47.785Z",
		"size": 11007,
		"path": "../public/localization/releases/2026.08.08-004/en/admin.json"
	},
	"/localization/releases/2026.08.08-004/en/api-demo.json": {
		"type": "application/json",
		"etag": "\"2e2-yrtYWNrFxkK8vFEAM5Hc7kpCj3M\"",
		"mtime": "2026-08-08T12:59:47.791Z",
		"size": 738,
		"path": "../public/localization/releases/2026.08.08-004/en/api-demo.json"
	},
	"/localization/releases/2026.08.08-004/en/architecture.json": {
		"type": "application/json",
		"etag": "\"445c-TNYsP6IAV0UfePytPFUwvl8asxc\"",
		"mtime": "2026-08-09T19:13:34.429Z",
		"size": 17500,
		"path": "../public/localization/releases/2026.08.08-004/en/architecture.json"
	},
	"/localization/releases/2026.08.08-004/en/common.json": {
		"type": "application/json",
		"etag": "\"9c3-WdmLOreL5fqT4LroXklS1PYUWGs\"",
		"mtime": "2026-08-08T12:59:47.799Z",
		"size": 2499,
		"path": "../public/localization/releases/2026.08.08-004/en/common.json"
	},
	"/localization/releases/2026.08.08-004/en/date-time.json": {
		"type": "application/json",
		"etag": "\"1b0-zfXbJaXtNMmvFC8BwHaTKJawIss\"",
		"mtime": "2026-08-08T12:59:47.805Z",
		"size": 432,
		"path": "../public/localization/releases/2026.08.08-004/en/date-time.json"
	},
	"/localization/releases/2026.08.08-004/en/components.json": {
		"type": "application/json",
		"etag": "\"473c-NzTFdGarsvjj46Fw4+JWtS4oxBI\"",
		"mtime": "2026-08-08T12:59:47.805Z",
		"size": 18236,
		"path": "../public/localization/releases/2026.08.08-004/en/components.json"
	},
	"/localization/releases/2026.08.08-004/en/errors.json": {
		"type": "application/json",
		"etag": "\"28c-CA24+brg16Vd+rZwIkDkIj0qLl4\"",
		"mtime": "2026-08-08T12:59:47.810Z",
		"size": 652,
		"path": "../public/localization/releases/2026.08.08-004/en/errors.json"
	},
	"/localization/releases/2026.08.08-004/en/forms.json": {
		"type": "application/json",
		"etag": "\"1ba-unmbWRWUyV2lTXfKxySiMJHS3G0\"",
		"mtime": "2026-08-08T12:59:47.810Z",
		"size": 442,
		"path": "../public/localization/releases/2026.08.08-004/en/forms.json"
	},
	"/localization/releases/2026.08.08-004/en/foundations.json": {
		"type": "application/json",
		"etag": "\"1b50-hkMgVTP6278k1iJsIAzvI/Pnv2s\"",
		"mtime": "2026-08-08T12:59:47.818Z",
		"size": 6992,
		"path": "../public/localization/releases/2026.08.08-004/en/foundations.json"
	},
	"/localization/releases/2026.08.08-004/en/navigation.json": {
		"type": "application/json",
		"etag": "\"1bc-t++DDJ2BQ0oswk5P8zllZtp1Fus\"",
		"mtime": "2026-08-08T12:59:47.826Z",
		"size": 444,
		"path": "../public/localization/releases/2026.08.08-004/en/navigation.json"
	},
	"/localization/releases/2026.08.08-004/en/overview.json": {
		"type": "application/json",
		"etag": "\"45e-OtXlHSzL9VzHp1DNYA/q6GgaqX0\"",
		"mtime": "2026-08-08T12:59:47.826Z",
		"size": 1118,
		"path": "../public/localization/releases/2026.08.08-004/en/overview.json"
	},
	"/localization/releases/2026.08.08-004/en/patterns.json": {
		"type": "application/json",
		"etag": "\"3c61-rdHF4nu1CJUigg3rUjMSyZlrnj0\"",
		"mtime": "2026-08-08T12:59:47.832Z",
		"size": 15457,
		"path": "../public/localization/releases/2026.08.08-004/en/patterns.json"
	},
	"/localization/releases/2026.08.08-004/en/ui-library.json": {
		"type": "application/json",
		"etag": "\"4b8-SOmMpZZ16AzMDTZscXy6uMnUzTs\"",
		"mtime": "2026-08-08T12:59:47.834Z",
		"size": 1208,
		"path": "../public/localization/releases/2026.08.08-004/en/ui-library.json"
	},
	"/localization/releases/2026.08.08-004/en/validation.json": {
		"type": "application/json",
		"etag": "\"186-mcRu3qpNTZO9ggDFyVR8kAX3XFw\"",
		"mtime": "2026-08-08T12:59:47.834Z",
		"size": 390,
		"path": "../public/localization/releases/2026.08.08-004/en/validation.json"
	},
	"/localization/releases/2026.08.09-001/bs/accessibility.json": {
		"type": "application/json",
		"etag": "\"1ef-Wj59w6MkH4ykd5eCVBtLkYlLivc\"",
		"mtime": "2026-08-09T17:05:53.563Z",
		"size": 495,
		"path": "../public/localization/releases/2026.08.09-001/bs/accessibility.json"
	},
	"/localization/releases/2026.08.09-001/bs/admin.json": {
		"type": "application/json",
		"etag": "\"2b25-pawiWfR4B0Pp7fq0QJFka6Y9rG0\"",
		"mtime": "2026-08-09T17:05:53.565Z",
		"size": 11045,
		"path": "../public/localization/releases/2026.08.09-001/bs/admin.json"
	},
	"/localization/releases/2026.08.09-001/bs/api-demo.json": {
		"type": "application/json",
		"etag": "\"301-IG1Zj4GVmrPpv3JosO69nHwYkiQ\"",
		"mtime": "2026-08-09T17:05:53.568Z",
		"size": 769,
		"path": "../public/localization/releases/2026.08.09-001/bs/api-demo.json"
	},
	"/localization/releases/2026.08.09-001/bs/architecture.json": {
		"type": "application/json",
		"etag": "\"502f-dgC8IYXAhVLK3GiyW40A8t2XmlE\"",
		"mtime": "2026-08-09T19:13:34.711Z",
		"size": 20527,
		"path": "../public/localization/releases/2026.08.09-001/bs/architecture.json"
	},
	"/localization/releases/2026.08.09-001/bs/common.json": {
		"type": "application/json",
		"etag": "\"9fe-0PtGpDA18SvknaIE7PLDt145a1c\"",
		"mtime": "2026-08-09T17:05:53.575Z",
		"size": 2558,
		"path": "../public/localization/releases/2026.08.09-001/bs/common.json"
	},
	"/localization/releases/2026.08.09-001/bs/components.json": {
		"type": "application/json",
		"etag": "\"49bc-L4PkAAkd2UoHHfhitmLkVLixt50\"",
		"mtime": "2026-08-09T17:05:53.578Z",
		"size": 18876,
		"path": "../public/localization/releases/2026.08.09-001/bs/components.json"
	},
	"/localization/releases/2026.08.09-001/bs/errors.json": {
		"type": "application/json",
		"etag": "\"273-fX1wyRD3zEzzwr8etE9/ZHMdM04\"",
		"mtime": "2026-08-09T17:05:53.583Z",
		"size": 627,
		"path": "../public/localization/releases/2026.08.09-001/bs/errors.json"
	},
	"/localization/releases/2026.08.09-001/bs/foundations.json": {
		"type": "application/json",
		"etag": "\"1c01-U3V+/WMQ9tGMKhAH/4HzBfseI/8\"",
		"mtime": "2026-08-09T17:05:53.586Z",
		"size": 7169,
		"path": "../public/localization/releases/2026.08.09-001/bs/foundations.json"
	},
	"/localization/releases/2026.08.09-001/bs/forms.json": {
		"type": "application/json",
		"etag": "\"1c0-KRfMj0hjIoYDSxg3sdSsLNKNpsg\"",
		"mtime": "2026-08-09T17:05:53.585Z",
		"size": 448,
		"path": "../public/localization/releases/2026.08.09-001/bs/forms.json"
	},
	"/localization/releases/2026.08.09-001/bs/navigation.json": {
		"type": "application/json",
		"etag": "\"1bd-CiPPnfO+dFrFS9ahHFXgJvCHJpU\"",
		"mtime": "2026-08-09T17:05:53.588Z",
		"size": 445,
		"path": "../public/localization/releases/2026.08.09-001/bs/navigation.json"
	},
	"/localization/releases/2026.08.09-001/bs/date-time.json": {
		"type": "application/json",
		"etag": "\"1f7-VDEgdR/eeV/eEFYXBUZMDUNfDVA\"",
		"mtime": "2026-08-09T17:05:53.581Z",
		"size": 503,
		"path": "../public/localization/releases/2026.08.09-001/bs/date-time.json"
	},
	"/localization/releases/2026.08.09-001/bs/overview.json": {
		"type": "application/json",
		"etag": "\"45e-DT8mBwMPxCSiXL6ATccMzhL+ENQ\"",
		"mtime": "2026-08-09T17:05:53.589Z",
		"size": 1118,
		"path": "../public/localization/releases/2026.08.09-001/bs/overview.json"
	},
	"/localization/releases/2026.08.09-001/bs/patterns.json": {
		"type": "application/json",
		"etag": "\"40da-ixsVfwbnB/5j98ffWpVnAQkERmA\"",
		"mtime": "2026-08-09T17:05:53.591Z",
		"size": 16602,
		"path": "../public/localization/releases/2026.08.09-001/bs/patterns.json"
	},
	"/localization/releases/2026.08.09-001/bs/registry.json": {
		"type": "application/json",
		"etag": "\"be6-0LtQCCIQ5YK9opVhUYRih3j/HOA\"",
		"mtime": "2026-08-09T20:47:30.532Z",
		"size": 3046,
		"path": "../public/localization/releases/2026.08.09-001/bs/registry.json"
	},
	"/localization/releases/2026.08.09-001/bs/validation.json": {
		"type": "application/json",
		"etag": "\"19e-QU5r8YgEErVYnp0a/mRgL+oSyqI\"",
		"mtime": "2026-08-09T17:05:53.596Z",
		"size": 414,
		"path": "../public/localization/releases/2026.08.09-001/bs/validation.json"
	},
	"/localization/releases/2026.08.09-001/bs/ui-library.json": {
		"type": "application/json",
		"etag": "\"4d6-QxNEAEbqYlrehJmwd7134WOAO04\"",
		"mtime": "2026-08-09T17:05:53.595Z",
		"size": 1238,
		"path": "../public/localization/releases/2026.08.09-001/bs/ui-library.json"
	},
	"/localization/releases/2026.08.09-001/de/accessibility.json": {
		"type": "application/json",
		"etag": "\"1f4-gYs54N7kdwKWazynf1ICGLMWtOI\"",
		"mtime": "2026-08-09T17:05:53.628Z",
		"size": 500,
		"path": "../public/localization/releases/2026.08.09-001/de/accessibility.json"
	},
	"/localization/releases/2026.08.09-001/de/admin.json": {
		"type": "application/json",
		"etag": "\"2d18-aaQB/cHlqgu+pf2nha7GFkqyHcU\"",
		"mtime": "2026-08-09T17:05:53.631Z",
		"size": 11544,
		"path": "../public/localization/releases/2026.08.09-001/de/admin.json"
	},
	"/localization/releases/2026.08.09-001/de/common.json": {
		"type": "application/json",
		"etag": "\"a92-HH/Fpfyb7tRaWxf7+QukBYVvd6o\"",
		"mtime": "2026-08-09T17:05:53.638Z",
		"size": 2706,
		"path": "../public/localization/releases/2026.08.09-001/de/common.json"
	},
	"/localization/releases/2026.08.09-001/de/architecture.json": {
		"type": "application/json",
		"etag": "\"5484-pSqxgLuPk/FLQJnk5OUEyHDJ6jQ\"",
		"mtime": "2026-08-09T19:13:34.917Z",
		"size": 21636,
		"path": "../public/localization/releases/2026.08.09-001/de/architecture.json"
	},
	"/localization/releases/2026.08.09-001/de/api-demo.json": {
		"type": "application/json",
		"etag": "\"2e4-SFmLbf++K4309+hj2g3hD7+wHNQ\"",
		"mtime": "2026-08-09T17:05:53.633Z",
		"size": 740,
		"path": "../public/localization/releases/2026.08.09-001/de/api-demo.json"
	},
	"/localization/releases/2026.08.09-001/de/date-time.json": {
		"type": "application/json",
		"etag": "\"1b8-/EEAgraF5OB7D3pFEKJG8DfzSOo\"",
		"mtime": "2026-08-09T17:05:53.641Z",
		"size": 440,
		"path": "../public/localization/releases/2026.08.09-001/de/date-time.json"
	},
	"/localization/releases/2026.08.09-001/de/components.json": {
		"type": "application/json",
		"etag": "\"4fed-egexhvZtNP2HtOLOvt0rGEBYWYI\"",
		"mtime": "2026-08-09T17:05:53.640Z",
		"size": 20461,
		"path": "../public/localization/releases/2026.08.09-001/de/components.json"
	},
	"/localization/releases/2026.08.09-001/de/errors.json": {
		"type": "application/json",
		"etag": "\"2c9-mq7WGv+Moe6693TB+xf2lJtPb+U\"",
		"mtime": "2026-08-09T17:05:53.642Z",
		"size": 713,
		"path": "../public/localization/releases/2026.08.09-001/de/errors.json"
	},
	"/localization/releases/2026.08.09-001/de/forms.json": {
		"type": "application/json",
		"etag": "\"1bf-qpL3QIGOn+GR7NVUhYiIZsr7epE\"",
		"mtime": "2026-08-09T17:05:53.644Z",
		"size": 447,
		"path": "../public/localization/releases/2026.08.09-001/de/forms.json"
	},
	"/localization/releases/2026.08.09-001/de/navigation.json": {
		"type": "application/json",
		"etag": "\"1d2-1uZDXi3/XiAhf4QJov5gZzFv0sY\"",
		"mtime": "2026-08-09T17:05:53.647Z",
		"size": 466,
		"path": "../public/localization/releases/2026.08.09-001/de/navigation.json"
	},
	"/localization/releases/2026.08.09-001/de/foundations.json": {
		"type": "application/json",
		"etag": "\"1d6b-Y2PUxAcCdsrMsmn5EnUscP0Qsso\"",
		"mtime": "2026-08-09T17:05:53.645Z",
		"size": 7531,
		"path": "../public/localization/releases/2026.08.09-001/de/foundations.json"
	},
	"/localization/releases/2026.08.09-001/de/overview.json": {
		"type": "application/json",
		"etag": "\"484-V/z9I6f3mwRF+zEcA0s9W6qdDbs\"",
		"mtime": "2026-08-09T17:05:53.648Z",
		"size": 1156,
		"path": "../public/localization/releases/2026.08.09-001/de/overview.json"
	},
	"/localization/releases/2026.08.09-001/de/patterns.json": {
		"type": "application/json",
		"etag": "\"42e1-zjwspY82N0+bBVum9o3MUrq6FkY\"",
		"mtime": "2026-08-09T17:05:53.650Z",
		"size": 17121,
		"path": "../public/localization/releases/2026.08.09-001/de/patterns.json"
	},
	"/localization/releases/2026.08.09-001/de/registry.json": {
		"type": "application/json",
		"etag": "\"c74-ej/s3OSASd8He+Spgx/jATz/iws\"",
		"mtime": "2026-08-09T17:05:53.651Z",
		"size": 3188,
		"path": "../public/localization/releases/2026.08.09-001/de/registry.json"
	},
	"/localization/releases/2026.08.09-001/de/validation.json": {
		"type": "application/json",
		"etag": "\"1b7-5XOa3uDYEYMQnRxhd6ztLodAeRY\"",
		"mtime": "2026-08-09T17:05:53.654Z",
		"size": 439,
		"path": "../public/localization/releases/2026.08.09-001/de/validation.json"
	},
	"/localization/releases/2026.08.09-001/de/ui-library.json": {
		"type": "application/json",
		"etag": "\"516-gWf07IeU7iXqkIQNx3UlmbNse/Q\"",
		"mtime": "2026-08-09T17:05:53.652Z",
		"size": 1302,
		"path": "../public/localization/releases/2026.08.09-001/de/ui-library.json"
	},
	"/localization/releases/2026.08.06-001/de/accessibility.json": {
		"type": "application/json",
		"etag": "\"205-Qs3u9WJJ34TcDEGc8zLh4xCyHSQ\"",
		"mtime": "2026-08-08T12:48:20.088Z",
		"size": 517,
		"path": "../public/localization/releases/2026.08.06-001/de/accessibility.json"
	},
	"/localization/releases/2026.08.06-001/de/api-demo.json": {
		"type": "application/json",
		"etag": "\"300-ohK0vABk3v3G2hy79PxDx9KmZwU\"",
		"mtime": "2026-08-08T12:48:20.101Z",
		"size": 768,
		"path": "../public/localization/releases/2026.08.06-001/de/api-demo.json"
	},
	"/localization/releases/2026.08.06-001/de/architecture.json": {
		"type": "application/json",
		"etag": "\"4cc8-K29t/WnS4UFYW+QYWMG8YWf+lbs\"",
		"mtime": "2026-08-09T19:13:30.715Z",
		"size": 19656,
		"path": "../public/localization/releases/2026.08.06-001/de/architecture.json"
	},
	"/localization/releases/2026.08.06-001/de/common.json": {
		"type": "application/json",
		"etag": "\"8fa-CniZ2gra52ThoUNkAtm0m8hTzfA\"",
		"mtime": "2026-08-08T12:48:20.106Z",
		"size": 2298,
		"path": "../public/localization/releases/2026.08.06-001/de/common.json"
	},
	"/localization/releases/2026.08.06-001/de/admin.json": {
		"type": "application/json",
		"etag": "\"2ff3-OQ3AQXooT0rrpi9t8rDC43GpoM8\"",
		"mtime": "2026-08-08T12:48:20.088Z",
		"size": 12275,
		"path": "../public/localization/releases/2026.08.06-001/de/admin.json"
	},
	"/localization/releases/2026.08.06-001/de/docs.json": {
		"type": "application/json",
		"etag": "\"4-PJV1NTRWRdznGQuF6xCznalrJRg\"",
		"mtime": "2026-08-08T12:48:20.106Z",
		"size": 4,
		"path": "../public/localization/releases/2026.08.06-001/de/docs.json"
	},
	"/localization/releases/2026.08.06-001/de/errors.json": {
		"type": "application/json",
		"etag": "\"2d5-SKb2Eb6wOCSmNVUzruEGSMwRYoE\"",
		"mtime": "2026-08-08T12:48:20.106Z",
		"size": 725,
		"path": "../public/localization/releases/2026.08.06-001/de/errors.json"
	},
	"/localization/releases/2026.08.06-001/de/date-time.json": {
		"type": "application/json",
		"etag": "\"1c5-ljVE+B4cw9qNU1uvWfj11T7za8U\"",
		"mtime": "2026-08-08T12:48:20.106Z",
		"size": 453,
		"path": "../public/localization/releases/2026.08.06-001/de/date-time.json"
	},
	"/localization/releases/2026.08.06-001/de/components.json": {
		"type": "application/json",
		"etag": "\"50da-ESOcr9LuDITDo2k/ymZADQuSHKg\"",
		"mtime": "2026-08-08T12:48:20.106Z",
		"size": 20698,
		"path": "../public/localization/releases/2026.08.06-001/de/components.json"
	},
	"/localization/releases/2026.08.06-001/de/forms.json": {
		"type": "application/json",
		"etag": "\"1d3-0IRk3pjLCk7B27GEWn1VXs2n4CU\"",
		"mtime": "2026-08-08T12:48:20.106Z",
		"size": 467,
		"path": "../public/localization/releases/2026.08.06-001/de/forms.json"
	},
	"/localization/releases/2026.08.06-001/de/foundations.json": {
		"type": "application/json",
		"etag": "\"1e11-8ja/ahLc0LIGSvoqcTZvZwjBVcE\"",
		"mtime": "2026-08-08T12:48:20.106Z",
		"size": 7697,
		"path": "../public/localization/releases/2026.08.06-001/de/foundations.json"
	},
	"/localization/releases/2026.08.06-001/de/navigation.json": {
		"type": "application/json",
		"etag": "\"201-ov0KeVr6TqqebI55MPJ1xzBfm8Y\"",
		"mtime": "2026-08-08T12:48:20.106Z",
		"size": 513,
		"path": "../public/localization/releases/2026.08.06-001/de/navigation.json"
	},
	"/localization/releases/2026.08.06-001/de/overview.json": {
		"type": "application/json",
		"etag": "\"b52-i7YThjIau8nec6ClrZ9iasdZegw\"",
		"mtime": "2026-08-08T12:48:20.106Z",
		"size": 2898,
		"path": "../public/localization/releases/2026.08.06-001/de/overview.json"
	},
	"/localization/releases/2026.08.06-001/de/validation.json": {
		"type": "application/json",
		"etag": "\"1bf-/2OFNq4bZY2xwmi6/IHIixfi4Vc\"",
		"mtime": "2026-08-08T12:48:20.117Z",
		"size": 447,
		"path": "../public/localization/releases/2026.08.06-001/de/validation.json"
	},
	"/localization/releases/2026.08.06-001/de/ui-library.json": {
		"type": "application/json",
		"etag": "\"530-AxXXLAOaQWPoOR+OwRumrLyZl7g\"",
		"mtime": "2026-08-08T12:48:20.117Z",
		"size": 1328,
		"path": "../public/localization/releases/2026.08.06-001/de/ui-library.json"
	},
	"/localization/releases/2026.08.06-001/de/patterns.json": {
		"type": "application/json",
		"etag": "\"28df-mCwilo8WoN3OdXyS5pOXgAqK6vU\"",
		"mtime": "2026-08-08T12:48:20.117Z",
		"size": 10463,
		"path": "../public/localization/releases/2026.08.06-001/de/patterns.json"
	},
	"/localization/releases/2026.08.09-001/en/accessibility.json": {
		"type": "application/json",
		"etag": "\"1d2-LC1IxcO99/IHO/2PSEVdHKFmrn0\"",
		"mtime": "2026-08-09T17:05:53.670Z",
		"size": 466,
		"path": "../public/localization/releases/2026.08.09-001/en/accessibility.json"
	},
	"/localization/releases/2026.08.09-001/en/architecture.json": {
		"type": "application/json",
		"etag": "\"4ef6-/A8myZhlFw4wayBKSJa+S81QfsY\"",
		"mtime": "2026-08-09T19:13:35.106Z",
		"size": 20214,
		"path": "../public/localization/releases/2026.08.09-001/en/architecture.json"
	},
	"/localization/releases/2026.08.09-001/en/api-demo.json": {
		"type": "application/json",
		"etag": "\"2e2-yrtYWNrFxkK8vFEAM5Hc7kpCj3M\"",
		"mtime": "2026-08-09T17:05:53.672Z",
		"size": 738,
		"path": "../public/localization/releases/2026.08.09-001/en/api-demo.json"
	},
	"/localization/releases/2026.08.09-001/en/admin.json": {
		"type": "application/json",
		"etag": "\"29a4-KNoSI03stYE3pYDhWC2gEteLrh4\"",
		"mtime": "2026-08-09T17:05:53.671Z",
		"size": 10660,
		"path": "../public/localization/releases/2026.08.09-001/en/admin.json"
	},
	"/localization/releases/2026.08.09-001/en/common.json": {
		"type": "application/json",
		"etag": "\"9c3-WdmLOreL5fqT4LroXklS1PYUWGs\"",
		"mtime": "2026-08-09T17:05:53.676Z",
		"size": 2499,
		"path": "../public/localization/releases/2026.08.09-001/en/common.json"
	},
	"/localization/releases/2026.08.09-001/en/errors.json": {
		"type": "application/json",
		"etag": "\"28c-CA24+brg16Vd+rZwIkDkIj0qLl4\"",
		"mtime": "2026-08-09T17:05:53.681Z",
		"size": 652,
		"path": "../public/localization/releases/2026.08.09-001/en/errors.json"
	},
	"/localization/releases/2026.08.09-001/en/forms.json": {
		"type": "application/json",
		"etag": "\"1ba-unmbWRWUyV2lTXfKxySiMJHS3G0\"",
		"mtime": "2026-08-09T17:05:53.684Z",
		"size": 442,
		"path": "../public/localization/releases/2026.08.09-001/en/forms.json"
	},
	"/localization/releases/2026.08.09-001/en/components.json": {
		"type": "application/json",
		"etag": "\"473c-NzTFdGarsvjj46Fw4+JWtS4oxBI\"",
		"mtime": "2026-08-09T17:05:53.678Z",
		"size": 18236,
		"path": "../public/localization/releases/2026.08.09-001/en/components.json"
	},
	"/localization/releases/2026.08.09-001/en/date-time.json": {
		"type": "application/json",
		"etag": "\"1b0-zfXbJaXtNMmvFC8BwHaTKJawIss\"",
		"mtime": "2026-08-09T17:05:53.680Z",
		"size": 432,
		"path": "../public/localization/releases/2026.08.09-001/en/date-time.json"
	},
	"/localization/releases/2026.08.09-001/en/overview.json": {
		"type": "application/json",
		"etag": "\"45e-OtXlHSzL9VzHp1DNYA/q6GgaqX0\"",
		"mtime": "2026-08-09T17:05:53.690Z",
		"size": 1118,
		"path": "../public/localization/releases/2026.08.09-001/en/overview.json"
	},
	"/localization/releases/2026.08.09-001/en/navigation.json": {
		"type": "application/json",
		"etag": "\"1bc-t++DDJ2BQ0oswk5P8zllZtp1Fus\"",
		"mtime": "2026-08-09T17:05:53.688Z",
		"size": 444,
		"path": "../public/localization/releases/2026.08.09-001/en/navigation.json"
	},
	"/localization/releases/2026.08.09-001/en/foundations.json": {
		"type": "application/json",
		"etag": "\"1b50-hkMgVTP6278k1iJsIAzvI/Pnv2s\"",
		"mtime": "2026-08-09T17:05:53.686Z",
		"size": 6992,
		"path": "../public/localization/releases/2026.08.09-001/en/foundations.json"
	},
	"/localization/releases/2026.08.09-001/en/patterns.json": {
		"type": "application/json",
		"etag": "\"3c61-rdHF4nu1CJUigg3rUjMSyZlrnj0\"",
		"mtime": "2026-08-09T17:05:53.692Z",
		"size": 15457,
		"path": "../public/localization/releases/2026.08.09-001/en/patterns.json"
	},
	"/localization/releases/2026.08.09-001/en/registry.json": {
		"type": "application/json",
		"etag": "\"bc4-dOHvp3QTPBwGtkA2P6ABa/I0zQw\"",
		"mtime": "2026-08-09T20:47:30.531Z",
		"size": 3012,
		"path": "../public/localization/releases/2026.08.09-001/en/registry.json"
	},
	"/localization/releases/2026.08.09-001/en/validation.json": {
		"type": "application/json",
		"etag": "\"186-mcRu3qpNTZO9ggDFyVR8kAX3XFw\"",
		"mtime": "2026-08-09T17:05:53.696Z",
		"size": 390,
		"path": "../public/localization/releases/2026.08.09-001/en/validation.json"
	},
	"/localization/releases/2026.08.09-001/en/ui-library.json": {
		"type": "application/json",
		"etag": "\"4b8-SOmMpZZ16AzMDTZscXy6uMnUzTs\"",
		"mtime": "2026-08-09T17:05:53.695Z",
		"size": 1208,
		"path": "../public/localization/releases/2026.08.09-001/en/ui-library.json"
	}
};
//#endregion
//#region #nitro/virtual/public-assets-node
function readAsset(id) {
	const serverDir = dirname(fileURLToPath(globalThis.__nitro_main__));
	return promises.readFile(resolve(serverDir, public_assets_data_default[id].path));
}
//#endregion
//#region #nitro/virtual/public-assets
var publicAssetBases = {};
function isPublicAssetURL(id = "") {
	if (public_assets_data_default[id]) return true;
	for (const base in publicAssetBases) if (id.startsWith(base)) return true;
	return false;
}
function getAsset(id) {
	return public_assets_data_default[id];
}
//#endregion
//#region node_modules/.pnpm/nitro@3.0.260603-beta_chokidar@5.0.0_jiti@2.7.0_lru-cache@11.5.2_vite@8.2.1_@types+node@22.20_gns6xzsy42jaik3fhspvgswu7e/node_modules/nitro/dist/runtime/internal/static.mjs
var METHODS = /* @__PURE__ */ new Set(["HEAD", "GET"]);
var EncodingMap = {
	gzip: ".gz",
	br: ".br",
	zstd: ".zst"
};
var static_default = defineHandler((event) => {
	if (event.req.method && !METHODS.has(event.req.method)) return;
	let id = decodePath(withLeadingSlash(withoutTrailingSlash(event.url.pathname)));
	let asset;
	const encodings = [...(event.req.headers.get("accept-encoding") || "").split(",").map((e) => EncodingMap[e.trim()]).filter(Boolean).sort(), ""];
	for (const encoding of encodings) for (const _id of [id + encoding, joinURL(id, "index.html" + encoding)]) {
		const _asset = getAsset(_id);
		if (_asset) {
			asset = _asset;
			id = _id;
			break;
		}
	}
	if (!asset) {
		if (isPublicAssetURL(id)) {
			event.res.headers.delete("Cache-Control");
			throw new HTTPError({ status: 404 });
		}
		return;
	}
	if (encodings.length > 1) event.res.headers.append("Vary", "Accept-Encoding");
	if (event.req.headers.get("if-none-match") === asset.etag) {
		event.res.status = 304;
		event.res.statusText = "Not Modified";
		return "";
	}
	const ifModifiedSinceH = event.req.headers.get("if-modified-since");
	const mtimeDate = new Date(asset.mtime);
	if (ifModifiedSinceH && asset.mtime && new Date(ifModifiedSinceH) >= mtimeDate) {
		event.res.status = 304;
		event.res.statusText = "Not Modified";
		return "";
	}
	if (asset.type) event.res.headers.set("Content-Type", asset.type);
	if (asset.etag && !event.res.headers.has("ETag")) event.res.headers.set("ETag", asset.etag);
	if (asset.mtime && !event.res.headers.has("Last-Modified")) event.res.headers.set("Last-Modified", mtimeDate.toUTCString());
	if (asset.encoding && !event.res.headers.has("Content-Encoding")) event.res.headers.set("Content-Encoding", asset.encoding);
	if (asset.size > 0 && !event.res.headers.has("Content-Length")) event.res.headers.set("Content-Length", asset.size.toString());
	return readAsset(id);
});
//#endregion
//#region #nitro/virtual/routing
var findRouteRules = /* @__PURE__ */ (() => {
	const $0 = [{
		name: "headers",
		route: "/assets/**",
		handler: headers,
		options: { "cache-control": "public, max-age=31536000, immutable" }
	}];
	return (m, p) => {
		let r = [];
		if (p.charCodeAt(p.length - 1) === 47) p = p.slice(0, -1) || "/";
		let s = p.split("/");
		if (s.length > 1) {
			if (s[1] === "assets") r.unshift({
				data: $0,
				params: { "_": s.slice(2).join("/") }
			});
		}
		return r;
	};
})();
var _lazy_g57_Ah = defineLazyEventHandler(() => import("./_chunks/ssr-renderer.mjs"));
var findRoute = /* @__PURE__ */ (() => {
	const data = {
		route: "/**",
		handler: _lazy_g57_Ah
	};
	return ((_m, p) => {
		return {
			data,
			params: { "_": p.slice(1) }
		};
	});
})();
var globalMiddleware = [toEventHandler(static_default)].filter(Boolean);
//#endregion
//#region node_modules/.pnpm/nitro@3.0.260603-beta_chokidar@5.0.0_jiti@2.7.0_lru-cache@11.5.2_vite@8.2.1_@types+node@22.20_gns6xzsy42jaik3fhspvgswu7e/node_modules/nitro/dist/runtime/internal/error/prod.mjs
var errorHandler = (error, event) => {
	const res = defaultHandler(error, event);
	return new NodeResponse(typeof res.body === "string" ? res.body : JSON.stringify(res.body, null, 2), res);
};
function defaultHandler(error, event) {
	const unhandled = error.unhandled ?? !HTTPError.isError(error);
	const { status = 500, statusText = "" } = unhandled ? {} : error;
	if (status === 404) {
		const url = event.url || new URL(event.req.url);
		const baseURL = "/";
		if (/^\/[^/]/.test(baseURL) && !url.pathname.startsWith(baseURL)) return {
			status: 302,
			headers: new Headers({ location: `${baseURL}${url.pathname.slice(1)}${url.search}` })
		};
	}
	const headers = new Headers(unhandled ? {} : error.headers);
	headers.set("content-type", "application/json; charset=utf-8");
	return {
		status,
		statusText,
		headers,
		body: {
			error: true,
			...unhandled ? {
				status,
				unhandled: true
			} : typeof error.toJSON === "function" ? error.toJSON() : {
				status,
				statusText,
				message: error.message
			}
		}
	};
}
//#endregion
//#region #nitro/virtual/error-handler
var errorHandlers = [errorHandler];
async function error_handler_default(error, event) {
	for (const handler of errorHandlers) try {
		const response = await handler(error, event, { defaultHandler });
		if (response) return response;
	} catch (error) {
		console.error(error);
	}
}
//#endregion
//#region #nitro/virtual/app
function createNitroApp() {
	const captureError = (error, errorCtx) => {
		if (errorCtx?.event) {
			const errors = errorCtx.event.req.context?.nitro?.errors;
			if (errors) errors.push({
				error,
				context: errorCtx
			});
		}
	};
	const h3App = createH3App({ onError(error, event) {
		return error_handler_default(error, event);
	} });
	let appHandler = (req) => {
		req.context ||= {};
		req.context.nitro = req.context.nitro || { errors: [] };
		return h3App.fetch(req);
	};
	return {
		fetch: appHandler,
		h3: h3App,
		hooks: void 0,
		captureError
	};
}
function createH3App(config) {
	const h3App = new H3Core(config);
	h3App["~findRoute"] = (event) => findRoute(event.req.method, event.url.pathname);
	h3App["~middleware"].push(...globalMiddleware);
	h3App["~getMiddleware"] = (event, route) => {
		const pathname = event.url.pathname;
		const method = event.req.method;
		const middleware = [];
		const routeRules = getRouteRules(method, pathname);
		event.context.routeRules = routeRules?.routeRules;
		if (routeRules?.routeRuleMiddleware.length) middleware.push(...routeRules.routeRuleMiddleware);
		middleware.push(...h3App["~middleware"]);
		if (route?.data?.middleware?.length) middleware.push(...route.data.middleware);
		return middleware;
	};
	return h3App;
}
//#endregion
//#region node_modules/.pnpm/nitro@3.0.260603-beta_chokidar@5.0.0_jiti@2.7.0_lru-cache@11.5.2_vite@8.2.1_@types+node@22.20_gns6xzsy42jaik3fhspvgswu7e/node_modules/nitro/dist/runtime/internal/app.mjs
var APP_ID = "default";
function useNitroApp() {
	let instance = useNitroApp._instance;
	if (instance) return instance;
	instance = useNitroApp._instance = createNitroApp();
	globalThis.__nitro__ = globalThis.__nitro__ || {};
	globalThis.__nitro__[APP_ID] = instance;
	return instance;
}
function getRouteRules(method, pathname) {
	const m = findRouteRules(method, pathname);
	if (!m?.length) return { routeRuleMiddleware: [] };
	const routeRules = {};
	for (const layer of m) for (const rule of layer.data) {
		const currentRule = routeRules[rule.name];
		if (currentRule) {
			if (rule.options === false) {
				delete routeRules[rule.name];
				continue;
			}
			if (typeof currentRule.options === "object" && typeof rule.options === "object") currentRule.options = {
				...currentRule.options,
				...rule.options
			};
			else currentRule.options = rule.options;
			currentRule.route = rule.route;
			currentRule.params = {
				...currentRule.params,
				...layer.params
			};
		} else if (rule.options !== false) routeRules[rule.name] = {
			...rule,
			params: layer.params
		};
	}
	const middleware = [];
	const orderedRules = Object.values(routeRules).sort((a, b) => (a.handler?.order || 0) - (b.handler?.order || 0));
	for (const rule of orderedRules) {
		if (rule.options === false || !rule.handler) continue;
		middleware.push(rule.handler(rule));
	}
	return {
		routeRules,
		routeRuleMiddleware: middleware
	};
}
//#endregion
//#region node_modules/.pnpm/nitro@3.0.260603-beta_chokidar@5.0.0_jiti@2.7.0_lru-cache@11.5.2_vite@8.2.1_@types+node@22.20_gns6xzsy42jaik3fhspvgswu7e/node_modules/nitro/dist/runtime/internal/error/hooks.mjs
function _captureError(error, type) {
	console.error(`[${type}]`, error);
	useNitroApp().captureError?.(error, { tags: [type] });
}
function trapUnhandledErrors() {
	process.on("unhandledRejection", (error) => _captureError(error, "unhandledRejection"));
	process.on("uncaughtException", (error) => _captureError(error, "uncaughtException"));
}
//#endregion
//#region #nitro/virtual/tracing
var tracingSrvxPlugins = [];
//#endregion
//#region node_modules/.pnpm/nitro@3.0.260603-beta_chokidar@5.0.0_jiti@2.7.0_lru-cache@11.5.2_vite@8.2.1_@types+node@22.20_gns6xzsy42jaik3fhspvgswu7e/node_modules/nitro/dist/presets/node/runtime/node-server.mjs
var _parsedPort = Number.parseInt(process.env.NITRO_PORT ?? process.env.PORT ?? "");
var port = Number.isNaN(_parsedPort) ? 3e3 : _parsedPort;
var host = process.env.NITRO_HOST || process.env.HOST;
var cert = process.env.NITRO_SSL_CERT;
var key = process.env.NITRO_SSL_KEY;
var nitroApp = useNitroApp();
serve({
	port,
	hostname: host,
	tls: cert && key ? {
		cert,
		key
	} : void 0,
	fetch: nitroApp.fetch,
	plugins: [...tracingSrvxPlugins]
});
trapUnhandledErrors();
var node_server_default = {};
//#endregion
export { node_server_default as default };
