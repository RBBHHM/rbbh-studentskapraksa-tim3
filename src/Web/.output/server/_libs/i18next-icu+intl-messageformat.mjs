import { n as strategies, t as memoize } from "./formatjs__fast-memoize.mjs";
import { a as isNumberElement, c as isPoundElement, d as isTimeElement, f as parse, i as isLiteralElement, l as isSelectElement, n as isDateElement, o as isNumberSkeleton, r as isDateTimeSkeleton, s as isPluralElement, t as isArgumentElement, u as isTagElement } from "./@formatjs/icu-messageformat-parser+[...].mjs";
//#region node_modules/.pnpm/i18next-icu@2.4.4_intl-messageformat@11.2.13/node_modules/i18next-icu/dist/es/utils.js
var UNSAFE_KEYS = [
	"__proto__",
	"constructor",
	"prototype"
];
function getLastOfPath(object, path, Empty) {
	function cleanKey(key) {
		return key && key.indexOf("###") > -1 ? key.replace(/###/g, ".") : key;
	}
	function canNotTraverseDeeper() {
		return !object || typeof object === "string";
	}
	var stack = typeof path !== "string" ? [].concat(path) : path.split(".");
	while (stack.length > 1) {
		if (canNotTraverseDeeper()) return {};
		var key = cleanKey(stack.shift());
		if (UNSAFE_KEYS.indexOf(key) > -1) return {};
		if (!object[key] && Empty) object[key] = new Empty();
		object = object[key];
	}
	if (canNotTraverseDeeper()) return {};
	var k = cleanKey(stack.shift());
	if (UNSAFE_KEYS.indexOf(k) > -1) return {};
	return {
		obj: object,
		k
	};
}
function setPath(object, path, newValue) {
	var _getLastOfPath = getLastOfPath(object, path, Object), obj = _getLastOfPath.obj, k = _getLastOfPath.k;
	if (obj === void 0) return;
	obj[k] = newValue;
}
function getPath(object, path) {
	var _getLastOfPath3 = getLastOfPath(object, path), obj = _getLastOfPath3.obj, k = _getLastOfPath3.k;
	if (!obj) return void 0;
	return obj[k];
}
var arr = [];
var each = arr.forEach;
var slice = arr.slice;
function defaults(obj) {
	each.call(slice.call(arguments, 1), function(source) {
		if (source) for (var _i = 0, _Object$keys = Object.keys(source); _i < _Object$keys.length; _i++) {
			var prop = _Object$keys[_i];
			if (UNSAFE_KEYS.indexOf(prop) > -1) continue;
			if (obj[prop] === void 0) obj[prop] = source[prop];
		}
	});
	return obj;
}
//#endregion
//#region node_modules/.pnpm/intl-messageformat@11.2.13/node_modules/intl-messageformat/index.js
var FormatError = class extends Error {
	constructor(msg, code, originalMessage) {
		super(msg);
		this.code = code;
		this.originalMessage = originalMessage;
	}
	toString() {
		return `[formatjs Error: ${this.code}] ${this.message}`;
	}
};
var InvalidValueError = class extends FormatError {
	constructor(variableId, value, options, originalMessage) {
		super(`Invalid values for "${variableId}": "${value}". Options are "${Object.keys(options).join("\", \"")}"`, "INVALID_VALUE", originalMessage);
	}
};
var InvalidValueTypeError = class extends FormatError {
	constructor(value, type, originalMessage) {
		super(`Value for "${value}" must be of type ${type}`, "INVALID_VALUE", originalMessage);
	}
};
var MissingValueError = class extends FormatError {
	constructor(variableId, originalMessage) {
		super(`The intl string context variable "${variableId}" was not provided to the string "${originalMessage}"`, "MISSING_VALUE", originalMessage);
	}
};
function mergeLiteral(parts) {
	if (parts.length < 2) return parts;
	return parts.reduce((all, part) => {
		const lastPart = all[all.length - 1];
		if (!lastPart || lastPart.type !== 0 || part.type !== 0) all.push(part);
		else lastPart.value += part.value;
		return all;
	}, []);
}
function isFormatXMLElementFn(el) {
	return typeof el === "function";
}
function formatToParts(els, locales, formatters, formats, values, currentPluralValue, originalMessage) {
	if (els.length === 1 && isLiteralElement(els[0])) return [{
		type: 0,
		value: els[0].value
	}];
	const result = [];
	for (const el of els) {
		if (isLiteralElement(el)) {
			result.push({
				type: 0,
				value: el.value
			});
			continue;
		}
		if (isPoundElement(el)) {
			if (typeof currentPluralValue === "number") result.push({
				type: 0,
				value: formatters.getNumberFormat(locales).format(currentPluralValue)
			});
			continue;
		}
		const { value: varName } = el;
		if (!(values && varName in values)) throw new MissingValueError(varName, originalMessage);
		let value = values[varName];
		if (isArgumentElement(el)) {
			if (!value || typeof value === "string" || typeof value === "number" || typeof value === "bigint") value = typeof value === "string" || typeof value === "number" || typeof value === "bigint" ? String(value) : "";
			result.push({
				type: typeof value === "string" ? 0 : 1,
				value
			});
			continue;
		}
		if (isDateElement(el)) {
			const style = typeof el.style === "string" ? formats.date[el.style] : isDateTimeSkeleton(el.style) ? el.style.parsedOptions : void 0;
			result.push({
				type: 0,
				value: formatters.getDateTimeFormat(locales, style).format(value)
			});
			continue;
		}
		if (isTimeElement(el)) {
			const style = typeof el.style === "string" ? formats.time[el.style] : isDateTimeSkeleton(el.style) ? el.style.parsedOptions : formats.time.medium;
			result.push({
				type: 0,
				value: formatters.getDateTimeFormat(locales, style).format(value)
			});
			continue;
		}
		if (isNumberElement(el)) {
			const style = typeof el.style === "string" ? formats.number[el.style] : isNumberSkeleton(el.style) ? el.style.parsedOptions : void 0;
			if (style && style.scale) {
				const scale = style.scale || 1;
				if (typeof value === "bigint") {
					if (!Number.isInteger(scale)) throw new TypeError(`Cannot apply fractional scale ${scale} to bigint value. Scale must be an integer when formatting bigint.`);
					value = value * BigInt(scale);
				} else value = value * scale;
			}
			result.push({
				type: 0,
				value: formatters.getNumberFormat(locales, style).format(value)
			});
			continue;
		}
		if (isTagElement(el)) {
			const { children, value } = el;
			const formatFn = values[value];
			if (!isFormatXMLElementFn(formatFn)) throw new InvalidValueTypeError(value, "function", originalMessage);
			let chunks = formatFn(formatToParts(children, locales, formatters, formats, values, currentPluralValue).map((p) => p.value));
			if (!Array.isArray(chunks)) chunks = [chunks];
			result.push(...chunks.map((c) => {
				return {
					type: typeof c === "string" ? 0 : 1,
					value: c
				};
			}));
		}
		if (isSelectElement(el)) {
			const key = value;
			const opt = (Object.prototype.hasOwnProperty.call(el.options, key) ? el.options[key] : void 0) || el.options.other;
			if (!opt) throw new InvalidValueError(el.value, value, Object.keys(el.options), originalMessage);
			result.push(...formatToParts(opt.value, locales, formatters, formats, values));
			continue;
		}
		if (isPluralElement(el)) {
			const exactKey = `=${value}`;
			let opt = Object.prototype.hasOwnProperty.call(el.options, exactKey) ? el.options[exactKey] : void 0;
			if (!opt) {
				if (!Intl.PluralRules) throw new FormatError(`Intl.PluralRules is not available in this environment.
Try polyfilling it using "@formatjs/intl-pluralrules"
`, "MISSING_INTL_API", originalMessage);
				const numericValue = typeof value === "bigint" ? Number(value) : value;
				const rule = formatters.getPluralRules(locales, { type: el.pluralType }).select(numericValue - (el.offset || 0));
				opt = (Object.prototype.hasOwnProperty.call(el.options, rule) ? el.options[rule] : void 0) || el.options.other;
			}
			if (!opt) throw new InvalidValueError(el.value, value, Object.keys(el.options), originalMessage);
			const numericValue = typeof value === "bigint" ? Number(value) : value;
			result.push(...formatToParts(opt.value, locales, formatters, formats, values, numericValue - (el.offset || 0)));
			continue;
		}
	}
	return mergeLiteral(result);
}
function mergeConfig(c1, c2) {
	if (!c2) return c1;
	return {
		...c1,
		...c2,
		...Object.keys(c1).reduce((all, k) => {
			all[k] = {
				...c1[k],
				...c2[k]
			};
			return all;
		}, {})
	};
}
function mergeConfigs(defaultConfig, configs) {
	if (!configs) return defaultConfig;
	return Object.keys(defaultConfig).reduce((all, k) => {
		all[k] = mergeConfig(defaultConfig[k], configs[k]);
		return all;
	}, { ...defaultConfig });
}
function createFastMemoizeCache(store) {
	return { create() {
		return {
			get(key) {
				return store[key];
			},
			set(key, value) {
				store[key] = value;
			}
		};
	} };
}
function createDefaultFormatters(cache = {
	number: {},
	dateTime: {},
	pluralRules: {}
}) {
	return {
		getNumberFormat: memoize((...args) => new Intl.NumberFormat(...args), {
			cache: createFastMemoizeCache(cache.number),
			strategy: strategies.variadic
		}),
		getDateTimeFormat: memoize((...args) => new Intl.DateTimeFormat(...args), {
			cache: createFastMemoizeCache(cache.dateTime),
			strategy: strategies.variadic
		}),
		getPluralRules: memoize((...args) => new Intl.PluralRules(...args), {
			cache: createFastMemoizeCache(cache.pluralRules),
			strategy: strategies.variadic
		})
	};
}
var intl_messageformat_default = class IntlMessageFormat {
	constructor(message, locales = IntlMessageFormat.defaultLocale, overrideFormats, opts) {
		this.formatterCache = {
			number: {},
			dateTime: {},
			pluralRules: {}
		};
		this.format = (values) => {
			const parts = this.formatToParts(values);
			if (parts.length === 1) return parts[0].value;
			const result = parts.reduce((all, part) => {
				if (!all.length || part.type !== 0 || typeof all[all.length - 1] !== "string") all.push(part.value);
				else all[all.length - 1] += part.value;
				return all;
			}, []);
			if (result.length <= 1) return result[0] || "";
			return result;
		};
		this.formatToParts = (values) => formatToParts(this.ast, this.locales, this.formatters, this.formats, values, void 0, this.message);
		this.resolvedOptions = () => ({ locale: this.resolvedLocale?.toString() || Intl.NumberFormat.supportedLocalesOf(this.locales)[0] });
		this.getAst = () => this.ast;
		this.locales = locales;
		this.resolvedLocale = IntlMessageFormat.resolveLocale(locales);
		if (typeof message === "string") {
			this.message = message;
			if (!IntlMessageFormat.__parse) throw new TypeError("IntlMessageFormat.__parse must be set to process `message` of type `string`");
			const { ...parseOpts } = opts || {};
			this.ast = IntlMessageFormat.__parse(message, {
				...parseOpts,
				locale: this.resolvedLocale
			});
		} else this.ast = message;
		if (!Array.isArray(this.ast)) throw new TypeError("A message must be provided as a String or AST.");
		this.formats = mergeConfigs(IntlMessageFormat.formats, overrideFormats);
		this.formatters = opts && opts.formatters || createDefaultFormatters(this.formatterCache);
	}
	static {
		this.memoizedDefaultLocale = null;
	}
	static get defaultLocale() {
		if (!IntlMessageFormat.memoizedDefaultLocale) IntlMessageFormat.memoizedDefaultLocale = new Intl.NumberFormat().resolvedOptions().locale;
		return IntlMessageFormat.memoizedDefaultLocale;
	}
	static {
		this.resolveLocale = (locales) => {
			if (typeof Intl.Locale === "undefined") return;
			const supportedLocales = Intl.NumberFormat.supportedLocalesOf(locales);
			if (supportedLocales.length > 0) return new Intl.Locale(supportedLocales[0]);
			return new Intl.Locale(typeof locales === "string" ? locales : locales[0]);
		};
	}
	static {
		this.__parse = parse;
	}
	static {
		this.formats = {
			number: {
				integer: { maximumFractionDigits: 0 },
				currency: { style: "currency" },
				percent: { style: "percent" }
			},
			date: {
				short: {
					month: "numeric",
					day: "numeric",
					year: "2-digit"
				},
				medium: {
					month: "short",
					day: "numeric",
					year: "numeric"
				},
				long: {
					month: "long",
					day: "numeric",
					year: "numeric"
				},
				full: {
					weekday: "long",
					month: "long",
					day: "numeric",
					year: "numeric"
				}
			},
			time: {
				short: {
					hour: "numeric",
					minute: "numeric"
				},
				medium: {
					hour: "numeric",
					minute: "numeric",
					second: "numeric"
				},
				long: {
					hour: "numeric",
					minute: "numeric",
					second: "numeric",
					timeZoneName: "short"
				},
				full: {
					hour: "numeric",
					minute: "numeric",
					second: "numeric",
					timeZoneName: "short"
				}
			}
		};
	}
};
//#endregion
//#region node_modules/.pnpm/i18next-icu@2.4.4_intl-messageformat@11.2.13/node_modules/i18next-icu/dist/es/index.js
function _slicedToArray(arr, i) {
	return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
}
function _nonIterableRest() {
	throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _unsupportedIterableToArray(o, minLen) {
	if (!o) return;
	if (typeof o === "string") return _arrayLikeToArray(o, minLen);
	var n = Object.prototype.toString.call(o).slice(8, -1);
	if (n === "Object" && o.constructor) n = o.constructor.name;
	if (n === "Map" || n === "Set") return Array.from(o);
	if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}
function _arrayLikeToArray(arr, len) {
	if (len == null || len > arr.length) len = arr.length;
	for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];
	return arr2;
}
function _iterableToArrayLimit(arr, i) {
	if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return;
	var _arr = [];
	var _n = true;
	var _d = false;
	var _e = void 0;
	try {
		for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
			_arr.push(_s.value);
			if (i && _arr.length === i) break;
		}
	} catch (err) {
		_d = true;
		_e = err;
	} finally {
		try {
			if (!_n && _i["return"] != null) _i["return"]();
		} finally {
			if (_d) throw _e;
		}
	}
	return _arr;
}
function _arrayWithHoles(arr) {
	if (Array.isArray(arr)) return arr;
}
function _typeof(obj) {
	"@babel/helpers - typeof";
	if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") _typeof = function _typeof(obj) {
		return typeof obj;
	};
	else _typeof = function _typeof(obj) {
		return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
	};
	return _typeof(obj);
}
function ownKeys(object, enumerableOnly) {
	var keys = Object.keys(object);
	if (Object.getOwnPropertySymbols) {
		var symbols = Object.getOwnPropertySymbols(object);
		if (enumerableOnly) symbols = symbols.filter(function(sym) {
			return Object.getOwnPropertyDescriptor(object, sym).enumerable;
		});
		keys.push.apply(keys, symbols);
	}
	return keys;
}
function _objectSpread(target) {
	for (var i = 1; i < arguments.length; i++) {
		var source = arguments[i] != null ? arguments[i] : {};
		if (i % 2) ownKeys(Object(source), true).forEach(function(key) {
			_defineProperty(target, key, source[key]);
		});
		else if (Object.getOwnPropertyDescriptors) Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
		else ownKeys(Object(source)).forEach(function(key) {
			Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
		});
	}
	return target;
}
function _defineProperty(obj, key, value) {
	if (key in obj) Object.defineProperty(obj, key, {
		value,
		enumerable: true,
		configurable: true,
		writable: true
	});
	else obj[key] = value;
	return obj;
}
function _classCallCheck(instance, Constructor) {
	if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
}
function _defineProperties(target, props) {
	for (var i = 0; i < props.length; i++) {
		var descriptor = props[i];
		descriptor.enumerable = descriptor.enumerable || false;
		descriptor.configurable = true;
		if ("value" in descriptor) descriptor.writable = true;
		Object.defineProperty(target, descriptor.key, descriptor);
	}
}
function _createClass(Constructor, protoProps, staticProps) {
	if (protoProps) _defineProperties(Constructor.prototype, protoProps);
	if (staticProps) _defineProperties(Constructor, staticProps);
	return Constructor;
}
function getDefaults() {
	return {
		memoize: true,
		memoizeFallback: false,
		bindI18n: "",
		bindI18nStore: "",
		parseErrorHandler: function parseErrorHandler(err, key, res, options) {
			return res;
		},
		parseLngForICU: function parseLngForICU(lng) {
			return lng;
		},
		escapeVariables: false
	};
}
var ICU = /*#__PURE__*/ function() {
	function ICU(options) {
		_classCallCheck(this, ICU);
		this.type = "i18nFormat";
		this.mem = {};
		this.init(null, options);
	}
	_createClass(ICU, [
		{
			key: "init",
			value: function init(i18next, options) {
				var _this = this;
				var i18nextOptions = i18next && i18next.options && i18next.options.i18nFormat || {};
				this.options = defaults(i18nextOptions, options, this.options || {}, getDefaults());
				this.formats = this.options.formats;
				if (i18next) {
					var _this$options = this.options, bindI18n = _this$options.bindI18n, bindI18nStore = _this$options.bindI18nStore, memoize = _this$options.memoize;
					i18next.IntlMessageFormat = intl_messageformat_default;
					i18next.ICU = this;
					if (memoize) {
						if (bindI18n) i18next.on(bindI18n, function() {
							return _this.clearCache();
						});
						if (bindI18nStore) i18next.store.on(bindI18nStore, function() {
							return _this.clearCache();
						});
					}
				}
			}
		},
		{
			key: "addUserDefinedFormats",
			value: function addUserDefinedFormats(formats) {
				this.formats = this.formats ? _objectSpread(_objectSpread({}, this.formats), formats) : formats;
			}
		},
		{
			key: "parse",
			value: function parse(res, options, lng, ns, key, info) {
				var hadSuccessfulLookup = info && info.resolved && info.resolved.res;
				var memKey = this.options.memoize && "".concat(lng, ".").concat(ns, ".").concat(key.replace(/\./g, "###"));
				var fc;
				if (this.options.memoize) fc = getPath(this.mem, memKey);
				try {
					if (!fc) {
						fc = new intl_messageformat_default(res, this.options.parseLngForICU(lng), this.formats, { ignoreTag: true });
						if (this.options.memoize && (this.options.memoizeFallback || !info || hadSuccessfulLookup)) setPath(this.mem, memKey, fc);
					}
					return fc.format(this.escapeVariableValues(options));
				} catch (err) {
					return this.options.parseErrorHandler(err, key, res, options);
				}
			}
		},
		{
			key: "addLookupKeys",
			value: function addLookupKeys(finalKeys, _key, _code, _ns, _options) {
				return finalKeys;
			}
		},
		{
			key: "clearCache",
			value: function clearCache() {
				this.mem = {};
			}
		},
		{
			key: "escapeVariableValues",
			value: function escapeVariableValues(options) {
				if (!this.options.escapeVariables || !options || _typeof(options) !== "object") return options;
				var escaped = {};
				for (var _i = 0, _Object$entries = Object.entries(options); _i < _Object$entries.length; _i++) {
					var _Object$entries$_i = _slicedToArray(_Object$entries[_i], 2), key = _Object$entries$_i[0], value = _Object$entries$_i[1];
					if (typeof value === "string") escaped[key] = value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
					else escaped[key] = value;
				}
				return escaped;
			}
		}
	]);
	return ICU;
}();
ICU.type = "i18nFormat";
//#endregion
export { ICU as t };
