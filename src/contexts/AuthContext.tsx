import React, { createContext, useContext, useState, useRef, useCallback, useEffect, useLayoutEffect } from 'react';
import { useRouter, useSegments } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { makeRedirectUri, useAuthRequest } from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import { useFocusEffect } from '@react-navigation/native';

import { keycloakConfig, discoveryEndpoints, storageKeys, authConfig } from '../config/auth';
import type { User, AuthContextData, TokenData, KeycloakUserInfo } from '../types';
import { api } from '@/services/api';

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

  const redirectUri = makeRedirectUri({
    scheme: keycloakConfig.appScheme,
    queryParams: {
      client_id: keycloakConfig.clientId,
    }
  });

  const [request, response, promptAsync] = useAuthRequest(
    {
      clientId: keycloakConfig.clientId,
      scopes: authConfig.scopes,
      redirectUri,
      responseType: authConfig.responseType,
      usePKCE: authConfig.usePKCE,
    },
    discoveryEndpoints
  );

  const initializeAuth = useCallback(async () => {
    if (hasInitialized.current) return;
    
    try {
      const [storedUser, storedTokens] = await Promise.all([
        AsyncStorage.getItem(storageKeys.user),
        AsyncStorage.getItem(storageKeys.tokens)
      ]);
      
      if (storedUser && storedTokens) {
        const userData = JSON.parse(storedUser);
        const tokens = JSON.parse(storedTokens);
        
        if (tokens.expiresAt && new Date(tokens.expiresAt) > new Date(Date.now() + authConfig.tokenExpirationMarginMs)) {
          setUser(userData);
        } else {
          await AsyncStorage.multiRemove([storageKeys.user, storageKeys.tokens]);
        }
      }
    } catch (error) {
      console.log('❌ Erro ao carregar autenticação:', error);
    } finally {
      setIsLoading(false);
      hasInitialized.current = true;
      setIsNavigationReady(true);
    }
  }, []);

  const handleAuthResponseCallback = useCallback(async (authResponse: typeof response) => {
    if (!authResponse || !request) return;

    // Evita processar a mesma resposta múltiplas vezes
    const code = authResponse.type === 'success' ? authResponse.params?.code : null;
    const responseId = `${authResponse.type}-${code || 'no-code'}`;
    
    if (processedResponseRef.current === responseId) { return; }
    
    if (authResponse.type === 'success' && code) {
      processedResponseRef.current = responseId;
      await handleAuthResponse(code);
    } else if (authResponse.type === 'error') {
      console.log('❌ Erro na autenticação:', authResponse.error);
      setIsLoading(false);
    } else if (authResponse.type === 'cancel') {
      setIsLoading(false);
    }
  }, [request]);

  // Inicializa autenticação uma vez
  useFocusEffect(
    useCallback(() => {
      if (!hasInitialized.current) {
        initializeAuth();
      }
    }, [initializeAuth])
  );

  useEffect(() => {
    if (!isNavigationReady || isLoading) return;

    const inAuthGroup = segments[0] === '(drawer)';
    const isLoginScreen = segments[0] === 'login';

    if (!user && inAuthGroup) {
      router.replace('/login');
    } else if (user && (isLoginScreen || (!inAuthGroup && segments[0] !== 'oauth'))) {
      router.replace('/(drawer)/(tabs)/');
    }
  }, [user, isLoading, segments, router, isNavigationReady]);

  useLayoutEffect(() => {
    handleAuthResponseCallback(response);
  }, [response, handleAuthResponseCallback]);

  const handleAuthResponse = useCallback(async (code: string) => {
    try {
      if (isLoading) { return; }
      
      setIsLoading(true);

      if (!request?.codeVerifier) {
        throw new Error('Code verifier não encontrado. O PKCE falhou.');
      }

      const requestBody = new URLSearchParams({
        grant_type: 'authorization_code',
        client_id: keycloakConfig.clientId,
        code: code,
        redirect_uri: redirectUri,
        code_verifier: request.codeVerifier,
      });

      const tokenResponse = await fetch(discoveryEndpoints.tokenEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: requestBody.toString(),
      });

      if (!tokenResponse.ok) {
        const responseText = await tokenResponse.text();
        throw new Error(`Erro na requisição de token: ${tokenResponse.status} - ${responseText}`);
      }

      const tokens = await tokenResponse.json();
      
      if (!tokens.access_token) {
        throw new Error('Access token não encontrado na resposta');
      }

      const userInfoResp = await fetch(discoveryEndpoints.userInfoEndpoint, {
        headers: { Authorization: `Bearer ${tokens.access_token}` },
      });

      if (!userInfoResp.ok) {
        throw new Error(`Erro ao buscar info do usuário: ${userInfoResp.status}`);
      }

      const userInfo: KeycloakUserInfo = await userInfoResp.json();
      
      const userData: User = {
        id: userInfo.sub,
        name: userInfo.name || userInfo.preferred_username || userInfo.email?.split('@')[0] || 'Usuário',
        email: userInfo.email,
      };

      const tokenData: TokenData = {
        ...tokens,
        expiresAt: new Date(Date.now() + (tokens.expires_in - 300) * 1000).toISOString(),
      };

      await Promise.all([
        AsyncStorage.setItem(storageKeys.user, JSON.stringify(userData)),
        AsyncStorage.setItem(storageKeys.tokens, JSON.stringify(tokenData)),
        api.updateToken(tokenData.access_token)
      ]);

      setUser(userData);
      
      processedResponseRef.current = null;
      router.replace('/(drawer)/(tabs)/');
    } catch (error) {
      console.log('❌ Erro ao processar autenticação:', error);
      await AsyncStorage.multiRemove([storageKeys.user, storageKeys.tokens]);
      
      processedResponseRef.current = null;
    } finally {
      setIsLoading(false);
    }
  }, [request, redirectUri, router]);

  const signIn = useCallback(async (): Promise<boolean> => {
    try {
      if (!request) {
        return false;
      }

      const result = await promptAsync();
      
      switch (result.type) {
        case 'success':
          return true;
        case 'cancel':
          return false;
        case 'error':
          console.log('❌ Erro no login:', result.error);
          return false;
        default:
          return false;
      }
    } catch (error) {
      console.log('❌ Erro inesperado no login:', error);
      return false;
    }
  }, [promptAsync, request]);

  const signOut = useCallback(async (): Promise<void> => {
    try {
      const storedTokens = await AsyncStorage.getItem(storageKeys.tokens);
      
      const cleanupPromise = AsyncStorage.multiRemove([storageKeys.user, storageKeys.tokens]);
      setUser(null);
      
      processedResponseRef.current = null;

      if (storedTokens) {
        const tokens = JSON.parse(storedTokens);
        
        const logoutUrl = new URL(`${discoveryEndpoints.authorizationEndpoint.replace('/auth', '/logout')}`);
        logoutUrl.searchParams.append('client_id', keycloakConfig.clientId);
        logoutUrl.searchParams.append('post_logout_redirect_uri', redirectUri);
        
        if (tokens.id_token) {
          logoutUrl.searchParams.append('id_token_hint', tokens.id_token);
        }

        WebBrowser.openAuthSessionAsync(logoutUrl.toString(), redirectUri).catch(logoutError => {
          console.log('⚠️ Erro ao abrir logout no navegador:', logoutError);
        });

        if (tokens.refresh_token) {
          fetch(discoveryEndpoints.revocationEndpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({
              client_id: keycloakConfig.clientId,
              token: tokens.refresh_token,
              token_type_hint: 'refresh_token',
            }),
          }).catch(revokeError => {
            console.log('⚠️ Erro ao revogar token no servidor:', revokeError);
          });
        }
      }

      await cleanupPromise;
      
    } catch (error) {
      console.log('❌ Erro no logout:', error);
      await AsyncStorage.multiRemove([storageKeys.user, storageKeys.tokens]);
      setUser(null);
    }
  }, [redirectUri]);

  const contextValue = React.useMemo(() => ({
    user,
    isLoading,
    signIn,
    signOut,
    isAuthenticated: !!user,
    isNavigationReady,
  }), [user, isLoading, signIn, signOut, isNavigationReady]);

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
}
