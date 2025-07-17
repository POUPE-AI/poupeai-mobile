import React, { createContext, useContext, useEffect, useState } from 'react';
import { useRouter, useSegments } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthContextData {
  user: User | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<boolean>;
  signOut: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    loadStoredUser();
  }, []);

  // Lógica de navegação baseada na autenticação
  useEffect(() => {
    if (isLoading) return; // Aguarda carregar os dados

    const inAuthGroup = segments[0] === '(drawer)';

    if (!user && inAuthGroup) {
      // Usuário não logado tentando acessar área protegida
      router.replace('/login');
      console.log('Usuário não autenticado, redirecionando para login');
    } else if (user && !inAuthGroup && segments[0] !== 'login') {
      // Usuário logado sendo redirecionado para a área protegida
      router.replace('/(drawer)/(tabs)/home');
      console.log('Usuário autenticado, redirecionando para home');
    }
  }, [user, isLoading, segments]);

  async function loadStoredUser() {
    try {
      const storedUser = await AsyncStorage.getItem('@poupeai:user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.log('Erro ao carregar usuário:', error);
    } finally {
      setIsLoading(false);
    }
  }

  async function signIn(email: string, password: string): Promise<boolean> {
    try {
      if (email === 'test@test.com' && password === '123456') {
        const userData: User = {
          id: '1',
          name: 'João Silva',
          email: email,
        };

        await AsyncStorage.setItem('@poupeai:user', JSON.stringify(userData));
        setUser(userData);
        return true;
      }
      return false;
    } catch (error) {
      console.log('Erro no login:', error);
      return false;
    }
  }

  async function signOut() {
    try {
      await AsyncStorage.removeItem('@poupeai:user');
      setUser(null);
    } catch (error) {
      console.log('Erro no logout:', error);
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        signIn,
        signOut,
        isAuthenticated: !!user,
      }}
    >
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
