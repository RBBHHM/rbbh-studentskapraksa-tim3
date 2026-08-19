import Keycloak from "keycloak-js";

const keycloakUrl = import.meta.env["VITE_KEYCLOAK_URL"] as string | undefined;
const keycloakRealm = import.meta.env["VITE_KEYCLOAK_REALM"] as string | undefined;
const keycloakClientId = import.meta.env["VITE_KEYCLOAK_CLIENT_ID"] as string | undefined;

export const isAuthenticationConfigured = Boolean(
  keycloakUrl && keycloakRealm && keycloakClientId,
);

const keycloak = new Keycloak({
  url: keycloakUrl || "http://localhost",
  realm: keycloakRealm || "not-configured",
  clientId: keycloakClientId || "not-configured",
});

let initialization: Promise<boolean> | undefined;

export function initializeAuthentication(): Promise<boolean> {
  if (!isAuthenticationConfigured) {
    console.warn("Keycloak nije konfigurisan; frontend radi u lokalnom razvojnom režimu.");
    return Promise.resolve(true);
  }
  initialization ??= keycloak.init({
    onLoad: "login-required",
    pkceMethod: "S256",
    checkLoginIframe: false,
  });
  return initialization;
}

export async function getAccessToken(): Promise<string | undefined> {
  if (!isAuthenticationConfigured) return undefined;
  await initializeAuthentication();
  await keycloak.updateToken(30);

  if (!keycloak.token) {
    await keycloak.login({ redirectUri: window.location.href });
    throw new Error("Authentication redirect started.");
  }

  return keycloak.token;
}

export { keycloak };
