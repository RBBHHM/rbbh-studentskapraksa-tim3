import "./rolldown-runtime-D7D4PA-g.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { a as cn } from "./http-client-CjYYYiH6.mjs";
require_react();
var import_jsx_runtime = require_jsx_runtime();
cva("text-display font-brand text-balance", {
	variants: { size: {
		xl: "text-4xl sm:text-5xl xl:text-6xl",
		lg: "text-3xl sm:text-4xl xl:text-5xl",
		md: "text-2xl sm:text-3xl xl:text-4xl"
	} },
	defaultVariants: { size: "lg" }
});
var headingVariants = cva("font-brand font-bold tracking-tight text-balance", {
	variants: { size: {
		1: "text-3xl sm:text-4xl leading-snug",
		2: "text-2xl sm:text-3xl leading-snug",
		3: "text-xl sm:text-2xl leading-snug",
		4: "text-lg sm:text-xl leading-snug",
		5: "text-base sm:text-lg leading-normal",
		6: "text-base leading-normal"
	} },
	defaultVariants: { size: 2 }
});
function Heading({ level, size, className, ...props }) {
	const Comp = `h${level}`;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Comp, {
		className: cn(headingVariants({ size: size ?? level }), className),
		...props
	});
}
var textVariants = cva("font-brand", {
	variants: {
		size: {
			xs: "text-xs leading-normal",
			sm: "text-sm leading-relaxed",
			md: "text-base leading-relaxed",
			lg: "text-lg leading-relaxed",
			xl: "text-xl font-light leading-relaxed"
		},
		tone: {
			primary: "text-text-primary",
			secondary: "text-text-secondary",
			tertiary: "text-text-tertiary",
			brand: "text-text-brand-accent",
			corporate: "text-text-corporate",
			danger: "text-feedback-danger",
			inherit: ""
		},
		weight: {
			light: "font-light",
			regular: "font-normal",
			medium: "font-medium",
			bold: "font-bold"
		}
	},
	defaultVariants: {
		size: "md",
		tone: "inherit"
	}
});
function Text({ as: Comp = "p", size, tone, weight, className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Comp, {
		className: cn(textVariants({
			size,
			tone,
			weight
		}), className),
		...props
	});
}
//#endregion
export { Text as n, Heading as t };
