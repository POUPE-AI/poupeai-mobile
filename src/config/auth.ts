import { validateEnvVariables } from '../utils/env';

validateEnvVariables();

export const keycloakConfig = {
  baseUrl: process.env.EXPO_PUBLIC_KEYCLOAK_BASE_URL!,
  realm: process.env.EXPO_PUBLIC_KEYCLOAK_REALM!,
  clientId: process.env.EXPO_PUBLIC_KEYCLOAK_CLIENT_ID!,
  appScheme: process.env.EXPO_PUBLIC_APP_SCHEME!,
} as const;

export const discoveryEndpoints = {
  authorizationEndpoint: `${keycloakConfig.baseUrl}/realms/${keycloakConfig.realm}/protocol/openid-connect/auth`,
  tokenEndpoint: `${keycloakConfig.baseUrl}/realms/${keycloakConfig.realm}/protocol/openid-connect/token`,
  revocationEndpoint: `${keycloakConfig.baseUrl}/realms/${keycloakConfig.realm}/protocol/openid-connect/logout`,
  userInfoEndpoint: `${keycloakConfig.baseUrl}/realms/${keycloakConfig.realm}/protocol/openid-connect/userinfo`,
} as const;

export const storageKeys = {
  user: '@poupeai:user',
  tokens: '@poupeai:tokens',
} as const;

export const authConfig = {
  scopes: ['openid', 'profile', 'email'] as string[],
  additionalParameters: {
    audience: 'account',
  },
  responseType: 'code' as const,
  usePKCE: true,
  tokenExpirationMarginMs: 5 * 60 * 1000,
  navigationDelayMs: 200,
} as const;
