import Keycloak from "keycloak-js";

const keycloak = new Keycloak({
  url: import.meta.env["VITE_KEYCLOAK_URL"] ?? "http://localhost:8183",
  realm: import.meta.env["VITE_KEYCLOAK_REALM"] ?? "praksa",
  clientId: import.meta.env["VITE_KEYCLOAK_CLIENT_ID"] ?? "praksa-web",
});

let initialization: Promise<boolean> | undefined;

export function initializeAuthentication(): Promise<boolean> {
  initialization ??= keycloak.init({
    onLoad: "login-required",
    pkceMethod: "S256",
    checkLoginIframe: false,
  });
  return initialization;
}

export async function getAccessToken(): Promise<string> {
  await initializeAuthentication();
  await keycloak.updateToken(30);

  if (!keycloak.token) {
    await keycloak.login({ redirectUri: window.location.href });
    throw new Error("Authentication redirect started.");
  }

  return keycloak.token;
}

export { keycloak };
