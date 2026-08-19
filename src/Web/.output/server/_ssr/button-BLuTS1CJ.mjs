import { a as __toESM } from "./rolldown-runtime-D7D4PA-g.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { c as Slot, l as Slottable } from "../_libs/@radix-ui/react-dialog+[...].mjs";
import { t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { a as cn } from "./http-client-DEtq0LLv.mjs";
import { x as LoaderCircle } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/button-BLuTS1CJ.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
/**
* RBI Button.
*
* Variant rules from the brand guidelines:
* - `primary` is primary yellow with off-black text. There is exactly one
*   primary action per view. White text on yellow is never permitted.
* - `secondary` is an off-black outline — the workhorse for most actions.
* - `corporate` uses corporate green, reserved for the corporate/ESG context.
* - `tertiary` and `ghost` are low-emphasis; `link` is inline in prose.
*
* Accessibility:
* - Default height is 44px, meeting the WCAG 2.2 target-size minimum.
* - Focus is a 2px ring with a 2px offset, inherited from the base layer.
* - `loading` sets `aria-busy` and keeps the control focusable, so screen
*   reader users are not thrown off by a disappearing element.
*/
var buttonVariants = cva([
	"inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-sm",
	"font-medium cursor-pointer select-none",
	"transition-[background-color,border-color,color,box-shadow] duration-150 ease-standard",
	"disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-45",
	"aria-disabled:pointer-events-none aria-disabled:cursor-not-allowed aria-disabled:opacity-45",
	"[&_svg]:pointer-events-none [&_svg]:shrink-0"
], {
	variants: {
		variant: {
			primary: [
				"bg-[var(--action-primary-background)] text-[var(--action-primary-foreground)]",
				"hover:bg-[var(--action-primary-background-hover)]",
				"active:bg-[var(--action-primary-background-active)]"
			],
			secondary: [
				"border-2 border-[var(--action-secondary-border)] bg-transparent",
				"text-[var(--action-secondary-foreground)]",
				"hover:bg-[var(--action-secondary-background-hover)]",
				"active:bg-[var(--action-secondary-background-active)]"
			],
			tertiary: [
				"bg-[var(--action-tertiary-background)] text-[var(--action-tertiary-foreground)]",
				"hover:bg-[var(--action-tertiary-background-hover)]",
				"active:bg-[var(--action-tertiary-background-active)]"
			],
			corporate: [
				"bg-[var(--action-corporate-background)] text-[var(--action-corporate-foreground)]",
				"hover:bg-[var(--action-corporate-background-hover)]",
				"active:bg-[var(--action-corporate-background-active)]"
			],
			ghost: [
				"bg-transparent text-text-primary",
				"hover:bg-[var(--action-tertiary-background)]",
				"active:bg-[var(--action-tertiary-background-hover)]"
			],
			destructive: [
				"bg-[var(--action-destructive-background)] text-[var(--action-destructive-foreground)]",
				"hover:bg-[var(--action-destructive-background-hover)]",
				"active:bg-[var(--action-destructive-background-active)]"
			],
			link: ["h-auto rounded-xs bg-transparent p-0 text-text-link underline underline-offset-4", "hover:text-text-link-hover"]
		},
		size: {
			/** 32px — dense toolbars and table row actions. */
			sm: "h-8 gap-1.5 px-3 text-xs [&_svg]:size-3.5",
			/** 40px — the default control height for forms and page actions. */
			md: "h-10 px-4 text-sm [&_svg]:size-4",
			/** 44px — hero and primary page-level calls to action. */
			lg: "h-11 px-6 text-base [&_svg]:size-4",
			icon: "size-10 p-0 [&_svg]:size-4",
			/**
			* 32px visually, but the hit area is expanded to 40px through a
			* transparent pseudo-element so dense table rows stay tappable.
			*/
			"icon-sm": "relative size-8 p-0 [&_svg]:size-3.5 after:absolute after:-inset-1 after:content-['']"
		},
		fullWidth: { true: "w-full" }
	},
	compoundVariants: [{
		variant: "link",
		size: [
			"sm",
			"md",
			"lg"
		],
		class: "h-auto px-0"
	}],
	defaultVariants: {
		variant: "primary",
		size: "md"
	}
});
var Button = import_react.forwardRef(({ className, variant, size, fullWidth, asChild = false, loading = false, loadingLabel = "Loading", children, type, ...props }, ref) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(asChild ? Slot : "button", {
		ref,
		type: asChild ? void 0 : type ?? "button",
		"aria-busy": loading || void 0,
		"aria-disabled": loading || void 0,
		className: cn(buttonVariants({
			variant,
			size,
			fullWidth
		}), className),
		...props,
		children: [loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, {
			className: "animate-spin",
			"aria-hidden": "true"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "sr-only",
			children: loadingLabel
		})] }) : null, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slottable, { children })]
	});
});
Button.displayName = "Button";
//#endregion
export { Button as t };
