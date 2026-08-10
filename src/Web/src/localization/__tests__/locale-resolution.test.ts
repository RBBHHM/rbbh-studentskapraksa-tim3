import { describe, expect, it } from "vitest";

import { buildFallbackChain, normalizeLocale, resolveLocale } from "../config/locale-resolution";
import { validateManifest, type LocalizationManifest } from "../types/localization-manifest";

const manifest: LocalizationManifest = {
  schemaVersion: 1,
  releaseId: "2026.08.06-001",
  defaultLocale: "en",
  fallbackLocale: "en",
  supportedLocales: [
    { code: "en", displayNameKey: "locales.en", direction: "ltr", enabled: true },
    { code: "de", displayNameKey: "locales.de", direction: "ltr", enabled: true },
    { code: "bs", displayNameKey: "locales.bs", direction: "ltr", enabled: false },
  ],
  namespaces: ["common", "navigation"],
  publishedAt: "2026-08-06T10:00:00Z",
};

describe("manifest validation", () => {
  it("accepts a well-formed manifest", () => {
    expect(validateManifest(manifest).ok).toBe(true);
  });

  it("rejects a default locale missing from supportedLocales", () => {
    const result = validateManifest({ ...manifest, defaultLocale: "fr" });
    expect(result.ok).toBe(false);
  });

  it("rejects an unsafe release id", () => {
    expect(validateManifest({ ...manifest, releaseId: "../etc" }).ok).toBe(false);
  });
});

describe("locale normalization", () => {
  it("narrows a regional tag to a supported language", () => {
    expect(normalizeLocale("de-AT", manifest)).toBe("de");
    expect(normalizeLocale("de-DE-u-ca-gregory", manifest)).toBe("de");
  });

  it("ignores a locale that is present but disabled in the manifest", () => {
    expect(normalizeLocale("bs-Latn-BA", manifest)).toBeUndefined();
  });

  it("returns undefined for an unsupported language", () => {
    expect(normalizeLocale("fr-FR", manifest)).toBeUndefined();
  });
});

describe("resolution priority", () => {
  it("prefers the user profile over the URL and cookie", () => {
    const result = resolveLocale({
      manifest,
      userProfileLocale: "de",
      pathname: "/bs/components",
      cookieHeader: "rbi.locale=en",
      browserLocales: ["en-GB"],
    });
    expect(result).toMatchObject({ locale: "de", source: "userProfile" });
  });

  it("falls back to the manifest default when no signal matches", () => {
    const result = resolveLocale({ manifest, browserLocales: ["fr-FR"] });
    expect(result).toMatchObject({ locale: "en", source: "manifestDefault" });
  });

  it("builds a de-duplicated fallback chain", () => {
    expect(buildFallbackChain("de", manifest)).toEqual(["de", "en"]);
  });
});
