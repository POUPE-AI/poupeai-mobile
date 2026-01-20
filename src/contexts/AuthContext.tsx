import React, {
  createContext,
  useContext,
  useState,
  useRef,
  useCallback,
  useEffect,
  useLayoutEffect,
} from "react";
import { useRouter, useSegments } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { makeRedirectUri, useAuthRequest } from "expo-auth-session";
import * as WebBrowser from "expo-web-browser";

import {
  keycloakConfig,
  discoveryEndpoints,
  storageKeys,
  authConfig,
  validateAuthConfig,
} from "../config/auth";
import type {
  User,
  AuthContextData,
  TokenData,
  KeycloakUserInfo,
} from "../types";
import { api } from "@/services/api";

WebBrowser.maybeCompleteAuthSession();

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isNavigationReady, setIsNavigationReady] = useState(false);
  const segments = useSegments();
  const router = useRouter();
  const hasInitialized = useRef(false);
  const processedResponseRef = useRef<string | null>(null);
  const refreshTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const redirectUri = makeRedirectUri({
    scheme: keycloakConfig.appScheme,
    queryParams: {
      client_id: keycloakConfig.clientId,
    },
  });

  const [request, response, promptAsync] = useAuthRequest(
    {
      clientId: keycloakConfig.clientId,
      scopes: authConfig.scopes,
      redirectUri,
      responseType: authConfig.responseType,
      usePKCE: authConfig.usePKCE,
    },
    discoveryEndpoints,
  );

  const refreshToken = useCallback(
    async (storedTokens: TokenData): Promise<TokenData | null> => {
      try {
        console.log("Tentando renovar token...");

        if (!storedTokens.refresh_token) {
          console.log("Refresh token não encontrado");
          return null;
        }

        // Validar se o refresh token não está corrompido
        if (
          typeof storedTokens.refresh_token !== "string" ||
          storedTokens.refresh_token.trim() === ""
        ) {
          console.log("Refresh token inválido ou corrompido");
          return null;
        }

        // Verificar se o refresh token é um JWT válido
        const refreshTokenParts = storedTokens.refresh_token.split(".");
        if (refreshTokenParts.length !== 3) {
          console.log("Refresh token não é um JWT válido");
          return null;
        }

        // Verificar se o refresh token não expirou
        try {
          const payload = JSON.parse(atob(refreshTokenParts[1]));
          const refreshTokenExp = payload.exp * 1000;
          const now = Date.now();

          if (refreshTokenExp <= now) {
            console.log("Refresh token expirado");
            return null;
          }
        } catch (error) {
          console.log("Erro ao decodificar refresh token:", error);
          return null;
        }

        console.log(
          "Enviando requisição de refresh token para:",
          discoveryEndpoints.tokenEndpoint,
        );

        const requestBody = new URLSearchParams();
        requestBody.append("grant_type", "refresh_token");
        requestBody.append("client_id", keycloakConfig.clientId);
        requestBody.append("refresh_token", storedTokens.refresh_token);

        // Método alternativo de construção do body (para debug)
        const alternativeBody = `grant_type=refresh_token&client_id=${encodeURIComponent(
          keycloakConfig.clientId,
        )}&refresh_token=${encodeURIComponent(storedTokens.refresh_token)}`;

        const refreshResponse = await fetch(discoveryEndpoints.tokenEndpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Accept: "application/json",
            "Cache-Control": "no-cache",
          },
          body: alternativeBody,
        });

        if (!refreshResponse.ok) {
          const errorText = await refreshResponse.text();
          console.log("Falha ao renovar token:", refreshResponse.status);
          console.log("Erro detalhado:", errorText);

          try {
            const errorJson = JSON.parse(errorText);
            console.log("Erro JSON:", errorJson);
          } catch {
            console.log("Resposta não é JSON válido");
          }

          return null;
        }

        const newTokens = await refreshResponse.json();

        const tokenData: TokenData = {
          ...newTokens,
          expiresAt: new Date(
            Date.now() + (newTokens.expires_in - 300) * 1000,
          ).toISOString(),
        };

        await Promise.all([
          AsyncStorage.setItem(storageKeys.tokens, JSON.stringify(tokenData)),
          api.updateToken(tokenData.access_token),
        ]);

        console.log("Token renovado com sucesso");
        return tokenData;
      } catch (error) {
        console.log("Erro ao renovar token:", error);
        return null;
      }
    },
    [],
  );

  const scheduleTokenRefresh = useCallback(
    (expiresAt: string) => {
      if (refreshTimeoutRef.current) {
        clearTimeout(refreshTimeoutRef.current);
      }

      const expirationTime = new Date(expiresAt).getTime();
      const currentTime = Date.now();
      const timeUntilRefresh = expirationTime - currentTime - 10 * 60 * 1000;

      if (timeUntilRefresh > 0) {
        refreshTimeoutRef.current = setTimeout(async () => {
          try {
            const storedTokens = await AsyncStorage.getItem(storageKeys.tokens);
            if (storedTokens && user) {
              const tokens = JSON.parse(storedTokens);
              const newTokens = await refreshToken(tokens);

              if (newTokens) {
                scheduleTokenRefresh(newTokens.expiresAt);
              } else {
                await signOut();
              }
            }
          } catch (error) {
            console.log("Erro na renovação agendada:", error);
            await signOut();
          }
        }, timeUntilRefresh);
      }
    },
    [user, refreshToken],
  );

  const initializeAuth = useCallback(async () => {
    if (hasInitialized.current) return;

    // Validar configurações de autenticação
    const configValidation = validateAuthConfig();
    if (!configValidation.isValid) {
      console.error(
        "Configuração de autenticação inválida:",
        configValidation.errors,
      );
      setIsLoading(false);
      hasInitialized.current = true;
      setIsNavigationReady(true);
      return;
    }

    try {
      const [storedUser, storedTokens] = await Promise.all([
        AsyncStorage.getItem(storageKeys.user),
        AsyncStorage.getItem(storageKeys.tokens),
      ]);

      if (storedUser && storedTokens) {
        const userData = JSON.parse(storedUser);
        const tokens = JSON.parse(storedTokens);

        const expirationTime = new Date(tokens.expiresAt).getTime();
        const currentTime = Date.now();
        const marginTime = authConfig.tokenExpirationMarginMs;

        if (expirationTime > currentTime + marginTime) {
          console.log("✅ Token válido encontrado");
          setUser(userData);
          scheduleTokenRefresh(tokens.expiresAt);
        } else if (
          tokens.refresh_token &&
          expirationTime > currentTime - 24 * 60 * 60 * 1000
        ) {
          console.log("🔄 Token expirado, tentando renovar...");
          console.log(
            "Token expira em:",
            new Date(tokens.expiresAt).toISOString(),
          );
          console.log("📝 Tempo atual:", new Date(currentTime).toISOString());
          console.log(
            "Diferença em horas:",
            (currentTime - expirationTime) / (1000 * 60 * 60),
          );

          const newTokens = await refreshToken(tokens);

          if (newTokens) {
            setUser(userData);
            scheduleTokenRefresh(newTokens.expiresAt);
          } else {
            console.log(
              "Falha ao renovar token, limpando dados de autenticação",
            );
            await AsyncStorage.multiRemove([
              storageKeys.user,
              storageKeys.tokens,
            ]);
          }
        } else {
          console.log("Tokens expirados, limpando dados");
          await AsyncStorage.multiRemove([
            storageKeys.user,
            storageKeys.tokens,
          ]);
        }
      }
    } catch (error) {
      console.log("Erro ao carregar autenticação:", error);
      await AsyncStorage.multiRemove([storageKeys.user, storageKeys.tokens]);
    } finally {
      setIsLoading(false);
      hasInitialized.current = true;
      setIsNavigationReady(true);
    }
  }, [refreshToken, scheduleTokenRefresh]);

  useEffect(() => {
    return () => {
      if (refreshTimeoutRef.current) {
        clearTimeout(refreshTimeoutRef.current);
      }
    };
  }, []);

  const handleAuthResponseCallback = useCallback(
    async (authResponse: typeof response) => {
      if (!authResponse || !request) return;

      const code =
        authResponse.type === "success" ? authResponse.params?.code : null;
      const responseId = `${authResponse.type}-${code || "no-code"}`;

      if (processedResponseRef.current === responseId) {
        return;
      }

      if (authResponse.type === "success" && code) {
        processedResponseRef.current = responseId;
        await handleAuthResponse(code);
      } else if (authResponse.type === "error") {
        console.log("Erro na autenticação:", authResponse.error);
        setIsLoading(false);
        setIsNavigationReady(true);
      } else if (authResponse.type === "cancel") {
        console.log("Autenticação cancelada pelo usuário");
        setIsLoading(false);
        setIsNavigationReady(true);
      }
    },
    [request],
  );

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  useEffect(() => {
    if (!isNavigationReady || isLoading || !hasInitialized.current) return;

    const navigationTimeout = setTimeout(() => {
      const inAuthGroup = segments[0] === "(drawer)";
      const isLoginScreen = segments[0] === "login";
      const isOAuthCallback = segments[0] === "oauth";

      if (!user && inAuthGroup) {
        console.log("Redirecionando para login - usuário não autenticado");
        router.replace("/login");
      } else if (
        user &&
        (isLoginScreen || (!inAuthGroup && !isOAuthCallback))
      ) {
        console.log("Redirecionando para app - usuário autenticado");
        router.replace("/(drawer)/(tabs)/");
      }
    }, 100);

    return () => clearTimeout(navigationTimeout);
  }, [user, isLoading, segments, router, isNavigationReady, hasInitialized]);

  useLayoutEffect(() => {
    handleAuthResponseCallback(response);
  }, [response, handleAuthResponseCallback]);

  const handleAuthResponse = useCallback(
    async (code: string) => {
      try {
        console.log("Processando código de autorização...");
        setIsLoading(true);

        if (!request?.codeVerifier) {
          throw new Error("Code verifier não encontrado. O PKCE falhou.");
        }

        const requestBody = new URLSearchParams();
        requestBody.append("grant_type", "authorization_code");
        requestBody.append("client_id", keycloakConfig.clientId);
        requestBody.append("code", code);
        requestBody.append("redirect_uri", redirectUri);
        requestBody.append("code_verifier", request.codeVerifier);

        const tokenResponse = await fetch(discoveryEndpoints.tokenEndpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Accept: "application/json",
          },
          body: requestBody.toString(),
        });

        if (!tokenResponse.ok) {
          const responseText = await tokenResponse.text();
          throw new Error(
            `Erro na requisição de token: ${tokenResponse.status} - ${responseText}`,
          );
        }

        const tokens = await tokenResponse.json();

        if (!tokens.access_token) {
          throw new Error("Access token não encontrado na resposta");
        }

        const userInfoResp = await fetch(discoveryEndpoints.userInfoEndpoint, {
          headers: { Authorization: `Bearer ${tokens.access_token}` },
        });

        if (!userInfoResp.ok) {
          throw new Error(
            `Erro ao buscar info do usuário: ${userInfoResp.status}`,
          );
        }

        const userInfo: KeycloakUserInfo = await userInfoResp.json();

        const userData: User = {
          id: userInfo.sub,
          name:
            userInfo.name ||
            userInfo.preferred_username ||
            userInfo.email?.split("@")[0] ||
            "Usuário",
          email: userInfo.email,
        };

        const tokenData: TokenData = {
          ...tokens,
          expiresAt: new Date(
            Date.now() + (tokens.expires_in - 300) * 1000,
          ).toISOString(),
        };

        await Promise.all([
          AsyncStorage.setItem(storageKeys.user, JSON.stringify(userData)),
          AsyncStorage.setItem(storageKeys.tokens, JSON.stringify(tokenData)),
          api.updateToken(tokenData.access_token),
        ]);

        setUser(userData);
        scheduleTokenRefresh(tokenData.expiresAt);

        console.log("Autenticação concluída com sucesso");
        router.replace("/(drawer)/(tabs)/");
      } catch (error) {
        console.log("Erro ao processar autenticação:", error);
        await AsyncStorage.multiRemove([storageKeys.user, storageKeys.tokens]);
        processedResponseRef.current = null;
      } finally {
        setIsLoading(false);
        setIsNavigationReady(true);
      }
    },
    [request, redirectUri, router, scheduleTokenRefresh],
  );

  const signIn = useCallback(async (): Promise<{
    success: boolean;
    cancelled?: boolean;
  }> => {
    try {
      if (!request) {
        console.log("⚠️ Request não está pronto para autenticação");
        return { success: false };
      }

      console.log("Iniciando processo de login...");
      const result = await promptAsync();

      switch (result.type) {
        case "success":
          console.log("Login bem-sucedido");
          return { success: true };
        case "cancel":
          console.log("Login cancelado pelo usuário");
          return { success: false, cancelled: true };
        case "error":
          console.log("Erro no login:", result.error);
          return { success: false };
        default:
          console.log(`Tipo de resposta inesperado: ${result.type}`);
          return { success: false };
      }
    } catch (error) {
      console.log("Erro inesperado no login:", error);
      return { success: false };
    }
  }, [promptAsync, request]);

  const signOut = useCallback(async (): Promise<void> => {
    try {
      console.log("Iniciando processo de logout...");

      if (refreshTimeoutRef.current) {
        clearTimeout(refreshTimeoutRef.current);
        refreshTimeoutRef.current = null;
      }

      const storedTokens = await AsyncStorage.getItem(storageKeys.tokens);

      const cleanupPromise = AsyncStorage.multiRemove([
        storageKeys.user,
        storageKeys.tokens,
      ]);
      setUser(null);
      processedResponseRef.current = null;

      if (storedTokens) {
        const tokens = JSON.parse(storedTokens);

        const logoutUrl = new URL(
          `${discoveryEndpoints.authorizationEndpoint.replace(
            "/auth",
            "/logout",
          )}`,
        );
        logoutUrl.searchParams.append("client_id", keycloakConfig.clientId);
        logoutUrl.searchParams.append("post_logout_redirect_uri", redirectUri);

        if (tokens.id_token) {
          logoutUrl.searchParams.append("id_token_hint", tokens.id_token);
        }

        WebBrowser.openAuthSessionAsync(
          logoutUrl.toString(),
          redirectUri,
        ).catch((logoutError) => {
          console.log("⚠️ Erro ao abrir logout no navegador:", logoutError);
        });

        if (tokens.refresh_token) {
          fetch(discoveryEndpoints.revocationEndpoint, {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams({
              client_id: keycloakConfig.clientId,
              token: tokens.refresh_token,
              token_type_hint: "refresh_token",
            }),
          }).catch((revokeError) => {
            console.log("⚠️ Erro ao revogar token no servidor:", revokeError);
          });
        }
      }

      await cleanupPromise;
      console.log("Logout concluído");
    } catch (error) {
      console.log("Erro no logout:", error);
      if (refreshTimeoutRef.current) {
        clearTimeout(refreshTimeoutRef.current);
        refreshTimeoutRef.current = null;
      }
      await AsyncStorage.multiRemove([storageKeys.user, storageKeys.tokens]);
      setUser(null);
    }
  }, [redirectUri]);

  const contextValue = React.useMemo(
    () => ({
      user,
      isLoading,
      signIn,
      signOut,
      isAuthenticated: !!user,
      isNavigationReady,
    }),
    [user, isLoading, signIn, signOut, isNavigationReady],
  );

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  return context;
}
