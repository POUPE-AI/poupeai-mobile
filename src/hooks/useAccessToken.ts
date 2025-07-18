import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { storageKeys } from '../config/auth';
import { useAuth } from '../contexts/AuthContext';

interface TokenData {
  access_token: string;
  refresh_token?: string;
  expires_in: number;
  expiresAt: string;
}

export const useAccessToken = () => {
  const { isAuthenticated } = useAuth();
  const [accessToken, setAccessToken] = useState<string | null>(null);

  useEffect(() => {
    const loadToken = async () => {
      if (isAuthenticated) {
        try {
          const storedTokens = await AsyncStorage.getItem(storageKeys.tokens);
          if (storedTokens) {
            const tokenData: TokenData = JSON.parse(storedTokens);
            setAccessToken(tokenData.access_token);
          }
        } catch (error) {
          console.log('❌ Erro ao carregar token:', error);
          setAccessToken(null);
        }
      } else {
        setAccessToken(null);
      }
    };

    loadToken();
  }, [isAuthenticated]);

  return accessToken;
};
