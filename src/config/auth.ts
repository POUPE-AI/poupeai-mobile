export const keycloakConfig = {
  baseUrl: process.env.EXPO_PUBLIC_KEYCLOAK_BASE_URL!,
  realm: process.env.EXPO_PUBLIC_KEYCLOAK_REALM!,
  clientId: process.env.EXPO_PUBLIC_KEYCLOAK_CLIENT_ID!,
  appScheme: process.env.EXPO_PUBLIC_APP_SCHEME!,
} as const;

// Função para normalizar URLs e evitar barras duplas
const normalizeUrl = (base: string, path: string): string => {
  const cleanBase = base.endsWith("/") ? base.slice(0, -1) : base;
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${cleanBase}${cleanPath}`;
};

export const discoveryEndpoints = {
  authorizationEndpoint: normalizeUrl(
    keycloakConfig.baseUrl,
    `/realms/${keycloakConfig.realm}/protocol/openid-connect/auth`
  ),
  tokenEndpoint: normalizeUrl(
    keycloakConfig.baseUrl,
    `/realms/${keycloakConfig.realm}/protocol/openid-connect/token`
  ),
  revocationEndpoint: normalizeUrl(
    keycloakConfig.baseUrl,
    `/realms/${keycloakConfig.realm}/protocol/openid-connect/revoke`
  ),
  userInfoEndpoint: normalizeUrl(
    keycloakConfig.baseUrl,
    `/realms/${keycloakConfig.realm}/protocol/openid-connect/userinfo`
  ),
} as const;

export const storageKeys = {
  user: "@poupeai:user",
  tokens: "@poupeai:tokens",
} as const;

export const authConfig = {
  scopes: ["openid", "profile", "email"] as string[],
  additionalParameters: {
    audience: "account",
  },
  responseType: "code" as const,
  usePKCE: true,
  tokenExpirationMarginMs: 5 * 60 * 1000,
  navigationDelayMs: 200,
} as const;

// Validação das configurações
export const validateAuthConfig = (): {
  isValid: boolean;
  errors: string[];
} => {
  const errors: string[] = [];

  if (!keycloakConfig.baseUrl) {
    errors.push("EXPO_PUBLIC_KEYCLOAK_BASE_URL não configurado");
  }
  if (!keycloakConfig.realm) {
    errors.push("EXPO_PUBLIC_KEYCLOAK_REALM não configurado");
  }
  if (!keycloakConfig.clientId) {
    errors.push("EXPO_PUBLIC_KEYCLOAK_CLIENT_ID não configurado");
  }
  if (!keycloakConfig.appScheme) {
    errors.push("EXPO_PUBLIC_APP_SCHEME não configurado");
  }

  // Validação adicional de formato
  if (keycloakConfig.baseUrl && !keycloakConfig.baseUrl.startsWith("http")) {
    errors.push(
      "EXPO_PUBLIC_KEYCLOAK_BASE_URL deve começar com http:// ou https://"
    );
  }

  if (errors.length > 0) {
    console.error("❌ Erros na configuração de autenticação:", errors);
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};
