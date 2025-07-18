export const validateEnvVariables = () => {
  const requiredVars = [
    'EXPO_PUBLIC_KEYCLOAK_BASE_URL',
    'EXPO_PUBLIC_KEYCLOAK_REALM',
    'EXPO_PUBLIC_KEYCLOAK_CLIENT_ID',
    'EXPO_PUBLIC_APP_SCHEME',
  ];

  const missing = requiredVars.filter(varName => !process.env[varName]);

  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
};
