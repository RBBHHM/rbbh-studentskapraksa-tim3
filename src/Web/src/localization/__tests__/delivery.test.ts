import { describe, expect, it } from "vitest";

import { errorTranslationKey, isKnownBackendErrorCode } from "../errors/error-code-map";
import { resolveBundleUrl, bundleLoadPathTemplate } from "../client/bundle-path-resolver";

describe("bundle path resolution", () => {
  const manifestUrl = "/localization/manifests/development.json";

  it("builds an immutable, release-scoped URL", () => {
    expect(
      resolveBundleUrl({
        manifestUrl,
        releaseId: "2026.08.06-001",
        locale: "de",
        namespace: "common",
      }),
    ).toBe("/localization/releases/2026.08.06-001/de/common.json");
  });

  it("rejects traversal attempts in path segments", () => {
    expect(() =>
      resolveBundleUrl({
        manifestUrl,
        releaseId: "2026.08.06-001",
        locale: "../..",
        namespace: "common",
      }),
    ).toThrow();
  });

  it("emits an i18next load path template", () => {
    expect(bundleLoadPathTemplate(manifestUrl, "r1")).toBe(
      "/localization/releases/r1/{{lng}}/{{ns}}.json",
    );
  });
});

describe("backend error codes", () => {
  it("maps a known code to its namespaced key", () => {
    expect(errorTranslationKey("ACCOUNT_NOT_FOUND")).toBe("errors.ACCOUNT_NOT_FOUND");
  });

  it("never constructs a key from an unknown value", () => {
    expect(isKnownBackendErrorCode("__proto__")).toBe(false);
    expect(errorTranslationKey("__proto__")).toBe("errors.GENERIC");
  });
});
